import {
    CreateETH,
    get_address_from_pk_eth,
    Update_balance_ETH,
    CheckIsETH,
    send_ETH
} from './ETH/account.service';
import {
    CreateTRX,
    get_address_form_pk_trx,
    Update_balance_TRX,
    CheckIsTRON,
    send_TRON
} from './TRX/account.service';


export interface Tx {
    nonce?: string | number,
    chainId?: string | number,
    from?: string,
    to?: string,
    data?: string,
    value?: string | number,
    gas?: string | number,
    gasPrice?: string | number

}

export const Create_account = (network) => {
    return new Promise((resolve, reject) => {
        if (network == 'tron') {
            CreateTRX().then(acc => {
                resolve(acc)
            }).catch(e => reject(e))
        } else {
            CreateETH(network).then(acc => {
                resolve(acc)
            }).catch(e => reject(e))
        }
    })
}

export const Import_account = (privateKey, network) => {
    return new Promise((resolve, reject) => {
        if (network == 'tron') {
            get_address_form_pk_trx(privateKey).then(address => {
                resolve(address)
            }).catch(e => reject(e))
        } else {
            get_address_from_pk_eth(privateKey)
                .then(address => {
                    resolve(address)
                })
                .catch(e => reject(e))
        }
    })
}
/**
 * 
 * @param {string} addressTK 
 * @param {string} addressWL 
 * @param {string} network 
 * @param {number} decimals 
 */
export const Update_balance = (addressTK, addressWL, network, decimals) => new Promise((resolve, reject) => {
    if (network == 'tron') {
        Update_balance_TRX(addressTK, addressWL, decimals).then(bal => {
            resolve(bal)
        }).catch(e => reject(e))
    } else {
        Update_balance_ETH(addressTK, addressWL, network, decimals).then(bal => {
            resolve(bal)
        }).catch(e => reject(e))
    }
})

export const CheckIsAddress = async (address, network) => {
    if (network == 'tron') {
        return CheckIsTRON(address)
    } else {
        return CheckIsETH(address)
    }
}

export const Send_Token = (from, to, value, addressTK, privateKey, network, decimals, gasPrice?) => new Promise((resolve, reject) => {

    let rawTx: Tx = {
        from: from,
        to: to,
        value: value,
        gasPrice: gasPrice
    }
    if (network == 'tron') {
        send_TRON(rawTx, privateKey, addressTK, decimals)
    } else {
        send_ETH(rawTx, privateKey, network, addressTK, decimals).then(hash => {
            resolve(hash)
        }).catch(e => reject(e))
    }
})

export const Check_fee_with_balance = (fee, address, addressTK, network, decimals) => new Promise((resolve, reject) => {
    Update_balance_ETH(addressTK, address, network, decimals).then(bal => {
        if (bal > fee) {
            resolve(true)
        } else {
            resolve(false)
        }
    }).catch(e => reject(e))

})
