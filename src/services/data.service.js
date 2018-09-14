import { AsyncStorage } from 'react-native'
import Rx, { Observable, forkJoin, fromEvent } from 'rxjs';
export async function setData(key, value) {
    try {
        return AsyncStorage.setItem(key, value)
            .then(() => { console.log('address ' + value) })
    } catch (error) {
        console.log(error)
    }
}
export async function getData(key) {
    return AsyncStorage.getItem(key).then(data => {
        return data
    }).catch(err => {
        return err
    })
}

export function addAddress(address: string, password: string, privateKey: string) {
    return forkJoin([
        fromEvent(AsyncStorage.setItem(address, password)),
        fromEvent(AsyncStorage.setItem('pk_' + address, privateKey))
    ])
}

export async function getCachePwd(Address) {
    await getData(Address).then(data => {
        return data
    })
}

export async function getPKEn(address) {
    return await getData('pk' + address).then(data => {
        return data
    })
}

export async function setAuth(auth: boolean) {
    if (auth) {
        return await AsyncStorage.setItem('auth', "1")
    } else {
        return await AsyncStorage.removeItem('auth')
    }
}
export async function checkAuth() {
    return await AsyncStorage.getItem('auth').then(value => {
        return (value == "1");
    })
}
