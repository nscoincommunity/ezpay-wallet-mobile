import axios from 'axios';
import CONSTANTS from '../helper/constants'
import { resolve } from 'url';

export let exchangeRate: number = 0;
export let exchangeRateETH: number = 0;

export function getExchangeRate() {
    return new Promise((resolve, reject) => {
        try {
            axios.get(CONSTANTS.GETUSD).then(data => {
                exchangeRate = data.data.data['quotes'].USD.price
                resolve(data.data.data['quotes'].USD.price);
            }).catch(e => reject(e))
        } catch (error) {
            reject(e)
        }
    })
}

export function getExchangeRateTRX() {
    return new Promise((resolve, reject) => {
        try {
            axios.get(CONSTANTS.GETUSD_TRX).then(data => {
                resolve(data.data.data['quotes'].USD.price);
            }).catch(e => reject(e))
        } catch (error) {
            reject(e)
        }
    })
}

export function getExchangeRateETH() {
    return new Promise((resolve, reject) => {
        try {
            axios.get(CONSTANTS.GETUSD_ETH).then(data => {
                exchangeRateETH = data.data.data['quotes'].USD.price
                resolve(data.data.data['quotes'].USD.price);
            }).catch(e => reject(e))
        } catch (error) {
            reject(e)
        }
    })
}