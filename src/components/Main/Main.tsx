import React, { useState } from 'react';
import { IlongestDaysWorkedTogetherWorkers } from '../../interfaces/fileData.interface';
import { readFilehandler } from '../service/fileHandler.service';

import './Main.css'

export const Main = () => {
    let [fileData, setFileData] = useState('');
    let [pairOfWorkersWithMostDays, setpairOfWorkersWithMostDays] =
        useState<IlongestDaysWorkedTogetherWorkers>({} as IlongestDaysWorkedTogetherWorkers);

    const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        if (!event.target.files) {
            return;
        }

        let reader = new FileReader();
        reader.onload = function (event) {
            const text = (event.target as FileReader).result;

            setFileData(text + '');
        }
        reader.readAsText(event.target.files[0])
    }

    const onFileSubmit = async () => {
        let result = await readFilehandler(fileData);

        setpairOfWorkersWithMostDays(result);
    }

    return (
        <section className="uploadData">
            <h3>Please Upload your file with data</h3>
            <h4><label htmlFor="myfile">Select a file:</label></h4>
            <input className="file" type="file" id="myfile" name="myfile" onChange={onFileChange} />
            <button className="submitBtn" onClick={onFileSubmit}>
                Submit your file
            </button>
            { pairOfWorkersWithMostDays.projFirstEmployee !== undefined 
                ? <table className="table">
                    <tr>
                        <th>Employee ID #1</th>
                        <th>Employee ID #2</th>
                        <th>Project Id</th>
                        <th>Days worked</th>
                    </tr>
                    <tr>
                        <td>{pairOfWorkersWithMostDays.projFirstEmployee?.EmpId}</td>
                        <td>{pairOfWorkersWithMostDays.projSecondEmployee?.EmpId}</td>
                        <td>{pairOfWorkersWithMostDays.projFirstEmployee?.ProjectId}</td>
                        <td>{pairOfWorkersWithMostDays.longestWorkedPairOfEmployees}</td>
                    </tr>
                </table>
                : null
            }
        </section>
    )
}