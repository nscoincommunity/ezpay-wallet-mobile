import axios from 'axios';
import CONSTANTS from '../helper/constants'

export let exchangeRate: number = 0

export async function getExchangeRate() {
    return await axios.get(CONSTANTS.GETUSD)
        .then(data => {
            exchangeRate = data.data.data['quotes'].USD.price;
        })
}
