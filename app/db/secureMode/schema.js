const ACCOUNT: object = {
    name: 'ACCOUNT_SECURE',
    primaryKey: 'id',
    properties: {
        id: 'int',
        name: 'string',
        token_type: 'string',
        addrress: 'string',
        private_key: 'string',
        balance: 'double?',
        time: 'date'
    }
}
const TOKEN: Object = {
    name: 'TOKEN_SECURE',
    primaryKey: 'id',
    properties: {
        id: 'int',
        name: 'string',
        network: 'string',
        address: 'string?',
        price: 'double?',
        percent_change: 'double?',
        account: { type: 'ACCOUNT_SECURE?[]' },
        icon: 'data'
    }
}

const WALLET: Object = {
    name: 'WALLET_SECURE',
    primaryKey: 'id',
    properties: {
        id: 'int',
        mode: 'string',
        seeds: 'string',
        token: { type: 'TOKEN_SECURE?[]' }
    }
}

export const SECURE = {
    ACCOUNT,
    WALLET,
    TOKEN
}