export interface IFileData {
    EmpId: number,
    ProjectId: number,
    DateFrom: string
    DateTo: string
}

export interface IUserProjects {
    [employeeId: number]: IFileData[];
}

export interface IlongestDaysWorkedTogetherWorkers {
    projFirstEmployee: IFileData,
    projSecondEmployee: IFileData,
    longestWorkedPairOfEmployees: number
}