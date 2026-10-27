import type { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { GetTaskDetailUseCase } from '~/modules/task/application/get-task-detail.usecase';
import { ListTasksUseCase } from '~/modules/task/application/list-tasks.usecase';
import { ApiResponse } from '~/shared/presentation/api-response';

@injectable()
export class TaskController {
  constructor(
    private readonly listTasksUseCase: ListTasksUseCase,
    private readonly getTaskDetailUseCase: GetTaskDetailUseCase,
  ) {}

  list = async (req: Request, res: Response) => {
    const username = req.user?.username as string;

    const tasks = await this.listTasksUseCase.execute(username);
    ApiResponse.ok(res, tasks);
  };

  detail = async (req: Request, res: Response) => {
    const documentId = req.params.documentId as string;
    const taskId = req.params.taskId as string;

    const task = await this.getTaskDetailUseCase.execute(documentId, taskId);
    ApiResponse.ok(res, task);
  };
}
