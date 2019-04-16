import { POSTAPI, } from '../../helper/utils'
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

export function getDataHis(start: number = 1, address, network) {
    let body = {
        addr: address,
        start: start,
    }
    return new Promise((resolve, reject) => {
        switch (network) {
            case 'ethereum':
                POSTAPI(CONSTANTS.EXPLORER_API_ETH + '/getAddressTransactions/' + address + '?apiKey=freekey', '')
                    .then(response => response.json())
                    .then(response => {
                        console.log('history', response)
                        historyData = []
                        for (let entry of response) {
                            let historyEntry = new HistoryModel();
                            historyEntry.tx = entry['hash'];
                            historyEntry.blockNumber = 5;
                            historyEntry.from = entry['from'];
                            historyEntry.to = entry['to'];
                            historyEntry.value = entry['value'];
                            historyEntry.time = moment.unix(entry['timestamp'])
                            historyData.push(historyEntry)
                        }
                        resolve(historyData)
                    })
                break;
            case 'nexty':
                fetch(CONSTANTS.EXPLORER_API + '/api?module=account&action=txlist&address=' + address + '&page=' + start + '&offset=10')
                    .then(response => response.json())
                    .then(response => {
                        console.log(response.result)
                        historyData = [];
                        for (let entry of response.result) {
                            let historyEntry = new HistoryModel();
                            historyEntry.tx = entry['hash'];
                            historyEntry.blockNumber = entry['blockNumber'];
                            historyEntry.from = entry['from'];
                            historyEntry.to = entry['to'];
                            historyEntry.value = parseFloat(entry['value'] / CONSTANTS.BASE_NTY);
                            historyEntry.time = moment.unix(entry['timeStamp'])
                            historyData.push(historyEntry)
                        }
                        resolve(historyData)
                    })
                break;
            default:
                fetch(CONSTANTS.EXPLORER_API_TRX + '/api/transaction?sort=-timestamp&count=true&limit=20&start=0&address=' + address)
                    .then(response => response.json())
                    .then(response => {
                        historyData = [];
                        for (let entry of response.data) {
                            let historyEntry = new HistoryModel();
                            historyEntry.tx = entry['hash'];
                            historyEntry.blockNumber = entry['block'];
                            historyEntry.from = entry['ownerAddress'];
                            historyEntry.to = entry['toAddress'];
                            historyEntry.value = entry['contractData']['amount'];
                            historyEntry.time = moment.unix(entry['timestamp'])
                            historyData.push(historyEntry)
                        }
                        resolve(historyData)
                    })
                break;
        }
    })


}