import axios from 'axios';
import CONSTANTS from '../helper/constants'

export let exchangeRate: number = 0;
export let exchangeRateETH: number = 0;
export async function getExchangeRate() {
    return await axios.get(CONSTANTS.GETUSD)
        .then(data => {
            exchangeRate = data.data.data['quotes'].USD.price;
        })
}


export async function getExchangeRateETH() {
    return await axios.get(CONSTANTS.GETUSD_ETH)
        .then(data => {
            exchangeRateETH = data.data.data['quotes'].USD.price
        })
}