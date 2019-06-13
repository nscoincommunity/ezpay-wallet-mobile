import REALM from "realm";
import { EASY } from "./ezMode/schema";
import { SECURE } from "./secureMode/schema";

const DB_EASY = {
  path: "EASY.realm",
  schema: [EASY.ACCOUNT, EASY.TOKEN, EASY.WALLET, EASY.FAVORITE],
  schemaVersion: 0
};

export const Remove_DB = () => new Promise((resolve, reject) => {
  try {
    REALM.deleteFile(DB_EASY);
    resolve("delete success");
  } catch (error) {
    reject(error);
  }
});

/**
 * Create first wallet
 * @param {object} wallet object wallet
 */
export const InitData = wallet => new Promise((resolve, reject) => {
  try {
    REALM.open(DB_EASY)
      .then(realm => {
        realm.write(() => {
          realm.create(EASY.WALLET_NAME, wallet);
          resolve(wallet);
        });
      })
      .catch(e => {
        console.log("eee", e);
        reject(e);
      });
  } catch (error) {
    console.log("eee", error);
    reject(error);
  }
});

/**
 * Import token to wallet
 * @param {object} Token object token
 */
export const Add_Token = Token => new Promise((resolve, reject) => {
  try {
    REALM.open(DB_EASY)
      .then(realm => {
        Check_Exist_Token(Token.address)
          .then(check => {
            if (check) {
              reject("Token has exist");
            } else {
              // realm.create(EASY.TOKEN_NAME, Token)
              let Wallet = realm
                .objects(EASY.WALLET_NAME)
                .filtered('mode="Easy"');
              realm.write(() => {
                Wallet[0].token.push(Token);
              });
              resolve(Token);
            }
          })
          .catch(er => reject(er));
      })
      .catch(e => reject(e));
  } catch (error) {
    reject(error);
  }
});

/**
 * Check exist token
 * @param {string} token_address address token
 */
export const Check_Exist_Token = token_address => new Promise((resolve, reject) => {
  try {
    REALM.open(DB_EASY)
      .then(realm => {
        let Token = realm.objects(EASY.TOKEN_NAME);
        console.log(
          "token",
          Token.findIndex(x => x.address == token_address)
        );
        if (
          Token.findIndex(x => x.address == token_address) > -1 &&
          token_address != ""
        ) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch(e => reject(e));
  } catch (error) {
    reject(error);
  }
});

export const Check_Exist_Wallet = () => new Promise((resolve, reject) => {
  try {
    REALM.open(DB_EASY)
      .then(realm => {
        let Wallet = realm.objects(EASY.WALLET_NAME);
        if (Wallet.length > 0) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch(e => reject(e));
  } catch (error) {
    reject(error);
  }
});

export const InsertNewAccout = Account => new Promise((resolve, reject) => {
  try {
    REALM.open(DB_EASY)
      .then(realm => {
        realm.write(() => {
          try {
            realm.create(EASY.ACCOUNT_NAME, Account);
            console.log(Account);
            resolve(Account);
          } catch (error) {
            console.log(error);
            reject(error);
          }
        });
      })
      .catch(err => {
        console.log(err);
        reject(err);
      });
  } catch (error) {
    console.log(error);
    reject(error);
  }
});
export const GetAllAccount = () => { };

/**
 * Get all token of wallet
 */
export const Get_All_Token_Of_Wallet = () => new Promise((resolve, reject) => {
  try {
    REALM.open(DB_EASY)
      .then(realm => {
        let LisTokenOfWallet = realm
          .objects(EASY.WALLET_NAME)
          .filtered('mode="Easy"');
        resolve(Array.from(LisTokenOfWallet)[0]["token"]);
      })
      .catch(e => reject(e));
  } catch (error) {
    reject(error);
  }
});

export const Get_Account_Of_Token = id_token => new Promise((resolve, reject) => { });

/**
 * Remove token
 * @param {string} nameTK name of token
 * @param {string} symbolTk symbol of token
 */
export const Remove_Token = (nameTK, symbolTk) => new Promise((resolve, reject) => {
  try {
    REALM.open(DB_EASY)
      .then(realm => {
        realm.write(() => {
          let token = realm
            .objects(EASY.TOKEN_NAME)
            .filtered('name="' + nameTK + '" && symbol="' + symbolTk + '"');
          console.log("token", Array.from(token));
          realm.delete(token);
          resolve("remove token");
        });
      })
      .catch(e => reject(e));
  } catch (error) {
    reject(error);
  }
});

export const Update_infor_token = (id, price, percent_change) => new Promise((resolve, reject) => {
  try {
    REALM.open(DB_EASY)
      .then(realm => {
        realm.write(() => {
          let token_need_update = realm.objectForPrimaryKey(
            EASY.TOKEN_NAME,
            id
          );
          token_need_update.price = price;
          token_need_update.percent_change = percent_change;
          resolve();
        });
      })
      .catch(e => reject(e));
  } catch (error) {
    reject(error);
  }
});

/**
 * Check exist address account of token
 * @param {number} id_token id of token need check exist address
 * @param {string} address address of account need check exist
 */
export const Check_exist_address = (id_token, address) => new Promise((resolve, reject) => {
  try {
    REALM.open(DB_EASY)
      .then(realm => {
        var token = realm.objects(EASY.TOKEN_NAME).filtered('id="' + id_token + '"');
        var account = token[0].account;
        account.forEach(element => {
          if (element.address == address) {
            resolve(true)
          }
        });
        resolve(false)
      })
      .catch(e => reject(e));
  } catch (error) {
    reject(error);
  }
});

export const get_Token = id =>
  new Promise((resolve, reject) => {
    try {
      REALM.open(DB_EASY).then(realm => {
        var token = realm.objects(EASY.TOKEN_NAME).filtered('id="' + id + '"');
        resolve(Array.from(token)[0]);
      });
    } catch (error) {
      reject(error);
    }
  });
/**
 * Insert wallet to schema ACCOUNT_EZ
 * @param {number} id_token id of token want insert wallet
 * @param {object} account object wallet want insert:
 */
export const insert_account_token = (id_token, account) => new Promise((resolve, reject) => {
  try {
    REALM.open(DB_EASY)
      .then(realm => {
        Check_exist_address(id_token, account.address).then(status => {
          if (status) {
            reject('Address has exist')
          } else {
            let Token = realm.objects(EASY.TOKEN_NAME).filtered('id="' + id_token + '"');
            realm.write(() => {
              Token[0]['account'].push(account);
              resolve(account);
            });
          }
        }).catch(e => reject(e))
      }).catch(e => reject(e));
  } catch (error) {
    reject(error);
  }
});

/**
 * Remove account
 * @param {number} id_account id of account want remove
 */
export const Remove_account_token = (id_account) => new Promise((resolve, reject) => {
  try {
    REALM.open(DB_EASY).then(realm => {
      realm.write(() => {
        let account = realm.objects(EASY.ACCOUNT_NAME).filtered('id="' + id_account + '"');
        realm.delete(account);
        resolve(true);
      })
    }).catch(e => reject(e))
  } catch (error) {
    reject(error)
  }
})


export const length_account_tokem = (id_token) => {
  return REALM.open(DB_EASY).then(realm => {
    var token = realm.objects(EASY.TOKEN_NAME).filtered('id="' + id_token + '"');
    var account = token[0].account;
    return account.length + 1
  })
}



export const update_Balance_db = (id, balance) => new Promise((resolve, reject) => {
  try {
    REALM.open(DB_EASY).then(realm => {
      let account = realm.objectForPrimaryKey(EASY.ACCOUNT_NAME, id);
      realm.write(() => {
        account.balance = balance;
        resolve()
      })
    })
  } catch (error) {
    reject(error)
  }
})

export const update_total_balance = (id, total_balance) => new Promise((resolve, reject) => {
  try {
    REALM.open(DB_EASY).then(realm => {
      let account = realm.objectForPrimaryKey(EASY.TOKEN_NAME, id);
      realm.write(() => {
        account.total_balance = parseFloat(total_balance);
        resolve()
      })
    })
  } catch (error) {
    reject(error)
  }
})

export const get_balance_wallet = (id) => new Promise((resolve, reject) => {
  try {
    REALM.open(DB_EASY).then(realm => {
      let account = realm.objects(EASY.ACCOUNT_NAME).filtered('id="' + id + '"');
      resolve(account[0].balance)
    })
  } catch (error) {

  }
})



export default new REALM(DB_EASY);
