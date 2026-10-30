import type { HoldingJobListItem } from 'shared/types/job';
import { inject, injectable } from 'tsyringe';
import type { JobRepository } from '~/modules/job/domain/job.repository';
import { TOKENS } from '~/shared/infrastructure/di/tokens';
import { normalizeString as nz } from '~/shared/utils/string';

@injectable()
export class ListHoldingJobsUseCase {
  constructor(@inject(TOKENS.JobRepository) private readonly jobRepository: JobRepository) {}

  async execute(): Promise<HoldingJobListItem[]> {
    const holdingJobs = await this.jobRepository.findHoldingJobs();

    return holdingJobs.map((job) => ({
      jobOrderNo: nz(job.jobOrderNo),
      documentNo: nz(job.documentNo),
      abnormalLevel: job.abnormalLevel,
      holdAt: job.holdAt.toISOString(),
    }));
  }
}
