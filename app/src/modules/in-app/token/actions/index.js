import { insert_account_token, length_account_tokem, Remove_account_token } from "../../../../../db";
import { Create_account, Update_balance } from '../../../../../services/index.account';
import { Func_import_account } from '../../add-wallet/import/import.service';

export const Create_account_of_token = (id_token, network) => new Promise((resolve, reject) => {
    Create_account(network).then(async account => {
        var ID = Math.floor(Date.now() / 1000);
        let ObjAccount = {
            id: ID,
            name: `Account ${await length_account_tokem(id_token)}`,
            token_type: network,
            address: network == 'tron' ? account.address.base58 : account.address,
            private_key: account.privateKey,
            balance: 0,
            time: new Date()
        }
        insert_account_token(id_token, ObjAccount).then(ss => {
            resolve(true)
        }).catch(e => reject(e))
    }).catch(err => reject(err))
})

export const Import_account_of_token = (id_token, Account) => new Promise(async (resolve, reject) => {
    Account.name = `Account ${await length_account_tokem(id_token)}`;
    insert_account_token(id_token, Account).then(ss => {
        resolve(true)
    }).catch(e => reject(e))
})



export const Remove_account_of_token = (id_account) => new Promise((resolve, reject) => {
    Remove_account_token(id_account).then(ss => {
        if (ss) {
            resolve(true)
        }
    }).catch(e => {
        console.log(e);
        reject(false)
    })
})

export const Update_balance_token = (addressTK, network, addressWL, decimals) => dispatch => {
    return Update_balance(addressTK, addressWL, network, decimals).then(balance => {
        console.log(balance);
        return dispatch({ type: 'BalanceTK', payload: balance })
    })
}
