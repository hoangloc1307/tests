import type { JobInfo } from 'shared/types/job';
import { inject, injectable } from 'tsyringe';
import type { JobRepository } from '~/modules/job/domain/job.repository';
import { AppError } from '~/shared/domain/app-error';
import { TOKENS } from '~/shared/infrastructure/di/tokens';

@injectable()
export class GetJobInfoUseCase {
  constructor(@inject(TOKENS.JobRepository) private readonly jobRepository: JobRepository) {}

  async execute(jobOrderNo: string): Promise<JobInfo> {
    const job = await this.jobRepository.findByJobOrderNo(jobOrderNo);
    if (!job) {
      throw AppError.notFound('common:error.jobNotFound', { jobOrderNo });
    }
    return job;
  }
}
