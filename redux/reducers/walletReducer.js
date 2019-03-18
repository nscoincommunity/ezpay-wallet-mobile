
import { exchangeRate } from '../../src/services/rate.service';


export function Register(state = { registered: false }, actions) {
    switch (actions.type) {
        case "USER_REGISTER_IN":
            return { registered: true }
        default:
            return state
    }
}
let firstState = {
    network: 'nexty',
    walletID: 0,
    exchangeRate: exchangeRate.toFixed(6)
}
export function snapToWallet(state = firstState, actions) {
    switch (actions.type) {
        case "ON_SNAP_WALLET":
            return actions.payload;
        default:
            return state
    }
}

export function eventSnap(state = { status: false }, actions) {
    switch (actions.type) {
        case 'START_SNAP':
            return { status: true }
        case 'END_SNAP':
            return { status: false }
        default:
            return state
    }
}

export function updateBalance(state = { balance: NaN }, actions) {
    switch (actions.type) {
        case 'GET_BALANCE':
            return { balance: actions.payload.balance }
        default:
            return state
    }
}
export function getListToken(state = { ListToken: [] }, actions) {
    switch (actions.type) {
        case 'GET_TOKEN':
            return {
                ListToken: actions.payload.ListToken,
                network: actions.payload.network,
                addressWL: actions.payload.addressWL,
                nameWL: actions.payload.nameWL
            }
        default:
            return state
    }
}
export function BalanceToken(state = { balance: NaN }, actions) {
    switch (actions.type) {
        case 'GET_BALANCE_TOKEN':
            return { balance: actions.payload.balance }
        default:
            return state
    }
}
