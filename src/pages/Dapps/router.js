import { createStackNavigator } from 'react-navigation';
import BrowserDapps from './browserDapps';
import ListDapps from './listDapps';
import SignMessageScreen from './signMessage';

export default createStackNavigator({
    BrowserDapps: { screen: BrowserDapps },
    ListDapps: { screen: ListDapps },
    SignMessageScreen: { screen: SignMessageScreen }
}, {
        initialRouteName: "ListDapps",
        headerMode: "none"
    })