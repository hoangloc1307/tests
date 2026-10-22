import { format } from 'date-fns';
import { inject, injectable } from 'tsyringe';
import type { A5TxClient } from '~/modules/issue/domain/a5-issue.repository';
import type {
  GenerateDocumentNoParams,
  SerialGenerator,
  SerialTokenReplacement,
} from '~/shared/application/serial-generator';
import { AppError } from '~/shared/domain/app-error';
import { TOKENS } from '~/shared/infrastructure/di/tokens';
import type { PrismaClientA5 } from '~/shared/infrastructure/prisma-a5';

const RESET_CYCLE = {
  DAILY: 'DAILY',
  MONTHLY: 'MONTHLY',
  YEARLY: 'YEARLY',
  NEVER: 'NEVER',
} as const;

/** Giá trị periodKey khi chuỗi không reset. */
const PERIOD_KEY_NEVER = 'ALL';

@injectable()
export class PrismaSerialGenerator implements SerialGenerator {
  constructor(@inject(TOKENS.PrismaClientA5) private readonly prisma: PrismaClientA5) {}

  async generate(params: GenerateDocumentNoParams, tx?: A5TxClient): Promise<string> {
    const { serialCode, createDate = new Date(), additionalInfo } = params;

    const db = tx ?? this.prisma;

    const sequence = await db.documentSequence.findUnique({
      where: { code: serialCode },
    });

    if (!sequence || !sequence.isActive) {
      throw AppError.server('common:error.serialConfigNotFound', { serialCode });
    }

    const periodKey = buildPeriodKey(sequence.resetCycle, createDate);
    const startNumber = Number(sequence.startSerialNo);
    const padLength = sequence.startSerialNo.length;

    if (Number.isNaN(startNumber)) {
      throw AppError.server('common:error.serialConfigNotFound', { serialCode });
    }

    const counter = await db.documentSequenceCounter.upsert({
      where: {
        sequenceCode_periodKey: { sequenceCode: serialCode, periodKey },
      },
      create: {
        sequenceCode: serialCode,
        periodKey,
        lastNumber: startNumber,
      },
      update: {
        lastNumber: { increment: sequence.step },
      },
    });

    const serialNo = counter.lastNumber.toString().padStart(padLength, '0');
    const middle = applyTokens(sequence.format, createDate, additionalInfo);

    return (sequence.prefix ?? '') + middle + serialNo + (sequence.suffix ?? '');
  }
}

function buildPeriodKey(resetCycle: string, createDate: Date): string {
  switch (resetCycle) {
    case RESET_CYCLE.DAILY:
      return format(createDate, 'yyyyMMdd');
    case RESET_CYCLE.MONTHLY:
      return format(createDate, 'yyyyMM');
    case RESET_CYCLE.YEARLY:
      return format(createDate, 'yyyy');
    case RESET_CYCLE.NEVER:
      return PERIOD_KEY_NEVER;
    default:
      return PERIOD_KEY_NEVER;
  }
}

function applyTokens(
  pattern: string | null,
  createDate: Date,
  additionalInfo?: SerialTokenReplacement[],
): string {
  if (!pattern) {
    return '';
  }

  let result = pattern
    .replaceAll('{yyyy}', format(createDate, 'yyyy'))
    .replaceAll('{yy}', format(createDate, 'yy'))
    .replaceAll('{MM}', format(createDate, 'MM'))
    .replaceAll('{mm}', format(createDate, 'MM'))
    .replaceAll('{dd}', format(createDate, 'dd'));

  if (additionalInfo) {
    for (const { key, value } of additionalInfo) {
      result = result.replaceAll(`{${key}}`, value);
    }
  }

  return result;
}
