import React, { Component } from 'react';
import '../../shim.js';
import crypto from 'crypto'
import '../../global';
import moment from 'moment';
const Web3 = require('web3');
// import Web3 from 'web3'
import { forkJoin, of, interval, throwError, fromEvent, Observable } from 'rxjs';
import GLOBALS from "../helper/constants";
import { Address, initAuth, validatePassword, getPrivateKey } from '../services/auth.service';
import CONSTANTS from '../helper/constants';
import { sign } from '@warren-bank/ethereumjs-tx-sign';
import bigInt from "big-integer";


// export var Web3: web3 = new web3(new web3.providers.HttpProvider(GLOBALS.WEB3_API));
const WEB3 = new Web3();
WEB3.setProvider(new WEB3.providers.HttpProvider('http://13.228.68.50:8545'));
export var balance: number = 0

export async function updateBalance() {
    if (Address == undefined) {
        return
    }

    of(await WEB3.eth.getBalance(Address))
        .subscribe(value => {
            if (value > 0) {
                balance = parseFloat(value / CONSTANTS.BASE_NTY).toFixed(3)
            } else {
                balance = 0
            }
        }), err => {
            console.log(err)
            balance = 0
        }
}


export async function getBalance(address) {
    return of(
        WEB3.eth.getBalance(address)
    ).subscribe(bal => {
        return bal;
    })
}

interface Tx {
    nonce?: string | number,
    chainId?: string | number,
    from?: string,
    to?: string,
    data?: string,
    value?: string | number,
    gas?: string | number,
    gasPrice?: string | number

}

export async function SendService(address: string, nty: number, password: string, exData?: string) {
    if (!validatePassword(password)) {
        throw ("Invalid local passcode")
    }
    // check address
    if (! await WEB3.utils.isAddress(address)) {
        throw ("Invalid address");
    }

    let sendValue = CONSTANTS.BASE_NTY2.valueOf() * nty;
    let hexValue = '0x' + bigInt(sendValue).toString(16);
    let txData: Tx;
    if (exData || exData != null) {
        txData = {
            from: Address,
            to: address,
            value: hexValue,
            data: exData
        };
    } else {
        txData = {
            from: Address,
            to: address,
            value: hexValue
        }
    }
    return new Promise((resolve, reject) => {
        WEB3.eth.getTransactionCount(Address)
            .then(async (nonce) => {
                console.log('getTransactionCount')
                txData.nonce = nonce;

                await estimateGas(txData).then(async (gas) => {
                    console.log("gas first: " + gas)
                    console.log('estimateGas')
                    txData.gas = gas;
                    let rawTx;
                    try {
                        rawTx = '0x' + await signTransaction(txData, await getPrivateKey(password))
                    } catch (ex) {
                        console.log(ex);
                        reject('cannot sign transaction')
                        return;
                    }

                    console.log('gas: ' + txData.gas)

                    WEB3.eth.sendSignedTransaction(rawTx, (error, hash) => {
                        console.log('sendSignedTransactionCount')
                        if (error) {
                            reject(error.message);
                            console.log('error' + error.message)
                        } else {
                            // update balance
                            console.log('send success')
                            updateBalance().then(() => {
                                console.log('update balance')
                                resolve(hash)
                            });
                        }
                    })
                })
            }).catch(err => {
                console.log('err', err)
                reject('server error')
            })

    })

}
export async function signTransaction(txData: Tx, privateKey: string) {
    let { rawTx } = sign(txData, privateKey);
    return rawTx
}
export async function estimateGas(transaction: Tx): number {
    let gas = WEB3.eth.estimateGas(transaction);
    console.log(gas)
    return gas;
}

