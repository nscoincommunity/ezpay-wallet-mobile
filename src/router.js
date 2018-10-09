import React, { Component } from 'react';
import { createStackNavigator, createDrawerNavigator } from 'react-navigation'
import { StyleSheet } from 'react-native';
import '../global';
import '../shim.js';
import crypto from 'crypto'
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
            navigationOptions: setHeader('Login'),
        },
        register: {
            screen: register,
            navigationOptions: setHeader('Create wallet')
        },
        restore: {
            screen: restore,
            navigationOptions: setHeader('Restore wallet')
        },
        Backup: {
            screen: Backup,
            navigationOptions: setHeader('Backup')
        },
        DetailsHis: {
            screen: DetailHis,
            navigationOptions: setHeader('Transaction Details')
        },
        QRscan: {
            screen: QRscan,
            navigationOptions: setHeader('QR scan')
        }

    },
    {
        initialRouteName: "Unlogin",
    },
)
export default class Router extends Component {
    render() {
        return <Screen />;
    }
}


