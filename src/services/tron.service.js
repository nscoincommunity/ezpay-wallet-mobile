const TronWeb = require('tronweb');
import Language from '../i18n/i18n';
import { validatePassword, getPrivateKey } from './auth.service'
import CONSTANTS from '../helper/constants'

const TESTNET = "https://api.shasta.trongrid.io/";
const MAINNET = 'https://api.trongrid.io';
const TRONWEB = new TronWeb({
    fullHost: TESTNET,
})

export const ConvertToAddressTron = (address: string) => {
    return TRONWEB.address.fromHex(address);
}

export const ConvertFromAddressTron = (address: string) => {
    return TRONWEB.address.toHex(address)
}
export const UpdateBalanceTRON = (address: string) => {
    return new Promise((resolve, reject) => {
        resolve(TRONWEB.trx.getBalance(address))
    })
}

/**
 * Function send trx
 * @param {string} address_receive address wallet receive trx
 * @param {string} address_send address wallet send trx
 * @param {number} value number trx want send
 * @param {string} password local passcode
 * @param {string} pk private key encrypt
 * @param {string} exData extra data
 */
export const SendTRON = async (address_receive: string, address_send: string, value: number, password: string, pk: string, exData?: string) => {
    if (! await validatePassword(password)) {
        throw (Language.t('Send.AlerError.Content'))
    }
    console.log(TRONWEB.isAddress(address_receive), address_receive)
    if (!TRONWEB.isAddress(address_receive)) {
        throw (Language.t('Send.ValidAddress'));
    }
    let sendValue = await CONSTANTS.BASE_TRON.valueOf() * value;
    let hexValue = await '0x' + TRONWEB.toBigNumber(sendValue).toString(16);

    let hexAddress_receive = await TRONWEB.address.toHex(address_receive);
    let hexAddress_send = await TRONWEB.address.toHex(address_send);
    var transaction = await TRONWEB.transactionBuilder.sendTrx(hexAddress_receive, hexValue, hexAddress_send);
    console.log(transaction)
    const singedTransaction = await TRONWEB.trx.sign(transaction, await getPrivateKey(password, pk));
    return new Promise((resolve, reject) => {
        TRONWEB.trx.sendRawTransaction(singedTransaction).then(result => {
            resolve(result)
        }).catch(e => {
            reject(e)
        })
    })
}

export const SendTKTRON = async (address_receive) => {

}

