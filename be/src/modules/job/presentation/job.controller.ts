import type { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { GetJobInfoUseCase } from '~/modules/job/application/get-job-info.usecase';
import { ApiResponse } from '~/shared/presentation/api-response';

@injectable()
export class JobController {
  constructor(private readonly getJobInfoUseCase: GetJobInfoUseCase) {}

  detail = async (req: Request, res: Response) => {
    const jobOrderNo = req.params.jobOrderNo as string;

    const job = await this.getJobInfoUseCase.execute(jobOrderNo);
    ApiResponse.ok(res, job);
  };
}
