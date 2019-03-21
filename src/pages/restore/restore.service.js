import CryptoJS from 'crypto-js';
import { resolve } from 'url';
import { POSTAPI } from '../../helper/utils';
import CONSTANTS from '../../helper/constants';
import { restore } from '../../services/auth.service'
import { getAddressFromPK } from '../../services/wallet.service'
import { CheckExistAddressWallet } from '../../../realm/walletSchema'
import Lang from '../../i18n/i18n';

export function restoreByBackup(code: string) {
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
                    CheckExistAddressWallet(addr).then(async type => {
                        if (type) {
                            console.log('c')
                            reject('Exist address, please use Change network if you want use other network for this address')
                        } else {
                            let privateKeyEncrypted = JSONres['privateKeyEncrypted'];
                            let privateKey = await CryptoJS.AES.decrypt(privateKeyEncrypted, code).toString(CryptoJS.enc.Utf8);
                            resolve({
                                addressWL: addr,
                                privateKey: privateKey
                            })
                        }
                    }).catch(e => reject(Lang.t("Restore.InvalidRestoreCode")))
                } else {
                    console.log('a')
                    reject(Lang.t("Restore.InvalidRestoreCode"))
                }
            }).catch(err => {
                console.log('b', err)
                reject(Lang.t("Restore.InvalidRestoreCode"))
            })
    })
}
export function restoreByPk(privateKey: string, password: string) {
    return new Promise((resolve, reject) => {
        getAddressFromPK(privateKey).then(async (res) => {
            console.log('address: ', res);
            let addr = res.toString();
            if (addr) {
                CheckExistAddressWallet(addr).then(async type => {
                    if (type) {
                        reject('Exist address, please use Change network if you want use other network for this address')
                    } else {
                        resolve({
                            addressWL: addr,
                            privateKey: privateKey
                        })
                    }
                })
                // await restore(addr, privateKey, password).then(() => resolve(0));
            } else {
                reject(Lang.t("Restore.AlertInvalidPK"))
            }
        }).catch(err => {
            reject(Lang.t("Restore.AlertInvalidPK"))
        })
    })

}