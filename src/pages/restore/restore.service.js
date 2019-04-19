import CryptoJS from 'crypto-js';
import { resolve } from 'url';
import { POSTAPI } from '../../helper/utils';
import CONSTANTS from '../../helper/constants';
import { restore } from '../../services/auth.service';
import { getAddressFromPK, CheckIsETH } from '../../services/wallet.service';
import { CheckExistAddressWallet } from '../../../realm/walletSchema';
import Lang from '../../i18n/i18n';
import { ConvertFromAddressTron, CheckIsTRON, ConvertToAddressTron } from '../../services/tron.service'


export function restoreByBackup(code: string, network: string) {
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
                    console.log(network, CheckIsTRON(addr), CheckIsETH(addr))

                    if (network == 'tron') {
                        if (!CheckIsTRON(addr)) {
                            let addressTRON = await ConvertToAddressTron(addr);
                            await CheckExistAddressWallet(addressTRON).then(async type => {
                                if (type) {
                                    console.log('c')
                                    reject('Exist address, please use Change network if you want use other network for this address')
                                } else {
                                    let privateKeyEncrypted = JSONres['privateKeyEncrypted'];
                                    let privateKey = await CryptoJS.AES.decrypt(privateKeyEncrypted, code).toString(CryptoJS.enc.Utf8);
                                    resolve({
                                        addressWL: addressTRON,
                                        privateKey: privateKey
                                    })
                                }
                            }).catch(e => reject(Lang.t("Restore.InvalidRestoreCode")))
                        } else {
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
                        }
                    } else {
                        if (!CheckIsTRON(addr)) {
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
                            let temp = await ConvertFromAddressTron(addr);
                            let addressETH = '0x' + temp.slice(2, temp.length);
                            await CheckExistAddressWallet(addressETH).then(async type => {
                                if (type) {
                                    console.log('c')
                                    reject('Exist address, please use Change network if you want use other network for this address')
                                } else {
                                    let privateKeyEncrypted = JSONres['privateKeyEncrypted'];
                                    let privateKey = await CryptoJS.AES.decrypt(privateKeyEncrypted, code).toString(CryptoJS.enc.Utf8);
                                    resolve({
                                        addressWL: addressETH,
                                        privateKey: privateKey
                                    })
                                }
                            }).catch(e => reject(Lang.t("Restore.InvalidRestoreCode")))
                        }
                    }

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
export function restoreByPk(privateKey: string, password: string, network: string) {
    return new Promise((resolve, reject) => {
        getAddressFromPK(privateKey).then(async (res) => {
            let addr = res.toString();
            if (addr) {
                if (network == 'tron') {
                    if (!CheckIsTRON(addr)) {
                        let addressTRON = await ConvertToAddressTron(addr);
                        await CheckExistAddressWallet(addressTRON).then(async type => {
                            if (type) {
                                console.log('c')
                                reject('Exist address, please use Change network if you want use other network for this address')
                            } else {
                                resolve({
                                    addressWL: addressTRON,
                                    privateKey: privateKey
                                })
                            }
                        }).catch(e => reject(Lang.t("Restore.AlertInvalidPK")))
                    } else {
                        CheckExistAddressWallet(addr).then(async type => {
                            if (type) {
                                console.log('c')
                                reject('Exist address, please use Change network if you want use other network for this address')
                            } else {
                                resolve({
                                    addressWL: addr,
                                    privateKey: privateKey
                                })
                            }
                        }).catch(e => reject(Lang.t("Restore.AlertInvalidPK")))
                    }
                } else {
                    if (!CheckIsTRON(addr)) {
                        addr = addr.toLowerCase();
                        CheckExistAddressWallet(addr).then(async type => {
                            if (type) {
                                console.log('c')
                                reject('Exist address, please use Change network if you want use other network for this address')
                            } else {
                                resolve({
                                    addressWL: addr,
                                    privateKey: privateKey
                                })
                            }
                        }).catch(e => reject(Lang.t("Restore.AlertInvalidPK")))
                    } else {
                        let temp = await ConvertFromAddressTron(addr);
                        let addressETH = '0x' + temp.slice(2, temp.length);
                        await CheckExistAddressWallet(addressETH).then(async type => {
                            if (type) {
                                console.log('c')
                                reject('Exist address, please use Change network if you want use other network for this address')
                            } else {
                                resolve({
                                    addressWL: addressETH,
                                    privateKey: privateKey
                                })
                            }
                        }).catch(e => reject(Lang.t("Restore.AlertInvalidPK")))
                    }
                }
            } else {
                reject(Lang.t("Restore.AlertInvalidPK"))
            }
        }).catch(err => {
            reject(Lang.t("Restore.AlertInvalidPK"))
        })
    })

}