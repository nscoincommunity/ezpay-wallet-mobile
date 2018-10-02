import bigInt from "big-integer";
export default {

    /* static */
    SERVICE_API: '',

    /* Test net*/
    WEB3_API_TEST: '',

    /* Test net 2*/
    WEB3_API_TEST2: '',

    /* Main net */
    WEB3_API: '',


    EXPLORER_API: '',
    WALLET_API: '',
    BASE_PNTY: Math.pow(10, 22),
    BASE_NTY: Math.pow(10, 18),
    PNTY_NTY: 10000,
    BASE_NTY2: bigInt(10).pow(18),

    /* settings */
    TIMER_UPDATE_RATE: 120000, // 1'
    TIMER_UPDATE_GRAPH: 120000, // 2'
    TIMER_UPDATE_BALANCE: 5000, // 5s
    CONFIRM_DELAY: 10, // 10s

    /* const */
    PASSWORD_PATTERN: /^.{6,}$/,
    /*API data COINMARKETCAP */
    COINMARKETCAP: 'https://graphs2.coinmarketcap.com/currencies/nexty/',
    WEEK: 653600000,
    DAY: 86400000,
    MONTH: 2678400000,
    GETUSD: 'https://api.coinmarketcap.com/v2/ticker/2714/',
}