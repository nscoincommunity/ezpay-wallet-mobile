import React from 'react'
import { createStackNavigator, createBottomTabNavigator, TabBarBottom, createMaterialTopTabNavigator } from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import Color from '../helpers/constant/color';
import ImageApp from '../helpers/constant/image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Keyboard } from 'react-native';
//Stack other module
import QRscan from '../src/components/QR-scan'
import FormPassword from '../src/components/form-input-password'
// Stack Home
import Dashboard from '../src/modules/in-app/dashboard';
import Token from '../src/modules/in-app/token';
import InforAccount from '../src/modules/in-app/token/info-account';
import ListToken from '../src/modules/in-app/add-token';
import InforToken from '../src/modules/in-app/add-token/infor-token';
import Addnew from '../src/modules/in-app/add-wallet/new';
import TypeImport from '../src/modules/in-app/add-wallet/import/selectImport';
import ImportAccount from '../src/modules/in-app/add-wallet/import';
import ReceiveAccount from '../src/modules/in-app/receive';
import SendScreen from '../src/modules/in-app/send';
import ToAddress from '../src/modules/in-app/send/toAddress';
import History from '../src/modules/in-app/history';
import Detail_history from '../src/modules/in-app/history/detail-history';
import Browser from '../src/modules/browser'
// Stack Dapp
import ListDapp from '../src/modules/Dapps/screen';
import DappBrowser from '../src/modules/Dapps/browser'
import SignMessage from '../src/modules/Dapps/screen/signMessage';
import signTransaction from '../src/modules/Dapps/screen/signTransaction';
// Stack Setting
import Menu from '../src/modules/menu';
import Favorite from '../src/modules/menu/favorite';
import AddFavorite from '../src/modules/menu/favorite/add-favorite'
import Passcode_settings from '../src/modules/menu/passcode'

const stackHome = createStackNavigator(
    {
        Dashboard: { screen: Dashboard },
        Token: { screen: Token },
        InforAccount: { screen: InforAccount },
        ListToken: { screen: ListToken },
        InforToken: { screen: InforToken },
        Addnew: { screen: Addnew },
        TypeImport: { screen: TypeImport },
        ImportAccount: { screen: ImportAccount },
        QRscan: { screen: QRscan },
        ReceiveAccount: { screen: ReceiveAccount },
        SendScreen: { screen: SendScreen },
        ToAddress: { screen: ToAddress },
        History: { screen: History },
        Detail_history: { screen: Detail_history },
        Browser: { screen: Browser },
        FormPassword: { screen: FormPassword }
    },
    {
        initialRouteName: 'Dashboard',
        headerMode: 'none'
    }
)

const stackDapp = createStackNavigator(
    {
        ListDapp: { screen: ListDapp },
        DappBrowser: { screen: DappBrowser },
        SignMessage: { screen: SignMessage },
        SignTransaction: { screen: signTransaction },
        FormPassword: { screen: FormPassword }
    }, {
        initialRouteName: 'ListDapp',
        headerMode: 'none'
    }
)

const stackSetting = createStackNavigator(
    {
        Menu: { screen: Menu },
        Favorite: { screen: Favorite },
        AddFavorite: { screen: AddFavorite },
        QRscan: { screen: QRscan },
        Passcode_settings: { screen: Passcode_settings },
        FormPassword: { screen: FormPassword }
    }, {
        initialRouteName: 'Menu',
        headerMode: 'none'
    }
)

stackHome.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true;
    if (navigation.state.index > 0) {
        tabBarVisible = false;
    }
    return {
        tabBarVisible,
    };
};

export default createMaterialBottomTabNavigator(
    {
        Dapp: {
            screen: stackDapp,
            navigationOptions: {
                tabBarLabel: 'DApps',
                tabBarIcon: ({ tintColor }) => {
                    return (
                        < Icon name="earth" color={tintColor} size={24} />
                    )
                },
                tabBarOnPress: (evt) => {
                    Keyboard.dismiss();
                },
            }
        },
        Home: {
            screen: stackHome,
            navigationOptions: {
                tabBarLabel: 'Wallet',
                tabBarIcon: ({ tintColor }) => {
                    return (
                        <Icon name="wallet" color={tintColor} size={24} />
                    )
                },
                tabBarOnPress: (evt) => {
                    Keyboard.dismiss();
                }
            }

        },
        Settings: {
            screen: stackSetting,
            navigationOptions: {
                tabBarLabel: 'Menu',
                tabBarIcon: ({ tintColor }) => {
                    return (
                        <Icon name="menu" color={tintColor} size={24} />
                    )
                },
                tabBarOnPress: (evt) => {
                    Keyboard.dismiss();
                }
            }
        }
    },
    {
        initialRouteName: 'Home',
        activeTintColor: Color.Tomato,
        // shifting: true,
        // barStyle: { backgroundColor: '#fff' },
        activeColor: '#f0edf6',
        inactiveColor: '#3e2465',
        barStyle: { backgroundColor: '#fff' },
        animationEnabled: true,
        tabBarOptions: {
            showLabel: false
        }

    }
)