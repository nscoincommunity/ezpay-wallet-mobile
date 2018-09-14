import React, { Component } from 'react';
import { Platform, Share } from 'react-native';
import PropTypes from 'prop-types';
const keythereum = require("keythereum");
import RNFS from 'react-native-fs';
import moment from 'moment';
import { getData, setData, addAddress, checkAuth, setAuth } from './data.service';
import '../../global';
import '../../shim.js';
import crypto from 'crypto'
import CryptoJS from 'crypto-js';
import { forkJoin, of, interval, throwError, fromEvent } from 'rxjs';
import { ADDRCONFIG } from 'dns';

export async function Register(password: string) {
    let key = await keythereum.create();
    let privateKeyBuffer = await key['privateKey'];
    let address = keythereum.privateKeyToAddress(privateKeyBuffer);
    let privateKey = await privateKeyBuffer.toString('hex');
    // await createKeystore(key, password, address)
    Address = await address;
    await restore(address, privateKey, password)
}

export async function encryptPassword(password: string): string {
    var EnctypPW = CryptoJS.MD5(password).toString(CryptoJS.enc.Hex);
    return EnctypPW
}

export async function restore(address: string, privateKey: string, password: string) {
    var cacheAddress;
    var cachePrivatekey;
    privateKey = await CryptoJS.AES.encrypt(privateKey, password).toString();
    password = await encryptPassword(password);
    await addAddress(address, password, privateKey);
    await setData('current', address);
    cacheAddress = await address;
    cachePrivatekey = await privateKey;
    cachePwd = await password;
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

export async function initAuth() {

    return forkJoin(
        of(await checkAuth()),
        of(await getData('current'))
    ).subscribe(val => {
        isAuth = val[0];
        Address = val[1];
        // console.log(isAuth, Address)
        if (isAuth) {
            getData(Address).then(async pwd => {
                cachePwd = await pwd;
                await getData('pk_' + Address).then(async pk => {
                    privateKey = await pk
                })
            })
        } else {
            return of(0)
        }
    })

    // await checkAuth()
    //     .then(data => {
    //         isAuth = await data;
    //     })
    // await getData('current').then(data => {
    //     Address = await data
    // })
    // if (isAuth) {
    //     Observable.forkJoin(

    //     )
    // } else {

    // }
}

export async function validatePassword(password): boolean {
    var passEncrypt = await encryptPassword(password);
    return (cachePwd == passEncrypt)
}

export async function Login(address: string, password: string) {
    // console.log(address, password)
    password = await encryptPassword(password);
    return getData(address).then(pwd => {
        if (password != pwd) {
            throw ('error')
        } else {
            return getData('pk_' + address).then(pk => {
                // console.log(pk)
                privateKey = pk;
                Address = address;
                cachePwd = password;
                return forkJoin(
                    fromEvent(setData('current', address)),
                    fromEvent(setAuth(true))
                )
            })
        }
    })
}
export async function AutoLogin(address: string, password: string) {
    return getData(address).then(pwd => {
        if (password != pwd) {
            throw ('error')
        } else {
            return getData('pk_' + address).then(pk => {
                privateKey = pk;
                cachePwd = password;
                return forkJoin(
                    fromEvent(setData('current', address)),
                    fromEvent(setAuth(true))
                )
            })
        }
    })
}

export async function logout() {
    return forkJoin(fromEvent(setAuth(false)))
}

export async function getPrivateKey(password: string) {
    let PK = CryptoJS.AES.decrypt(privateKey, password).toString(CryptoJS.enc.Utf8);
    return PK;
}