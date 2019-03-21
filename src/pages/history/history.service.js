import { POSTAPI } from '../../helper/utils'
import CONSTANTS from '../../helper/constants';
import * as moment from "moment";
import { Moment } from "moment";


export class HistoryModel {
    tx: String;
    blockNumber: Number;
    from: String;
    to: String;
    value: Number;
    time: Moment;
}

export var historyData: Array<HistoryModel> = []

export function getDataHis(start: number = 0, length: number = 15, address, network) {
    console.log('index = ' + start)
    let body = {
        addr: address,
        start: start,
        length: length
    }
    switch (network) {
        case 'ethereum':
            return POSTAPI(CONSTANTS.EXPLORER_API_ETH + '/getAddressTransactions/' + address + '?apiKey=freekey')
                .then(response => response.json())
                .then(response => {
                    historyData = []
                    for (let entry of response) {
                        let historyEntry = new HistoryModel();
                        historyEntry.tx = entry['hash'];
                        historyEntry.blockNumber = 5;
                        historyEntry.from = entry['from'];
                        historyEntry.to = entry['to'];
                        let value = entry['value'];
                        historyEntry.time = moment.unix(entry['timestamp'])
                        historyData.push(historyEntry)
                    }
                    return historyData;
                })
        case 'nexty':
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
        default:
            break;
    }

}