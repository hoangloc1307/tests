import type { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { ListTasksUseCase } from '~/modules/task/application/list-tasks.usecase';
import { ApiResponse } from '~/shared/presentation/api-response';

@injectable()
export class TaskController {
  constructor(private readonly listTasksUseCase: ListTasksUseCase) {}

  list = async (req: Request, res: Response) => {
    const username = req.user?.username as string;

    const tasks = await this.listTasksUseCase.execute(username);
    ApiResponse.ok(res, tasks);
  };
}
