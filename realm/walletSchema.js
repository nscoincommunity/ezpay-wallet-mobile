import REALM from 'realm';
const LISTWALLET = 'WalletSchema';
const NETWORK = "networkSchema";
const TOKEN = "tokenSchema";
// table ListWallet
const ListWallet: object = {
    name: LISTWALLET,
    primaryKey: 'id',
    properties: {
        id: 'int',
        name: 'string',
        address: 'string',
        pk_en: 'string',
        create: 'date',
        V3JSON: 'string',
        network: NETWORK,
        typeBackup: 'bool',
        balance: 'int',
    }
}

const NetWork: object = {
    name: NETWORK,
    primaryKey: 'id',
    properties: {
        id: 'int',
        name: 'string',
    }
}

const Token: object = {
    name: TOKEN,
    primaryKey: 'id',
    properties: {
        id: 'int',
        walletId: 'int',
        name: 'string',
        addressToken: 'string',
        balance: 'int',
        network: 'string',
        avatar: 'string',
        exchagerate: 'string',
        change: 'string'
    }
}


const databaseOption = {
    path: 'Nexty.realm',
    schema: [ListWallet, NetWork, Token],
    schemaVersion: 1 // version of database
}

export const deleteDB = () => new Promise((resolve, reject) => {
    try {
        REALM.deleteFile(databaseOption)
        resolve('delete success')
    } catch (error) {
        reject(error)
    }
})



/**                                                                                      **\
 * *************************|-------------------------------------|*********************** *
 * *************************| Start Action in Schema walletSchema |*********************** *
 * *************************|-------------------------------------|*********************** *
\**                                                                                      **/



/**
 * Insert new wallet to schema WalletSchema
 * @param {Object} Wallet param id, name, address, pk_en, create, V3JSON,network,typeBackup,balance
 */
export const InsertNewWallet = (Wallet) => new Promise((resolve, reject) => {
    try {
        REALM.open(databaseOption)
            .then(realm => {
                console.log('aaaa', realm)
                realm.write(() => {
                    try {
                        realm.create(LISTWALLET, Wallet);
                        console.log(Wallet);
                        resolve(Wallet);
                    } catch (error) {
                        console.log(error)
                        reject(error)
                    }
                });
            }).catch(err => {
                console.log(err);
                reject(err);
            })
    } catch (error) {
        console.log('aaa', error)
    }
});

/**
 * Get all wallet
 */
export const SelectAllWallet = () => new Promise((resolve, reject) => {
    try {
        REALM.open(databaseOption).then(realm => {
            let allWallet = realm.objects(LISTWALLET);
            resolve(Array.from(allWallet));
        }).catch(err => reject(err))
    } catch (error) {
        reject(error)
    }
})

/**
 * Check exist wallet in WalletSchema
 * @param {string} name name wallet
 */
export const CheckExistNameWallet = (name) => new Promise((resolve, reject) => {
    try {
        REALM.open(databaseOption).then(realm => {
            var ListNameWallet = realm.objects(LISTWALLET).filtered('name="' + name + '"')
            if (ListNameWallet.length > 0) {
                resolve(true)
            } else {
                resolve(false)
            }
        }).catch(e => reject(e))
    } catch (error) {
        reject(error)
    }
})
/**
 * Check exist address
 * @param {string} address address wallet want check
 */
export const CheckExistAddressWallet = address => new Promise((resolve, reject) => {
    try {
        REALM.open(databaseOption).then(realm => {
            let ListAddressWallet = realm.objects(LISTWALLET).filtered('address="' + address + '"')
            if (ListAddressWallet.length > 0) {
                resolve(true)
            } else {
                resolve(false)
            }
        }).catch(e => reject(e))
    } catch (error) {
        reject(error)
    }
})
/**
 * Delete wallet
 * @param {number} walletID Id of wallet want delete
 */
export const DeleteWallet = (walletID) => new Promise((resolve, reject) => {
    try {
        REALM.open(databaseOption).then(realm => {
            realm.write(() => {
                let Wallet = realm.objectForPrimaryKey(LISTWALLET, walletID);
                realm.delete(Wallet);
                resolve()
            })
        }).catch(e => reject(e))
    } catch (error) {
        reject(error)
    }
})
/**
 * Delete all wallet in WalletSchema
 */
export const DeleteAllWallet = () => new Promise((resolve, reject) => {
    try {
        REALM.open(databaseOption).then(realm => {
            realm.write(() => {
                let allWallet = realm.objects(LISTWALLET);
                realm.delete(allWallet);
                resolve('delete all wallet success')
            })
        }).catch(e => reject(e))
    } catch (error) {
        reject(error)
    }
})
/**
 * Get List wallet have address
 * @param {string} address address want check
 */
export const CountNetworkofWallet = (address) => new Promise((resolve, reject) => {
    try {
        REALM.open(databaseOption).then(realm => {
            try {
                var networkOfWallet = realm.objects(LISTWALLET).filtered('address="' + address + '"');
                resolve(Array.from(networkOfWallet))
            } catch (e) {
                reject(e)
            }

        })
    } catch (error) {
        reject(error)
    }
})
/**
 * Update infor wallet
 * @param {object} wallet infor wallet want update vd: change name..
 */
export const UpdateTypeBackupWallet = (wallet) => new Promise((resolve, reject) => {
    try {
        REALM.open(databaseOption).then(realm => {
            let ListWallet = realm.objects(LISTWALLET).filtered('address="' + wallet.address + '"');
            Array.from(ListWallet).forEach((item, index) => {
                setTimeout(() => {
                    console.log('id', item.id)
                    realm.write(() => {
                        let walletUpdate = realm.objectForPrimaryKey(LISTWALLET, item.id);
                        walletUpdate.typeBackup = true;
                        if (index == ListWallet.length - 1) {
                            resolve(Array.from(realm.objects(LISTWALLET).filtered('address="' + wallet.address + '"')));
                        }
                    })
                }, 500)

            })
        }).catch(e => reject(e))
    } catch (error) {
        reject(error)
    }
})

/**
 * Update balance of wallet with id
 * @param {number} id id wallet want update balance
 * @param {number} balance balance new
 */
export const UpdateBalanceWallet = (id, balance) => new Promise((resolve, reject) => {
    try {
        REALM.open(databaseOption).then(realm => {
            realm.write(() => {
                let updateBalance = realm.objectForPrimaryKey(LISTWALLET, id);
                updateBalance.balance = parseFloat(balance);
                resolve()
            })
        }).catch(e => reject(e))
    } catch (error) {
        reject(error)
    }
})

/**                                                                                      **\
 * *************************|------------------------------------|************************ *
 * *************************| Start Action in Schema tokenSchema |************************ *
 * *************************|------------------------------------|************************ *
\**                                                                                      **/




export const GetAllToken = () => new Promise((resolve, reject) => {
    try {
        REALM.open(databaseOption).then(realm => {
            let ListToken = realm.objects(TOKEN);
            resolve(Array.from(ListToken))
        }).catch(e => reject(e))
    } catch (error) {
        reject(error)
    }
})

/**
 * Insert new token
 * @param {object} Token is Object: param id, walletId, name, addressToken, balance, network,avatar,exchagerate,change
 */
export const InsertNewToken = (Token) => new Promise((resolve, reject) => {
    try {
        REALM.open(databaseOption)
            .then(realm => {
                console.log('aaaa', realm)
                realm.write(() => {
                    try {
                        realm.create(TOKEN, Token);
                        console.log(Token);
                        resolve(Token);
                    } catch (error) {
                        console.log(error)
                        reject(error)
                    }
                });
            }).catch(err => {
                console.log(err);
                reject(err);
            })
    } catch (error) {
        console.log('aaa', error)
    }
});
/**
 * Check token has exist on list token
 * @param {string} name symbol token
 * @param {string} address address token
 */
export const CheckExistToken = (name, address) => new Promise((resolve, reject) => {
    try {
        REALM.open(databaseOption).then(realm => {
            var ListNameToken = realm.objects(TOKEN).filtered('name="' + name + '" OR  addressToken="' + address + '"')
            console.log('List check', Array.from(ListNameToken))
            if (ListNameToken.length > 0) {
                resolve(true)
            } else {
                resolve(false)
            }
        }).catch(e => reject(e))
    } catch (error) {
        reject(error)
    }
})

/**
 * Get list token of network
 * @param {string} network type network: nexty, ethereum, tron....
 */
export const GetTokenOfNetwork = (network) => new Promise((resolve, reject) => {
    try {
        REALM.open(databaseOption).then(realm => {
            let ListToken = realm.objects(TOKEN).filtered('network="' + network + '"')
            resolve(Array.from(ListToken))
        }).catch(e => reject(e))
    } catch (error) {
        reject(error)
    }
})


/**
 * Delete token
 * @param {number} id id of token want delete
 */
export const DeleteToken = (id) => new Promise((resolve, reject) => {
    try {
        REALM.open(databaseOption).then(realm => {
            realm.write(() => {
                var token = realm.objectForPrimaryKey(TOKEN, id);
                realm.delete(token)
                resolve('delete success')
            })
        }).catch(e => reject(e))
    } catch (error) {
        reject(error)
    }
})

/**
 * Update balance token
 * @param {number} id_token id of token
 * @param {number} balance balance token affter update
 */
export const DB_UpdateBalanceTk = (id_token, balance) => new Promise((resolve, reject) => {
    try {
        REALM.open(databaseOption).then(realm => {
            realm.write(() => {
                var token = realm.objectForPrimaryKey(TOKEN, id_token);
                token.balance = balance;
                resolve('update ss')
            })
        }).catch(e => reject(e))
    } catch (error) {
        reject(error)
    }
})

export default new REALM(databaseOption)