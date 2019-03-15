import { AsyncStorage } from 'react-native'
import Rx, { Observable, forkJoin, fromEvent } from 'rxjs';
export async function setData(key, value) {
    try {
        return AsyncStorage.setItem(key, value)
            .then(() => { })
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

export async function registered(auth: boolean) {
    if (auth) {
        return await AsyncStorage.setItem('registered', "1")
    } else {
        return await AsyncStorage.removeItem('registered')
    }
}
export async function check_Registered() {
    return await AsyncStorage.getItem('registered').then(value => {
        return (value == "1");
    })
}
export async function rmData(key) {
    return await AsyncStorage.removeItem(key)
}
