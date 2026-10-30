import type { JobInfo } from 'shared/types/job';
import { inject, injectable } from 'tsyringe';
import type { JobRepository } from '~/modules/job/domain/job.repository';
import { TOKENS } from '~/shared/infrastructure/di/tokens';
import type { PrismaClientQim } from '~/shared/infrastructure/prisma-qim';

@injectable()
export class PrismaQimJobRepository implements JobRepository {
  constructor(@inject(TOKENS.PrismaClientQim) private readonly prisma: PrismaClientQim) {}

  async findByJobOrderNo(jobOrderNo: string): Promise<JobInfo | null> {
    return this.prisma.jobInfo.findUnique({
      where: { jobOrderNo },
      select: {
        jobOrderNo: true,
        itemCode: true,
        lineNo: true,
        machineNo: true,
        lotNo: true,
      },
    });
  }
}
