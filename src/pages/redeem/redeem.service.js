import { getAddressFromPK, getBalance, Redeem } from '../../services/wallet.service';
import CONSTANTS from '../../helper/constants';

export function HandleCoupon(privateKey: string) {
    return new Promise((resolve, reject) => {
        getAddressFromPK(privateKey).then(async (address) => {
            getBalance(address).then(balance => {
                balance = parseFloat(balance / CONSTANTS.BASE_NTY)
                if (balance > 0) {
                    Redeem(address, balance, privateKey).then(data => {
                        resolve(balance)
                    }).catch(error => {
                        reject('ER03')
                    })
                } else {
                    reject('ER02')
                }
            })
        }).catch(err => {
            reject('ER01')
        })
    })

}