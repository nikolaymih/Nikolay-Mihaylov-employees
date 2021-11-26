import { IFileData, IlongestDaysWorkedTogetherWorkers, IUserProjects } from "../../interfaces/fileData.interface";
import moment from "moment";

export const readFilehandler = async (fileDataString: string) => {
    let fileDataArray: string[] = fileDataString.split('\r\n');

    let usersProjects: IUserProjects = createEmployeesObjectWithParticipatedProjects(fileDataArray);

    let pairOfEmployeesWithWorkingDays = findPairOfWorkersWWorkedLongestTogether(usersProjects);

    return pairOfEmployeesWithWorkingDays;
}

const createEmployeesObjectWithParticipatedProjects = (fileDataArray: string[]): IUserProjects => {
    let objValues: string[] = [];
    let objKeys: string[] = [
        'EmpId', 'ProjectId', 'DateFrom', 'DateTo'
    ];
    let singleEmployeeRecord: { [x: string]: string | number; } = {};
    let usersProjects: IUserProjects = {};

    for (let index = 0; index <= fileDataArray.length - 1; index++) {
        objValues = fileDataArray[index].split(', ');

        // eslint-disable-next-line no-loop-func
        objValues.forEach((_x, index) => {
            if (index === 0 || index === 1) {
                singleEmployeeRecord[objKeys[index]] = Number(objValues[(index)]);
                return;
            }
            singleEmployeeRecord[objKeys[index]] = objValues[index];
        })

        const singleEmployeeRecordCopy: IFileData = Object.assign({}, singleEmployeeRecord) as unknown as IFileData;

        let isEmpIdInTheArray = Object.keys(usersProjects).some(k => Number(k) === singleEmployeeRecordCopy.EmpId);

        let employeeId = singleEmployeeRecordCopy.EmpId;

        const userSingleProject = {
            ...singleEmployeeRecordCopy
        };

        if (isEmpIdInTheArray) {
            usersProjects[employeeId].push(userSingleProject);
        } else {
            usersProjects[employeeId] = [];
            usersProjects[employeeId].push(userSingleProject);
        }
    }
    return usersProjects;
}

const findPairOfWorkersWWorkedLongestTogether = (usersProjects: IUserProjects) => {
    let usersProjectsArray: [string, IFileData[]][] = Object.entries(usersProjects);
    let longestDaysWorkedTogether: number = 0;
    let pairOfEmployeesWithWorkingDays = {}

    for (let i = 0; i < usersProjectsArray.length - 1; i++) {
        for (let j = i + 1; j < usersProjectsArray.length; j++) {
            // eslint-disable-next-line no-loop-func
            usersProjectsArray[i].forEach((employeeProjects: string | IFileData[]) => {
                if (typeof employeeProjects === 'string') {
                    return
                }
                employeeProjects.forEach((projectFirstEmployee: IFileData) => {
                    usersProjectsArray[j].forEach((employeeProjects: string | IFileData[]) => {
                        if (typeof employeeProjects === 'string') {
                            return
                        }
                        employeeProjects.forEach((projectSecondEmployee: IFileData) => {
                            pairOfEmployeesWithWorkingDays = compareTwoProjects(
                                projectFirstEmployee,
                                projectSecondEmployee,
                                longestDaysWorkedTogether,
                                pairOfEmployeesWithWorkingDays
                            );
                        })
                    })
                })
            })

        }
    }

    return pairOfEmployeesWithWorkingDays as unknown as IlongestDaysWorkedTogetherWorkers
}

const compareTwoProjects = (
    projFirstEmployee: IFileData,
    projSecondEmployee: IFileData,
    longestWorkedPairOfEmployees: number,
    pairOfEmployeesWithWorkingDays: object) => {

    if (projFirstEmployee.ProjectId !== projSecondEmployee.ProjectId) {
        return pairOfEmployeesWithWorkingDays;
    }

    if (projFirstEmployee.DateTo === 'NULL') {
        projFirstEmployee.DateTo = moment().format("YYYY/MM/DD");
    }

    if (projFirstEmployee.DateTo === 'NULL') {
        projSecondEmployee.DateTo = moment().format("YYYY/MM/DD");
    }

    if (!moment(projFirstEmployee.DateFrom).isValid() &&
        !moment(projFirstEmployee.DateTo).isValid() &&
        !moment(projSecondEmployee.DateFrom).isValid() &&
        !moment(projSecondEmployee.DateTo).isValid()
    ) {
        return pairOfEmployeesWithWorkingDays;
    }

    const firstDateFrom = moment(projFirstEmployee.DateFrom);
    const firstDateTo = moment(projFirstEmployee.DateTo);
    const secondDateFrom = moment(projSecondEmployee.DateFrom);
    const secondDateTo = moment(projSecondEmployee.DateTo);

    let period;

    if (firstDateFrom.format() < secondDateFrom.format()) {
        if (firstDateTo.format() <= secondDateTo.format()) {
            if (firstDateTo.format() > secondDateFrom.format()) {
                period = firstDateTo.diff(secondDateFrom);
            } else {
                return pairOfEmployeesWithWorkingDays;
            }
        } else {
            period = secondDateTo.diff(secondDateFrom);
        }
    } else if (firstDateFrom.format() > secondDateFrom.format()) {
        if (firstDateTo.format() > secondDateTo.format()) {
            if (firstDateFrom.format() < secondDateTo.format()) {
                period = secondDateTo.diff(firstDateFrom);
            } else {
                return pairOfEmployeesWithWorkingDays;
            }
        } else {
            period = firstDateTo.diff(firstDateFrom);
        }
    } else if (firstDateFrom.format() === secondDateFrom.format()) {
        if (firstDateTo.format() <= secondDateTo.format()) {
            period = firstDateTo.diff(firstDateFrom);
        } else {
            period = secondDateTo.diff(secondDateFrom);
        }
    }

    let duration = moment.duration(period, 'milliseconds');
    let currentPairdays = Math.floor(duration.asDays());

    if (currentPairdays > longestWorkedPairOfEmployees) {
        longestWorkedPairOfEmployees = currentPairdays;
        pairOfEmployeesWithWorkingDays = { projFirstEmployee, projSecondEmployee, longestWorkedPairOfEmployees };
        return pairOfEmployeesWithWorkingDays;
    }

    return pairOfEmployeesWithWorkingDays;
}