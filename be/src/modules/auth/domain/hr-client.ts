export interface HrEmployee {
  employeeId: string;
  name: string;
  alias: string;
  imageUrl: string;
  gender: boolean;
  entryDate: string;
  plantId: string;
  divisionId: string;
  divisionName: string;
  departmentId: string;
  departmentName: string;
  sectionId: string;
  sectionName: string;
  positionId: string;
  positionName: string;
  positionDescription: string;
}

export interface HrClient {
  getEmployeeByCardNumber(cardNumber: string): Promise<HrEmployee>;
}
