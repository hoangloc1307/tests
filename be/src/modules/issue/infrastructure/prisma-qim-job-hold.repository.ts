import { inject, injectable } from 'tsyringe';
import type { HoldJobData, JobHoldRepository } from '~/modules/issue/domain/job-hold.repository';
import { TOKENS } from '~/shared/infrastructure/di/tokens';
import type { PrismaClientQim } from '~/shared/infrastructure/prisma-qim';

@injectable()
export class PrismaQimJobHoldRepository implements JobHoldRepository {
  constructor(@inject(TOKENS.PrismaClientQim) private readonly prisma: PrismaClientQim) {}

  async hold({ jobOrderNo, documentNo, abnormalLevel }: HoldJobData): Promise<void> {
    await this.prisma.jobTagHold.create({
      data: {
        jobOrderNo,
        documentNo,
        abnormalLevel,
        status: true,
      },
    });
  }
}
