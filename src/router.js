import React, { Component } from 'react';
import { createStackNavigator, createDrawerNavigator, createSwitchNavigator, DrawerActions, createAppContainer } from 'react-navigation'
import { StyleSheet, View, Text, TouchableOpacity, Linking } from 'react-native';
import { Icon } from 'native-base';
import '../global';
import '../shim.js';
import crypto from 'crypto';
import Lang, { DeviceLanguage, selectLang } from './i18n/i18n';
import { getData } from './services/data.service';
import { Check_registered } from './services/auth.service';
import SplashScreen from 'react-native-splash-screen';
import { initAuth } from './services/auth.service'
import { CHECK_REGISTER } from '../redux/actions/initWallet';
import { ONSNAPWALLET } from '../redux/actions/slideWalletAction';
import { connect } from "react-redux";
import { DeleteAllWallet, deleteDB } from '../realm/walletSchema';
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
import Language from "./pages/languages/language";
import ChangePIN from './pages/changePIN/changePIN';
import TempPage from './Drawer';
import ListToken from './pages/list-token/token';
// import SelectNetwork from './pages/network/network'
/* screen drawer*/
import Setting from './pages/setting/setting';
import history from './pages/history/history';
import About from './pages/about/about';
import Addtoken from './pages/add-token/add-token';
import redeem from './pages/redeem/redeem';
import TabNavigator from './tabfooter';
import Prk from './pages/private-key/private-key';
import request from './pages/request/request';
import Send from './pages/send/send';
import dashboard from './pages/dashboard/dashboard';


// Screen add new wallet
import TypeAddWallet from './pages/addNewWallet/typeAdd';
import NameWallet from './pages/addNewWallet/nameWallet';
import SelectNetwork from './pages/addNewWallet/selectNetwork';
import InforWallet from './pages/inforWallet';

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
        // TabNavigator: { screen: TabNavigator },
        Dashboard: { screen: dashboard },
        Privatekey: { screen: Prk },
        // Addtoken: { screen: Addtoken },
        Setting: { screen: Setting },
        History: { screen: history },
        About: { screen: About },
        Redeem: { screen: redeem },
    }, {
        initialRouteName: "Dashboard",
        drawerBackgroundColor: 'transparent',
        style: {
            backgroundColor: 'transparent'
        },
        drawerWidth: GLOBALS.wp('100%'),
        backBehavior: 'initialRoute',
        /** customize drawer*/
        contentComponent: props => <Sidebar {...props} />
    }
)


class Router extends Component {
    constructor(props) {
        super(props)
        try {
            Check_registered().then(registered => {
                console.log('type register', registered)
                if (registered) {
                    this.props.dispatch(CHECK_REGISTER());
                }
            })
        } catch (error) {
            console.log(error)
        }

    }

    state = { InitLanguage: false }

    componentWillMount() {
        SplashScreen.hide();
        // DeleteAllWallet()
        // deleteDB()
        try {
            getData('languages').then(lang => {
                console.log('languages router', lang)
                if (lang == null) {
                    DeviceLanguage()
                    this.setState({ InitLanguage: true })
                } else {
                    getData('languages').then(data => {
                        Lang.locale = data;
                        this.setState({ InitLanguage: true })
                    }).catch(err => {
                        this.setState({ InitLanguage: true })
                        console.log(err)
                    })
                }
            })
        } catch (error) {
            console.log('err', error)
            DeviceLanguage()
            this.setState({ InitLanguage: true })
        }
    }

    render() {
        const Screen = createStackNavigator(
            {
                Drawer: {
                    screen: Drawer,
                    navigationOptions: {
                        header: () => null,
                    }
                },
                login: {
                    screen: login,
                },
                TempPage: { screen: TempPage },
                ListToken: { screen: ListToken },
                register: { screen: register },
                restore: { screen: restore },
                Backup: { screen: Backup },
                DetailsHis: { screen: DetailHis },
                QRscan: { screen: QRscan },
                Language: { screen: Language },
                ChangePIN: { screen: ChangePIN },
                Setting: { screen: Setting },
                SelectNetwork: { screen: SelectNetwork },
                AddNewWallet: {
                    screen: TypeAddWallet,
                    navigationOptions: {
                        header: () => null
                    }
                },
                NameWallet: {
                    screen: NameWallet,
                    navigationOptions: {
                        header: () => null
                    }
                },
                SelectNetwork: {
                    screen: SelectNetwork,
                    navigationOptions: {
                        header: () => null
                    }
                },
                InforWallet: {
                    screen: InforWallet,
                    navigationOptions: {
                        header: () => null
                    }
                },
                Addtoken: {
                    screen: Addtoken,
                    navigationOptions: {
                        header: () => null
                    }
                },
                SendScreen: {
                    screen: Send,
                    navigationOptions: {
                        header: () => null
                    }
                },
            },
            {
                initialRouteName: this.props.register ? 'login' : 'register',
            },
        )


        if (this.state.InitLanguage) {
            return (
                <Screen />
            )
        } else {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Initial languages ....</Text>
                </View>
            )
        }
    }
}

function mapStateToProp(state) {
    return { register: state.Register.registered }
}

export default connect(mapStateToProp)(Router);


