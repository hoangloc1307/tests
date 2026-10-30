import type { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { GetJobInfoUseCase } from '~/modules/job/application/get-job-info.usecase';
import { ListHoldingJobsUseCase } from '~/modules/job/application/list-holding-jobs.usecase';
import { ApiResponse } from '~/shared/presentation/api-response';

@injectable()
export class JobController {
  constructor(
    private readonly getJobInfoUseCase: GetJobInfoUseCase,
    private readonly listHoldingJobsUseCase: ListHoldingJobsUseCase,
  ) {}

  detail = async (req: Request, res: Response) => {
    const jobOrderNo = req.params.jobOrderNo as string;

    const job = await this.getJobInfoUseCase.execute(jobOrderNo);
    ApiResponse.ok(res, job);
  };

  holdingList = async (_req: Request, res: Response) => {
    const jobs = await this.listHoldingJobsUseCase.execute();
    ApiResponse.ok(res, jobs);
  };
}
