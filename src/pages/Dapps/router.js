import { createStackNavigator } from 'react-navigation';
import BrowserDapps from './browserDapps';
import ListDapps from './listDapps';
import SignMessageScreen from './signMessage';
import SignTransaction from './signTransaction';
import { HexToString } from '../../services/wallet.service'

export default createStackNavigator({
    BrowserDapps: { screen: BrowserDapps },
    ListDapps: { screen: ListDapps },
    SignMessageScreen: { screen: SignMessageScreen },
    SignTransaction: { screen: SignTransaction }
}, {
        initialRouteName: "ListDapps",
        headerMode: "none"
    })