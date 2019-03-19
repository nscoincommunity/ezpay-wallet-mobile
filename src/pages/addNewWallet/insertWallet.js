import { validatePassword, Register, cachePwd, restore } from '../../services/auth.service';
import { InsertNewWallet, SelectAllWallet } from '../../../realm/walletSchema'


export function CreateNewWallet(passcode, name, network) {

    return new Promise(async (resolve, reject) => {
        console.log(await validatePassword(passcode))
        if (await validatePassword(passcode)) {
            Register(passcode, network, name)
            resolve('register success')
        } else {
            alert('error passcode');
            reject('error passcode');
        }
    })
}

export function AddNetwork(passcode, name, privateKey, network, address, typeBackup) {
    return new Promise(async (resolve, reject) => {
        if (await validatePassword(passcode)) {
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
                typeBackup: typeBackup,
                balance: 0,
                token: []
            }
            InsertNewWallet(wallet);
            resolve('Add network success')
        } else {
            alert('error passcode');
            reject('error passcode');
        }
    })
}

export function importWallet(address, privateKey, passcode, name, network) {
    return new Promise(async (resolve, reject) => {
        if (await validatePassword(passcode)) {
            restore(address, privateKey, passcode, name, network)
            resolve('restore success')
        } else {
            alert('error passcode');
            reject('error passcode');
        }
    })
}

