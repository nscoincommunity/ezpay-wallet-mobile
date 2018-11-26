import React, { Component } from 'react';
import { Image, StyleSheet, Platform, Keyboard, Alert, View, FlatList, TouchableOpacity, SafeAreaView } from "react-native";
import GLOBALS from './helper/variables';
import { logout } from './services/auth.service'

import {
    Content,
    Text,
    List,
    ListItem,
    Container,
    Left,
    Right,
    Badge,
    Footer,
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons"
import Language from './i18n/i18n';
import FireAnalytics from "./services/fcm.service"



export default class sidebar extends Component {


    constructor(props) {
        Keyboard.dismiss();
        super(props);
        this.state = {
            shadowOffsetWidth: 1,
            shadowRadius: 4,
        };
    }

    navigationPage(route) {
        if (route == 'Unlogin') {
            Alert.alert(
                Language.t("ConfirmLogout.Content"),
                '',
                [
                    { text: Language.t("ConfirmLogout.ButtonCancel"), style: 'Cancel', onPress: () => { this.props.navigation.closeDrawer() } },
                    {
                        text: Language.t("ConfirmLogout.ButtonAgree"), onPress: () => {
                            logout().then(() => {
                                this.props.navigation.navigate(route);
                                FireAnalytics.setUserProperty('Action', 'Log_out')
                                FireAnalytics.logEvent(this)
                            })
                        }
                    }
                ]
            )

        } else {
            this.props.navigation.navigate(route);
            this.props.navigation.closeDrawer()
        }
    }

    render() {
        const datas = [
            {
                name: 'Nexty wallet',
                route: 'TabNavigator',
                icon: require('./images/iconMenu/home.png')
            },
            {
                name: Language.t('Drawer.Redeem'),
                route: 'Redeem',
                icon: require('./images/iconMenu/Redeem.png')
            },
            {
                name: Language.t('Drawer.Privatekey'),
                route: 'Privatekey',
                icon: require('./images/iconMenu/Privatekey.png')
            },
            {
                name: Language.t('Drawer.Addtoken'),
                route: 'Addtoken',
                icon: require('./images/iconMenu/Addtoken.png')
            },
            {
                name: Language.t('Drawer.History'),
                route: 'History',
                icon: require('./images/iconMenu/History.png')
            },
            {
                name: Language.t('Drawer.Settings'),
                route: 'Setting',
                icon: require('./images/iconMenu/Settings.png')
            },
            {
                name: Language.t('Drawer.About'),
                route: 'About',
                icon: require('./images/iconMenu/About.png')
            },
            {
                name: Language.t('Drawer.Logout'),
                route: 'Unlogin',
                icon: require('./images/iconMenu/Logout.png')
            },
        ]

        return (
            //<SafeAreaView style={{ flex: 1 }}>
            <View style={{ backgroundColor: 'rgba(0,0,0,0.3)', flex: 1, paddingTop: GLOBALS.hp('10%') }}>
                <View style={{ alignItems: 'center', marginBottom: GLOBALS.hp('10%') }}>
                    <TouchableOpacity
                        style={{ height: 50, width: 50, alignItems: 'center' }}
                        onPress={() => { this.props.navigation.closeDrawer() }}>
                        {/* <Text style={{ color: '#fff', fontSize: GLOBALS.wp('15%'), textAlign: 'center' }}>X</Text> */}
                        <Ionicons name="ios-close" size={GLOBALS.wp('17%')} color="#fff" />
                    </TouchableOpacity>
                </View>
                <FlatList
                    style={styles.ListMenu}
                    data={datas}
                    extraData={this.state}
                    numColumns={3}
                    renderItem={({ index, item }) => {
                        return (
                            <TouchableOpacity
                                onPress={() => this.navigationPage(item.route)}
                                style={styles.contentList}
                            >
                                <Image source={item.icon}
                                    style={{
                                        height: GLOBALS.wp('10%'),
                                        width: GLOBALS.wp('10%')
                                    }}
                                    resizeMode="contain"
                                />
                                <Text style={styles.textItem}>{item.name}</Text>
                            </TouchableOpacity>
                        )
                    }}
                    keyExtractor={(item) => item.name}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    text: {
        fontWeight: Platform.OS === "ios" ? "500" : "400",
        fontSize: 16,
        marginLeft: 20
    },
    badgeText: {
        fontSize: Platform.OS === "ios" ? 13 : 11,
        fontWeight: "400",
        textAlign: "center",
        marginTop: Platform.OS === "android" ? -3 : undefined
    },
    ListItem: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentList: {
        alignItems: 'center',
        width: GLOBALS.wp('33.3%'),
        // height: GLOBALS.wp('30%'),
        marginBottom: GLOBALS.hp('5%'),

    },
    textItem: {
        fontSize: GLOBALS.wp('5%'),
        color: '#fff',
        textAlign: 'center',
        fontFamily: GLOBALS.font.Poppins,
        marginTop: GLOBALS.hp('3%'),
    }
})