import React, { Component } from 'react';
import { Platform, Share } from 'react-native';
import PropTypes from 'prop-types';
const keythereum = require("keythereum");
import RNFS from 'react-native-fs';
import moment from 'moment';
import { getData, setData, addAddress } from './data.service';
import '../../global';
import '../../shim.js';
import crypto from 'crypto'
import CryptoJS from 'crypto-js';
import { forkJoin, of, interval, throwError, fromEvent } from 'rxjs';
import { ADDRCONFIG } from 'dns';
import { InsertNewWallet, SelectAllWallet } from '../../realm/walletSchema'

export async function Register(password: string, network: string, name: string) {
    let key = await keythereum.create();
    let privateKeyBuffer = await key['privateKey'];
    let address = keythereum.privateKeyToAddress(privateKeyBuffer);
    let privateKey = await privateKeyBuffer.toString('hex');
    Address = await address;
    await restore(address, privateKey, password, name, network)
    setData('isBackup', '0');
}

export async function encryptPassword(password: string): string {
    var EnctypPW = CryptoJS.MD5(password).toString(CryptoJS.enc.Hex);
    return EnctypPW
}

export async function restore(address: string, privateKey: string, password: string, name: string, network: string) {
    privateKey = await CryptoJS.AES.encrypt(privateKey, password).toString();
    password = await encryptPassword(password);
    // await registered(true)
    cachePwd = await password;
    var wallet = {
        id: Math.floor(Date.now() / 1000),
        name: name,
        address: address,
        pk_en: privateKey,
        create: new Date(),
        V3JSON: '',
        network: {
            id: Math.floor(Date.now() / 1000),
            name: network
        },
        typeBackup: false,
        balance: 0,
    }
    InsertNewWallet(wallet);
    setData('PwApp', password);
}

export async function createKeystore(keyObject, password: string, address) {
    var datetime = new Date();
    var options = {
        kdf: "pbkdf2",
        cipher: "aes-128-ctr",
        kdfparams: {
            c: 262144,
            dklen: 32,
            prf: "hmac-sha256"
        }
    };
    await keythereum.dump(password, keyObject['privateKey'], keyObject['salt'], keyObject['iv'], options, (KOject) => {
        var NameFile = 'keystore--' + moment().format('YYYY-MM-DD') + '-' + datetime.getTime() + '--' + address + '.json'
        var path = (Platform.OS === 'ios' ? RNFS.TemporaryDirectoryPath + '/' + NameFile : RNFS.ExternalDirectoryPath + '/' + NameFile)
        RNFS.writeFile(path, JSON.stringify(KOject))
            .then(success => {
                if (Platform.OS == 'ios') {
                    Share.share({
                        url: path,
                        title: 'save keystore file'
                    }).then(share => {
                        if (share['action'] == "dismissedAction") {
                            checkIOS = 1;
                        } else {
                            checkIOS = 2;
                        }
                    }).catch(errShare => {
                        console.log(errShare)
                        checkIOS = 3
                    })
                }
                if (Platform.OS == 'android') {
                    var newPath = RNFS.ExternalStorageDirectoryPath + '/NextyWallet'
                    console.log(newPath)
                    if (RNFS.exists(newPath)) {
                        console.log('exist dir')
                    } else {
                        try {
                            const granted = PermissionsAndroid.request(
                                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
                                    title: "Grant SD card access",
                                    message: "We need access",
                                },
                            );
                            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                                console.log("Permission OK");
                            } else {
                                console.log("Permission failed");
                            }
                            RNFS.mkdir(newPath).then(ssFolder => {
                                RNFS.copyFile(path, newPath).catch(errCopy => {
                                    console.log(errCopy)
                                })
                            }).catch(errFolder => {
                                console.log(errFolder)

                            })
                        } catch (error) {
                            console.log(error)
                        }
                    }
                    checkIOS = 3
                }
            }).catch(error => {
                console.log(error)
                checkIOS = 3
            })
    });
}

export var checkIOS = 0;

export let isAuth: boolean;
export let Address: string;
export let privateKey: string;
export let cachePwd: string;


export async function validatePassword(password): boolean {
    var passEncrypt = await encryptPassword(password);
    return (cachePwd == passEncrypt)
}

export async function EnableTouchID(passcode) {
    var passcodeEn = await encryptPassword(passcode);
    console.log(passcodeEn)
    return new Promise((resolve, rejects) => {
        // getData(Address).then(async pwd => {
        //     if (passcodeEn != pwd) {
        //         rejects('invalid passcode');
        //         return;
        //     } else {
        //         var passcodeEncrypt = CryptoJS.AES.encrypt(passcode, passcodeEn).toString()
        //         resolve(passcodeEncrypt)
        //     }
        // })
        if (cachePwd != passcodeEn) {
            rejects('invalid passcode');
        } else {
            var passcodeEncrypt = CryptoJS.AES.encrypt(passcode, passcodeEn).toString()
            resolve(passcodeEncrypt)
        }
    })
}

export function Check_registered() {
    return new Promise((resolve, reject) => {
        SelectAllWallet().then(ListWallet => {
            if (ListWallet.length > 0) {
                resolve(true)
            } else {
                resolve(false)
            }
        }).catch(e => reject(false))
    })
}

export function Login2(password: string) {
    return new Promise(async (resolve, reject) => {
        password = await encryptPassword(password);
        getData('PwApp').then(pwd => {
            if (password != pwd) {
                reject('error')
            } else {
                cachePwd = password;
                resolve('login success')
            }
        }).catch(e => reject(e))
    })
}

export async function changePasscode(passwordOld: string, passwordNew: string) {
    var EnpasswordOld = await encryptPassword(passwordOld);
    var EnpasswordNew = await encryptPassword(passwordNew);
    return new Promise((resolve, rejects) => {
        getData(Address).then(async pwd => {
            if (EnpasswordOld != pwd) {
                rejects('invalid passcode');
                return;
            } else {
                let oldPk = CryptoJS.AES.decrypt(privateKey, passwordOld).toString(CryptoJS.enc.Utf8);
                console.log('old', oldPk, passwordOld)
                let newPk = CryptoJS.AES.encrypt(oldPk, passwordNew).toString();
                console.log('new', passwordNew, newPk)
                try {
                    await addAddress(Address, EnpasswordNew, newPk);
                    privateKey = newPk;
                    cachePwd = EnpasswordNew;
                    getData('TouchID').then((touch) => {
                        if (touch != null) {
                            var passcodeEncrypt = CryptoJS.AES.encrypt(passwordNew, EnpasswordNew).toString()
                            setData('TouchID', passcodeEncrypt)
                        }
                    })
                } catch (error) {
                    console.log(error)
                    rejects(error);
                    return;
                }
                resolve('change success')
            }
        })
    })
}


export async function getPrivateKey(password: string, privatekey: string) {
    let PK = CryptoJS.AES.decrypt(privatekey, password).toString(CryptoJS.enc.Utf8);
    return PK;
}


