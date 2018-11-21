import React, { Component } from 'react';
import '../../shim.js';
import crypto from 'crypto'
import '../../global';
import moment from 'moment';
const Web3 = require('web3');
// import Web3 from 'web3'
import { forkJoin, of, interval, throwError, fromEvent, Observable, merge } from 'rxjs';
import GLOBALS from "../helper/constants";
import { Address, initAuth, validatePassword, getPrivateKey } from '../services/auth.service';
import CONSTANTS from '../helper/constants';
import { sign } from '@warren-bank/ethereumjs-tx-sign';
import bigInt from "big-integer";
import { getData, setData } from './data.service'
import Language from '../i18n/i18n'


// export var Web3: web3 = new web3(new web3.providers.HttpProvider(GLOBALS.WEB3_API));
const WEB3 = new Web3();
WEB3.setProvider(new WEB3.providers.HttpProvider(CONSTANTS.WEB3_API));
export var balance: number = 0

export async function updateBalanceTK(params) {
    return new Promise(resolve => {
        var ListToken: Array = [];
        getData('ListToken').then(async data => {
            if (data != null) {
                ListToken = JSON.parse(data);
                for (let i = 0; i < ListToken.length; i++) {
                    if (ListToken[i].symbol == 'NTY') {
                        updateBalance().then(() => {
                            ListToken[i].balance = balance;
                            if (i == (ListToken.length - 1)) {
                                setData('ListToken', JSON.stringify(ListToken))
                                resolve('1')
                            }
                        })
                    } else {
                        var contract = await new WEB3.eth.Contract(ListToken[i].ABI, ListToken[i].tokenAddress)
                        await contract.methods.balanceOf(Address).call().then(bal => {
                            ListToken[i].balance = bal;
                        })
                        if (i == (ListToken.length - 1)) {
                            setData('ListToken', JSON.stringify(ListToken))
                            resolve('1')
                        }
                    }
                }
            }
        })
    })

}

export async function updateBalance() {
    if (Address == undefined) {
        return
    }

    of(await WEB3.eth.getBalance(Address))
        .subscribe(value => {
            // console.log('Address', Address);
            if (value > 0) {
                if (parseFloat(value / CONSTANTS.BASE_NTY) % 1 == 0) {
                    balance = parseFloat(value / CONSTANTS.BASE_NTY).toLocaleString()
                } else {
                    balance = parseFloat(value / CONSTANTS.BASE_NTY).toFixed(2).toLocaleString()
                }
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
    if (! await validatePassword(password)) {
        throw (Language.t('Send.AlerError.Content'))
    }
    // check address
    if (! await WEB3.utils.isAddress(address)) {
        throw (Language.t('Send.ValidAddress'));
    }

    let sendValue = CONSTANTS.BASE_NTY2.valueOf() * nty;
    let hexValue = '0x' + bigInt(sendValue).toString(16);
    let txData: Tx;
    if (exData || exData != null || exData != '') {
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
                reject(Language.t('Send.AlerError.TransactionFail'))
            })

    })

}

export async function SendToken(toAddress: string, tokenAddress, ABI, token: number, password: string, exData?: string) {
    if (! await validatePassword(password)) {
        throw (Language.t('Send.AlerError.Content'))
    }
    // check address
    if (! await WEB3.utils.isAddress(toAddress)) {
        throw (Language.t('Send.ValidAddress'));
    }

    var Contract = new WEB3.eth.Contract(ABI, tokenAddress, { from: Address });

    let txData: Tx;
    txData = {
        from: Address,
        to: tokenAddress,
        value: '0x0',
        data: Contract.methods.transfer(toAddress, token).encodeABI(),
        chainId: 66666
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
                reject('Returned error: insufficient funds for gas * price + value')
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
export async function getAddressFromPK(privateKey) {
    try {
        var account = WEB3.eth.accounts.privateKeyToAccount('0x' + privateKey);
    } catch (error) {
        console.log(error)
    }
    return new Promise((resolve) => {
        resolve(account.address)
    })
}

var ABI = [{ "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "owners", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_amount", "type": "uint256" }], "name": "sendTokens", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "INITIAL_SUPPLY", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "manager", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_subtractedValue", "type": "uint256" }], "name": "decreaseApproval", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getOwners", "outputs": [{ "name": "", "type": "address[]" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "tokenWallet", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "endDate", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_addedValue", "type": "uint256" }], "name": "increaseApproval", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" }], "name": "allowance", "outputs": [{ "name": "remaining", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "ownerByAddress", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_owners", "type": "address[]" }], "name": "setOwners", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "name": "tokenOwner", "type": "address" }, { "name": "_endDate", "type": "uint256" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "owners", "type": "address[]" }], "name": "SetOwners", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }];
export function GetInfoToken(TokenAddress) {

    return new Promise((resolve, reject) => {
        try {
            var ContractABI = new WEB3.eth.Contract(ABI, TokenAddress);
            console.log(ContractABI.methods);
            try {
            } catch (error) {
                console.log(error)
            }
        } catch (error) {
            reject(error);
            console.log(error)
        }

        forkJoin([
            ContractABI.methods.balanceOf(Address).call().catch(err => {
                return null;
            }),
            ContractABI.methods.symbol().call().catch(err => {
                return null;
            }),
            ContractABI.methods.decimals().call().catch(err => {
                return null;
            }),
            of(ABI)
        ]).subscribe(data => {
            console.log(data);
            var infoTK = {
                "balance": data[0],
                "symbol": data[1],
                "decimals": data[2],
                "ABI": data[3]
            }
            resolve(infoTK)
        }), err => {
            reject('get info fail')
        }
    })
}