import { POSTAPI } from '../../helper/utils'
import CONSTANTS from '../../helper/constants';
import * as moment from "moment";
import { Moment } from "moment";
import { Address } from '../../services/auth.service';


export class HistoryModel {
    tx: String;
    blockNumber: Number;
    from: String;
    to: String;
    value: Number;
    time: Moment;
}

export var historyData: Array<HistoryModel> = []

export function getDataHis(start: number = 0, length: number = 15) {
    console.log('index = ' + start)
    let body = {
        addr: Address,
        start: start,
        length: length
    }

    return POSTAPI(CONSTANTS.EXPLORER_API + '/his', body)
        .then(response => response.json())
        .then(response => {
            historyData = []
            for (let entry of response) {
                let historyEntry = new HistoryModel();
                historyEntry.tx = entry[0];
                historyEntry.blockNumber = entry[1];
                historyEntry.from = entry[2];
                historyEntry.to = entry[3];

                let value = +entry[4];
                if (!isNaN(value)) {
                    historyEntry.value = value;
                } else {
                    historyEntry.value = 0;
                }
                historyEntry.time = moment.unix(entry[6]);

                historyData.push(historyEntry);
            }

            return historyData;
        })
        .catch(error => {
            console.log('error fetch: ', error)
        })
}