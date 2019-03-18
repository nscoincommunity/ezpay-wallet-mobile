import {
    InsertNewWallet,
    UpdateWallet,
    DeleteWallet,
    SelectAllWallet,
    UpdateBalanceWallet,
    GetTokenOfNetwork,
    DB_UpdateBalanceTk
} from '../../realm/walletSchema'
import { getExchangeRate, getExchangeRateETH, getExchangeRateTRX } from '../../src/services/rate.service';
import { updateBalance, SV_UpdateBalanceTk } from '../../src/services/wallet.service'
/**
 * action snap wallet on dashboard.
 * @param {string} network network wallet when snap
 * @param {number} walletID walletID of wallet when snap
 */
export function ONSNAPWALLET(network, walletID, exchange, rate) {
    return {
        type: 'ON_SNAP_WALLET',
        payload: {
            network: network,
            walletID: walletID,
            rate: rate,
            exchange: exchange
        }
    }
}

export const fetchRate = (network, walletID) => dispatch => {
    switch (network) {
        case 'nexty':
            return getExchangeRate().then(rate => {
                return dispatch(ONSNAPWALLET(network, walletID, `1 NTY = ${rate.toFixed(6)} USD`, rate.toFixed(6)))
            }).catch(e => console.log(e))
        case 'ethereum':
            return getExchangeRateETH().then(rate => {
                return dispatch(ONSNAPWALLET(network, walletID, `1 ETH = ${rate.toFixed(6)} USD`, rate.toFixed(6)))
            })
        case 'tron':
            return getExchangeRateTRX().then(rate => {
                return dispatch(ONSNAPWALLET(network, walletID, `1 TRX = ${rate.toFixed(6)} USD`, rate.toFixed(6)))
            })
        default:
            return dispatch(ONSNAPWALLET('', '', ''))
    }

}
/**
 * action get list wallet form DB
 */
export const setListWallet = payload => {
    return {
        type: 'GET_ALL_WALLET',
        payload
    }

}

export const fetchAllWallet = () => dispatch => {
    return SelectAllWallet().then(wallet => {
        return dispatch(setListWallet(wallet));
    }).catch(e => console.log(e))
}

/**
 * start snap
 */

const StartSnap = (type) => {
    return {
        type: 'START_SNAP',
    }
}
/**
* end snap
*/

const ENDSnap = () => {
    return {
        type: 'END_SNAP',
    }
}

export const EventSnap = (type) => dispatch => {
    try {
        if (type) {
            return dispatch(StartSnap())
        } else {
            return dispatch(ENDSnap())
        }
    } catch (error) {
        console.log(error)
    }

}
/**
 * get balance of wallet
 * 
 */

export const getBalance = (bal) => {
    return {
        type: 'GET_BALANCE',
        payload: {
            balance: bal
        }
    }
}

export const EventGetBalance = (address, network, id) => dispatch => {
    return updateBalance(address, network).then(bal => {
        return UpdateBalanceWallet(id, bal).then(() => {
            return dispatch(getBalance(bal))
        }).catch(er => console.log(er))
    }).catch(e => console.log(e))
}

/**
 * get list token of network
 * @param {string} network network need get token
 */

const getListToken = (ListToken, network, addressWL, nameWL) => {
    return {
        type: 'GET_TOKEN',
        payload: {
            ListToken,
            network,
            addressWL,
            nameWL
        }
    }
}
export const GetListToken = (network, addressWL, nameWL) => dispatch => {
    if (network == '') {
        return dispatch(getListToken([]))
    } else {
        return GetTokenOfNetwork(network).then(List => {
            return dispatch(getListToken(List, network, addressWL, nameWL))
        }).catch(e => console.log(e))
    }

}


const ActionUpdateBalanceTK = (bal) => {
    return {
        type: 'GET_BALANCE_TOKEN',
        payload: {
            balance: bal
        }
    }
}
/**
 * get Balance of token
 * @param {number} id id of token on SchemaToken
 * @param {string} addressTK address of token
 * @param {string} addressWL address of wallet
 * @param {string} network network
 */
export const getBalanceToken = (id, addressTK, addressWL, network) => dispatch => {
    return SV_UpdateBalanceTk(addressTK, network, addressWL).then(bal => {
        return DB_UpdateBalanceTk(id, parseFloat(bal)).then(ss => {
            return dispatch(ActionUpdateBalanceTK(bal))
        })
    })
}