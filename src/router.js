import React, { Component } from 'react';
import { createStackNavigator, createDrawerNavigator, createSwitchNavigator } from 'react-navigation'
import { StyleSheet, View, Text } from 'react-native';
import '../global';
import '../shim.js';
import crypto from 'crypto';
import Lang, { DeviceLanguage, selectLang } from './i18n/i18n';
import { getData } from './services/data.service'

/* screen stack */
import Sidebar from "./sidebar";
import GLOBALS from './helper/variables';
import login from './pages/login/login';
import unlogin from './pages/unlogin/unlogin';
import register from './pages/register/register';
import restore from './pages/restore/restore';
import Backup from './pages/backup/backup';
import DetailHis from './pages/detail/detail';
import QRscan from "./components/qrscan";
import Language from "./pages/languages/language"

/* screen drawer*/
import Setting from './pages/setting/setting';
import history from './pages/history/history';
import About from './pages/about/about';
import Addtoken from './pages/add-token/add-token';
import redeem from './pages/redeem/redeem';
import TabNavigator from './tabfooter';
import Prk from './pages/private-key/private-key';
import request from './pages/request/request';
import send from './pages/send/send';
import dashboard from './pages/dashboard/dashboard';

// Lang.locale = 'vi'
/* customize header */
function setHeader(title) {
    return {
        headerStyle: {
            backgroundColor: GLOBALS.Color.primary,
        },
        headerTitleStyle: {
            color: 'white',
        },
        headerBackTitleStyle: {
            color: 'white',
        },
        headerTintColor: 'white',
        title: title
    }
}

const Drawer = createDrawerNavigator(
    {
        Dashboard: { screen: dashboard },
        Redeem: { screen: redeem },
        Request: { screen: request },
        Sendpage: { screen: send },
        TabNavigator: { screen: TabNavigator },
        Privatekey: { screen: Prk },
        Addtoken: { screen: Addtoken },
        Setting: { screen: Setting },
        History: { screen: history },
        About: { screen: About }
    }, {
        initialRouteName: "TabNavigator",
        /** customize drawer*/
        contentComponent: props => <Sidebar {...props} />
    }
)
const Screen = createStackNavigator(
    {
        Unlogin: {
            screen: unlogin,
            navigationOptions: {
                header: () => null,
            }
        },
        Drawer: {
            screen: Drawer,
            navigationOptions: {
                header: () => null,
            }
        },
        login: {
            screen: login,
            // navigationOptions: setHeader(Lang.t('LOGIN_TITLE')),
        },
        register: {
            screen: register,
            // navigationOptions: setHeader(Lang.t('Register.Title'))
        },
        restore: {
            screen: restore,
            // navigationOptions: setHeader(Lang.t('Restore.Title'))
        },
        Backup: {
            screen: Backup,
            // navigationOptions: setHeader(Lang.t('Backup.Title'))
        },
        DetailsHis: {
            screen: DetailHis,
            // navigationOptions: setHeader(Lang.t('DetailHistory.Title'))
        },
        QRscan: {
            screen: QRscan,
            // navigationOptions: setHeader(Lang.t('QRScan.Title'))
        },
        Language: {
            screen: Language,
            // navigationOptions: setHeader(Lang.t('Languages.Title'))
        }

    },
    {
        initialRouteName: "Unlogin",
    },
)



export default Screen;

// export default class Router extends Component {
//     state = { InitLanguage: false }

//     componentWillMount() {
//         try {
//             getData('languages').then(lang => {
//                 console.log('languages router', lang)
//                 if (lang == null) {
//                     DeviceLanguage()
//                     this.setState({ InitLanguage: true })
//                 } else {
//                     getData('languages').then(data => {
//                         Lang.locale = data;
//                         this.setState({ InitLanguage: true })
//                     }).catch(err => {
//                         this.setState({ InitLanguage: true })
//                         console.log(err)
//                     })
//                 }
//             })
//         } catch (error) {
//             console.log('err', error)
//             DeviceLanguage()
//             this.setState({ InitLanguage: true })
//         }
//     }

//     render() {
//         const Screen = createStackNavigator(
//             {
//                 Unlogin: {
//                     screen: unlogin,
//                     navigationOptions: {
//                         header: () => null,
//                     }
//                 },
//                 Drawer: {
//                     screen: Drawer,
//                     navigationOptions: {
//                         header: () => null,
//                     }
//                 },
//                 login: {
//                     screen: login,
//                     // navigationOptions: setHeader(Lang.t('LOGIN_TITLE')),
//                 },
//                 register: {
//                     screen: register,
//                     // navigationOptions: setHeader(Lang.t('Register.Title'))
//                 },
//                 restore: {
//                     screen: restore,
//                     // navigationOptions: setHeader(Lang.t('Restore.Title'))
//                 },
//                 Backup: {
//                     screen: Backup,
//                     // navigationOptions: setHeader(Lang.t('Backup.Title'))
//                 },
//                 DetailsHis: {
//                     screen: DetailHis,
//                     // navigationOptions: setHeader(Lang.t('DetailHistory.Title'))
//                 },
//                 QRscan: {
//                     screen: QRscan,
//                     // navigationOptions: setHeader(Lang.t('QRScan.Title'))
//                 },
//                 Language: {
//                     screen: Language,
//                     // navigationOptions: setHeader(Lang.t('Languages.Title'))
//                 }

//             },
//             {
//                 initialRouteName: "Drawer",
//             },
//         )

//         // const AppNavigator = createSwitchNavigator({
//         //     Stack: Screen
//         // })

//         if (this.state.InitLanguage) {
//             return (
//                 <Screen />
//             )
//         } else {
//             return (
//                 <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//                     <Text>Initial languages ....</Text>
//                 </View>
//             )
//         }
//     }
// }


