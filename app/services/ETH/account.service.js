import Web3 from 'web3';
import ABI from '../../../ABI';
import BN from 'bn.js'
import { forkJoin } from 'rxjs';
import moment from 'moment';
import { sign } from '@warren-bank/ethereumjs-tx-sign';
import bigInt from 'big-integer';
import CONSTANT from '../../helpers/constant'
import { Tx } from '../index.account'

const WEB3 = new Web3()
// const WEB3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/'))
/**
 * Create account of network eth
 */
export const CreateETH = (network) => {
    return new Promise((resolve, reject) => {
        try {
            WEB3.setProvider(new WEB3.providers.HttpProvider(getProvider(network)))
            let account = WEB3.eth.accounts.create();
            resolve(account)
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * Get infor of token
 * @param {string} Token_Address address of token
 */
export const Get_Infor_Token = (Token_Address, network) => new Promise(async (resolve, reject) => {
    try {
        WEB3.setProvider(new WEB3.providers.HttpProvider(getProvider(network)))
        let Contract = await new WEB3.eth.Contract(ABI, Token_Address);
        await forkJoin([
            Contract.methods.symbol().call(console.log),
            Contract.methods.decimals().call(console.log)
        ]).subscribe(sub => {
            let token_object = {
                id: Math.floor(Date.now() / 1000),
                name: sub[0],
                network: network,
                address: Token_Address,
                price: 0,
                percent_change: 0,
                icon: '',
                decimals: parseFloat(sub[1])
            }
            resolve(token_object);
        })

    } catch (error) {
        reject(error)
    }
})
// /**
//  * Function update balance of address
//  * @param {string} address address wallet need update balance
//  * @param {string} network network need update balance
//  * @param {number} decimals decimals 
//  */
// export const Update_balance = (address, network, decimals) => {
//     return new Promise((resolve, reject) => {
//         WEB3.setProvider(new WEB3.providers.HttpProvider(getProvider(network)));
//         WEB3.eth.getBalance(address).then(bal => {
//             if (bal > 0) {
//                 if (parseFloat(bal / CONSTANT.Get_decimals(decimals)) % 1 == 0) {
//                     resolve(parseFloat(bal / CONSTANT.Get_decimals(decimals)))
//                 } else {
//                     resolve(parseFloat(bal / CONSTANT.Get_decimals(decimals)).toFixed(2))
//                 }
//             } else {
//                 resolve(0)
//             }
//         }).catch(e => {
//             console.log(e);
//             reject(0)
//         })
//     })
// }

// /**
//  * Function update balance of address on token
//  * @param {string} addessTk address token
//  * @param {string} network network need update balance
//  * @param {number} decimals decimals
//  * @param {string} addressWL address wallet need update
//  */
// export const Update_balance_token = (addessTk, network, decimals, addressWL) => {
//     return new Promise(async (resolve, reject) => {
//         WEB3.setProvider(new WEB3.providers.HttpProvider(getProvider(network)));
//         var CONTRACT = await new WEB3.eth.Contract(ABI, addessTk);
//         await CONTRACT.methods.balanceOf(addressWL).call().then(bal => {
//             if (bal > 0) {
//                 if (parseFloat(bal / CONSTANT.Get_decimals(decimals)) % 1 == 0) {
//                     resolve(parseFloat(bal / CONSTANT.Get_decimals(decimals)).toLocaleString())
//                 } else {
//                     resolve(parseFloat(bal / CONSTANT.Get_decimals(decimals)).toFixed(2).toLocaleString())
//                 }
//             } else {
//                 resolve(0)
//             }
//         })
//     })
// }

/**
 * Return provider of web3
 * @param {string} network network
 */
const getProvider = (network: String) => {
    switch (network) {
        case 'nexty':
            return CONSTANT.ProviderNTY()
        default:
            return CONSTANT.ProviderETH('rinkeby')
    }
}

export const get_address_from_pk_eth = (privatekey: string) => {
    return new Promise((resolve, reject) => {
        try {
            if (privatekey.indexOf('Ox') > -1) {
                resolve(WEB3.eth.accounts.privateKeyToAccount(privatekey).address)
            } else {
                console.log(WEB3.eth.accounts.privateKeyToAccount('0x' + privatekey))
                resolve(WEB3.eth.accounts.privateKeyToAccount('0x' + privatekey).address)
            }
        } catch (error) {
            reject(error)
        }
    })
}

export const Update_balance_ETH = (addessTk, addressWL, network, decimals) => new Promise(async (resolve, reject) => {
    try {
        WEB3.setProvider(new WEB3.providers.HttpProvider(getProvider(network)))
        if (addessTk == '') {
            WEB3.eth.getBalance(addressWL).then(bal => {
                if (bal > 0) {
                    if (parseFloat(bal / CONSTANT.Get_decimals(decimals)) % 1 == 0) {
                        resolve(parseFloat(bal / CONSTANT.Get_decimals(decimals)))
                    } else {
                        resolve(parseFloat(bal / CONSTANT.Get_decimals(decimals)).toFixed(2))
                    }
                } else {
                    resolve(0)
                }
            }).catch(e => reject(e))
        } else {
            var CONTRACT = await new WEB3.eth.Contract(ABI, addessTk);
            console.log('contract', CONTRACT)
            await CONTRACT.methods.balanceOf(addressWL).call().then(bal => {
                if (bal > 0) {
                    if (parseFloat(bal / CONSTANT.Get_decimals(decimals)) % 1 == 0) {
                        resolve(parseFloat(bal / CONSTANT.Get_decimals(decimals)))
                    } else {
                        resolve(parseFloat(bal / CONSTANT.Get_decimals(decimals)).toFixed(2))
                    }
                } else {
                    resolve(0)
                }
            })
        }
    } catch (error) {
        reject(error)
    }
})

export const CheckIsETH = (address) => {
    return (WEB3.utils.isAddress(address))
}

/**
 * Send token on network Ethereum and Nexty
 * @param {Tx} tx rawTx 
 * @param {string} privatekey private key to sign transaction
 * @param {string} network network of token
 * @param {string} addessTk address of token
 * @param {number} decimals decimals of token
 */
export const send_ETH = (tx: Tx, privatekey: string, network: string, addessTk?: string, decimals: number) => new Promise(async (resolve, reject) => {
    try {
        WEB3.setProvider(new WEB3.providers.HttpProvider(getProvider(network)))

        tx.value = await tx.value * CONSTANT.Get_decimals(decimals);
        tx.value = await '0x' + bigInt(tx.value).toString(16);

        console.log('value', tx)
        tx.gasPrice = await WEB3.utils.toWei(tx.gasPrice.toString(), 'Gwei')

        tx.nonce = await WEB3.eth.getTransactionCount(tx.from);
        tx.gas = await WEB3.eth.estimateGas(tx)

        const rawTx = '0x' + await sign(tx, privatekey).rawTx;
        WEB3.eth.sendSignedTransaction(rawTx, (error, hash) => {
            if (error) {
                reject(error)
            } else {
                console.log(hash)
                resolve(hash)
            }
        })
    } catch (error) {
        reject(error)
    }
})

