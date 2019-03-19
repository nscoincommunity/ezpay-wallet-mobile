import CryptoJS from 'crypto-js';
import { resolve } from 'url';
import { POSTAPI } from '../../helper/utils';
import CONSTANTS from '../../helper/constants';
import { restore } from '../../services/auth.service'
import { getAddressFromPK } from '../../services/wallet.service'

export function restoreByBackup(code: string, password: string) {
    let data = {
        md5Hash: CryptoJS.MD5(code).toString(CryptoJS.enc.Hex)
    }
    return new Promise((resolve, reject) => {
        POSTAPI(CONSTANTS.WALLET_API + '/api/restore', data)
            .then((response) => response.json())
            .then(async (res) => {
                var JSONres = JSON.parse(res);
                let addr = JSONres['walletAddress'];
                if (addr) {
                    let privateKeyEncrypted = JSONres['privateKeyEncrypted'];
                    let privateKey = await CryptoJS.AES.decrypt(privateKeyEncrypted, code).toString(CryptoJS.enc.Utf8);
                    resolve({
                        addressWL: addr,
                        privateKey: privateKey
                    })
                    // await restore(addr, privateKey, password).then(() =>
                    //     resolve(0));
                } else {
                    await reject(1)
                }
            }).catch(err => {
                reject(1)
            })
    })
}
export function restoreByPk(privateKey: string, password: string) {
    return new Promise((resolve, reject) => {
        getAddressFromPK(privateKey).then(async (res) => {
            console.log('address: ', res);
            let addr = res.toString();
            if (addr) {
                resolve({
                    addressWL: addr,
                    privateKey: privateKey
                })
                // await restore(addr, privateKey, password).then(() => resolve(0));
            } else {
                reject(1)
            }
        }).catch(err => {
            reject(1)
        })
    })

}