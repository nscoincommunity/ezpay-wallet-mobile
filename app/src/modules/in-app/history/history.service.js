import URI from '../../../../helpers/constant/uri';
import { POSTAPI, GETAPI } from '../../../../helpers/API'
import * as moment from "moment";
import Settings from '../../../../settings/initApp'

export class HistoryModel {
    tx: String;
    blockNumber: Number;
    from: String;
    to: String;
    value: Number;
    time: Moment;
}

export let historyData: Array<HistoryModel> = [];

export const getDataHistory = (start: number = 1, address, network, decimals) => new Promise((resolve, reject) => {
    let body = {
        address,
        start
    }
    if (network == 'tron') {
        let uri = URI.EXPLORER_API(network, Settings.testnet) + '/api/transaction?sort=-timestamp&count=true&limit=20&start=0&address=' + address
        GETAPI(uri)
            .then(res => res.json())
            .then(response => {
                console.log('response', response)
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
    } else {
        let uri = URI.EXPLORER_API(network, Settings.testnet) + '/api?module=account&action=txlist&address=' + address + '&page=' + start + '&offset=10&sort=desc'
        GETAPI(uri)
            .then(res => res.json())
            .then(response => {
                console.log('response', response)
                historyData = [];
                for (let entry of response.result) {
                    let historyEntry = new HistoryModel();
                    historyEntry.tx = entry['hash'];
                    historyEntry.blockNumber = entry['blockNumber'];
                    historyEntry.from = entry['from'];
                    historyEntry.to = entry['to'];
                    historyEntry.value = parseFloat(entry['value'] / Math.pow(10, decimals));
                    historyEntry.time = moment.unix(entry['timeStamp'])
                    historyData.push(historyEntry)
                }
                resolve(historyData)
            })
    }

})


