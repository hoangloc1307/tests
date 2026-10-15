import { Agent, fetch } from 'undici';
import { injectable } from 'tsyringe';
import type { HrClient, HrEmployee } from '~/modules/auth/domain/hr-client';
import { AppError } from '~/shared/domain/app-error';
import { env, isDev } from '~/shared/infrastructure/env';

interface HrApiResponse {
  Data: {
    EmployeeId: string;
    Name: string;
    Alias: string;
    ImageUrl: string;
    Gender: boolean;
    EntryDate: string;
    PlantId: string;
    DivisionId: string;
    DivisionName: string;
    DepartmentId: string;
    DepartmentName: string;
    SectionId: string;
    SectionName: string;
    PositionId: string;
    PositionName: string;
    PositionDescription: string;
  }[];
  StatusCode: string;
  Message: string;
  Success: boolean;
}

// Skip SSL verification in development (self-signed cert)
const dispatcher = isDev()
  ? new Agent({
      connect: {
        rejectUnauthorized: false,
      },
    })
  : undefined;

@injectable()
export class HttpHrClient implements HrClient {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = env.HR_ENDPOINT;
  }

  async getEmployeeByCardNumber(cardNumber: string): Promise<HrEmployee> {
    const url = `${this.baseUrl}/api/employee/${cardNumber}`;

    const response = await fetch(url, { dispatcher });

    if (!response.ok) {
      if (response.status === 404) {
        throw AppError.notFound('auth:employeeNotFound');
      }
      throw AppError.server('auth:hrServiceError');
    }

    const data = (await response.json()) as HrApiResponse;

    if (!data.Success || data.Data.length === 0) {
      throw AppError.notFound('auth:employeeNotFound');
    }

    const employee = data.Data[0];

    return {
      employeeId: employee.EmployeeId,
      name: employee.Name,
      alias: employee.Alias,
      imageUrl: employee.ImageUrl,
      gender: employee.Gender,
      entryDate: employee.EntryDate,
      plantId: employee.PlantId,
      divisionId: employee.DivisionId,
      divisionName: employee.DivisionName,
      departmentId: employee.DepartmentId,
      departmentName: employee.DepartmentName,
      sectionId: employee.SectionId,
      sectionName: employee.SectionName,
      positionId: employee.PositionId,
      positionName: employee.PositionName,
      positionDescription: employee.PositionDescription,
    };
  }
}
