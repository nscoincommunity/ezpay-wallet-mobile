import { ethers } from 'ethers';
import { validatePassword, getPrivateKey } from '../../services/auth.service';
import Language from '../../i18n/i18n';
import { ValidateAddress, Tx, getAddress, signTransactionDapp, HexToString } from '../../services/wallet.service';
import CONSTANTS from '../../helper/constants';
import bigInt from "big-integer";
import BigNumber from 'bignumber.js';


/**
 * Sign message tx return signerTx Dapps
 * @param {Tx} tx tx want sign
 * @param {string} passcode wallet local passcode
 * @param {string} pk_en private encrypt
 */
export const signMessageDapps = async (message, passcode: string, pk_en: string) => {
    if (!await validatePassword(passcode)) throw (Language.t('Send.AlerError.Content'));
    return new Promise(async (resolve, reject) => {
        try {
            let wallet = new ethers.Wallet(await getPrivateKey(passcode, pk_en));
            let signature = await wallet.signMessage(message)
            resolve(signature)
        } catch (error) {
            reject(error)
        }
    })
}

export const signTransaction = async (passcode, pk_en, from, to, data, value) => {
    if (!await validatePassword(passcode)) throw (Language.t('Send.AlerError.Content'));
    return new Promise(async (resolve, reject) => {
        signTransactionDapp(from, to, value, data, await getPrivateKey(passcode, pk_en))
            .then(tx => {
                resolve(tx)
            }).catch(e => reject(e))
    })
}

export const convertHexToString = async (object) => {
    const value = HexToString(object.value) / 1e18
    const gas = HexToString(object.gas);
    const gasPrice = HexToString(object.gasPrice) / 1e9
    return {
        value,
        gas,
        gasPrice
    }
}