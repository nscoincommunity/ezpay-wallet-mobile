export default {
    Poppins: 'Poppins-Light',
    ProviderETH: (type) => { return `https://${type}.infura.io/v3/b174a1cc2f7441eb94ed9ea18c384730` },
    ProviderNTY: () => { return `http://13.228.68.50:8545` },
    Get_decimals: (decimals) => { return Math.pow(10, decimals) },

}