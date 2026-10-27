import { format, isValid } from 'date-fns';
import type { TaskListItem } from 'shared/types/task';
import { inject, injectable } from 'tsyringe';
import type { RoleRepository } from '~/modules/auth/domain/role.repository';
import type { TaskRepository } from '~/modules/task/domain/task.repository';
import type { FlowableClient } from '~/shared/application/flowable/flowable-client';
import { extractRejectReason } from '~/shared/application/flowable/flowable-task';
import { TOKENS } from '~/shared/infrastructure/di/tokens';
import { normalizeString as nz } from '~/shared/utils/string';

@injectable()
export class ListTasksUseCase {
  constructor(
    @inject(TOKENS.FlowableClient) private readonly flowableClient: FlowableClient,
    @inject(TOKENS.RoleRepository) private readonly roleRepository: RoleRepository,
    @inject(TOKENS.TaskRepository) private readonly taskRepository: TaskRepository,
  ) {}

  async execute(username: string): Promise<TaskListItem[]> {
    // 1. Lấy tất cả quyền hiện có của user để dựng candidate groups.
    const grants = await this.roleRepository.findActiveRolesByUsername(username);
    const candidateGroups = [
      ...new Set([username, ...grants.map((g) => `${g.roleName}_${g.sectionId}`)]),
    ];

    // 2. Lấy tất cả task đang chờ xử lý trên Flowable.
    const { data: tasks } = await this.flowableClient.queryTasks({ candidateGroups });
    if (tasks.length === 0) return [];

    // 3. Chuẩn bị id/keys để query DB tối thiểu.
    const instanceIds = [...new Set(tasks.map((t) => t.processInstanceId))];
    const stepKeys = [...new Set(tasks.map((t) => t.taskDefinitionKey))];

    // 4. Lấy document (WIP) và mô tả bước song song.
    const [documents, steps] = await Promise.all([
      this.taskRepository.findWipDocumentsByProcessInstanceIds(instanceIds),
      this.taskRepository.findActiveStepsByFlowableNames(stepKeys),
    ]);

    const docByInstanceId = new Map(documents.map((d) => [d.processInstanceId, d]));
    const stepDescByName = new Map(steps.map((s) => [s.stepKey, s.name]));

    // 5. Map task với document, bỏ qua task không có document WIP tương ứng.
    const result: TaskListItem[] = [];
    for (const task of tasks) {
      const document = docByInstanceId.get(task.processInstanceId);
      if (!document) continue;

      result.push({
        taskId: task.id,
        documentId: document.documentId,
        documentNo: nz(document.documentNo),
        documentType: document.documentType,
        issuingSection: nz(document.issueSection),
        receivingSection: document.receiveSection ? nz(document.receiveSection) : null,
        issuingDate: isValid(document.issueDate) ? format(document.issueDate, 'yyyyMMdd') : null,
        currentStep: stepDescByName.get(task.taskDefinitionKey) ?? null,
        createdBy: nz(document.createdBy),
        createdDate: isValid(document.createdAt)
          ? format(document.createdAt, 'yyyyMMddHHmmss')
          : null,
        rejectReason: extractRejectReason(task),
      });
    }

    return result;
  }
}
