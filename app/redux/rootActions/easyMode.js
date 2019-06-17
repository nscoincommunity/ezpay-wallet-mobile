import { Add_Token, Get_All_Token_Of_Wallet, Remove_Token, Update_infor_token } from '../../db'
import { Create_account } from '../../services/index.account'


export const RefreshListToken = (listToken) => {
    return {
        type: 'REFRESH_TOKEN',
        payload: listToken
    }
}
/**
 * Action get all token of wallet
 */
export const GetListToken = () => dispatch => {
    return Get_All_Token_Of_Wallet().then(listToken => {
        return dispatch(RefreshListToken(listToken))
    }).catch(console.log)
}

/**
 * Action insert token to db
 * @param {object} token oject token want insert to db
 */
export const Func_Add_Account = (token) => dispatch => {
    console.log('token', token)
    return Create_account(token.network).then(async wallet => {
        console.log('wallet', wallet)
        var ID = Math.floor(Date.now() / 1000);
        let ObjToken = {
            id: ID,
            name: token.name,
            symbol: token.symbol,
            network: token.network,
            address: token.address,
            price: 0,
            percent_change: 0,
            icon: '',
            decimals: token.decimals,
            total_balance: 0,
            id_market: token.id_market,
            account: [{
                id: ID,
                name: 'Account 1',
                token_type: token.network,
                address: token.network == 'tron' ? wallet.address.base58 : wallet.address,
                private_key: wallet.privateKey,
                balance: 0,
                time: new Date()
            }]
        }
        return Add_Token(ObjToken).then(ss => {
            return Get_All_Token_Of_Wallet().then(listToken => {
                return dispatch(RefreshListToken(listToken))
            }).catch(console.log)
        }).catch(console.log)
    }).catch(console.log)
}

/**
 * Action remove token
 * @param {string} name name of token
 * @param {string} symbol symbol of token
 */
export const Func_Remove_Token = (name, symbol) => dispatch => {
    console.log(name, symbol)
    return Remove_Token(name, symbol).then(ss => {
        return Get_All_Token_Of_Wallet().then(listToken => {
            return dispatch(RefreshListToken(listToken))
        }).catch(console.log)
    })
}

export const Func_Update_price = (id, price, percent_change) => dispatch => {
    return Update_infor_token(id, price, percent_change).then(() => {
        return Get_All_Token_Of_Wallet().then(listToken => {
            return dispatch(RefreshListToken(listToken))
        }).catch(console.log)
    })
}

export const Func_Settings = (settings) => dispatch => {
    return dispatch({
        type: 'SETTING',
        payload: settings
    })
}