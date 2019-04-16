import React, { Component } from 'react';
import { Image, StyleSheet, Platform, Keyboard, Alert, View, FlatList, TouchableOpacity, SafeAreaView, Text } from "react-native";
import GLOBALS from './helper/variables';
import { logout } from './services/auth.service'
import Icon from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons"
import Language from './i18n/i18n';
import Gradient from 'react-native-linear-gradient'

export default class sidebar extends Component {


    constructor(props) {
        Keyboard.dismiss();
        super(props);
        this.state = {
            shadowOffsetWidth: 1,
            shadowRadius: 4,
        };
    }

    navigationPage = (route) => {
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
                name: Language.t('Dashboard.Title'),
                route: 'Dashboard',
                icon: require('./images/iconMenu/home.png')
            },
            {
                name: Language.t('ManageWallet.Title'),
                route: 'ManageWL',
                icon: require('./images/iconMenu/manage.png')
            },
            {
                name: Language.t('Drawer.Redeem'),
                route: 'Redeem',
                icon: require('./images/iconMenu/redeem.png')
            },
            {
                name: Language.t('Drawer.Settings'),
                route: 'Setting',
                icon: require('./images/iconMenu/setting.png')
            },
            {
                name: Language.t('Drawer.About'),
                route: 'About',
                icon: require('./images/iconMenu/info.png')
            },
            // {
            //     name: Language.t('Drawer.Logout'),
            //     route: 'Unlogin',
            //     icon: require('./images/iconMenu/Logout.png')
            // },
        ]

        return (
            <Gradient
                colors={['#F0F3F5', '#E8E8E8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{ backgroundColor: 'rgba(0,0,0,0.3)', flex: 1, paddingTop: GLOBALS.hp('10%') }}
            >
                <View style={{ alignItems: 'center', marginBottom: GLOBALS.hp('10%') }}>
                    <TouchableOpacity
                        style={{ height: 50, width: 50, alignItems: 'center' }}
                        onPress={() => { this.props.navigation.closeDrawer() }}>
                        <Ionicons name="ios-close" size={GLOBALS.wp('17%')} color="#328FFC" />
                    </TouchableOpacity>
                </View>
                <FlatList
                    style={styles.ListMenu}
                    data={datas}
                    extraData={this.state}
                    // numColumns={3}
                    renderItem={({ index, item }) => {
                        return (
                            <TouchableOpacity
                                onPress={() => this.navigationPage(item.route)}
                                style={styles.contentList}
                            >
                                <View style={{ flex: 8, justifyContent: 'center' }}>
                                    <Text style={styles.textItem}>{item.name}</Text>
                                </View>
                                <View style={{ flex: 2, alignItems: 'center' }}>
                                    <Image source={item.icon}

                                        resizeMode="cover"
                                    />
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                    keyExtractor={(item) => item.name}
                />
                <Text style={{ fontFamily: GLOBALS.font.Poppins, paddingHorizontal: GLOBALS.wp('2%') }}>Version: 0.0.1</Text>
            </Gradient>
        )
    }
}

const styles = StyleSheet.create({
    contentList: {
        // alignItems: 'center',
        // width: GLOBALS.wp('33.3%'),
        // marginBottom: GLOBALS.hp('5%'),
        flexDirection: 'row',
        backgroundColor: '#F8F9F9',
        borderRadius: 5,
        marginVertical: GLOBALS.hp('0.5%'),
        paddingVertical: GLOBALS.hp('2%'),
    },
    textItem: {
        fontSize: GLOBALS.wp('4.5%'),
        color: '#000',
        textAlign: 'left',
        fontFamily: GLOBALS.font.Poppins,
        fontWeight: 'bold',
        paddingLeft: GLOBALS.wp('5%'),
    },
    ListMenu: {
        paddingHorizontal: GLOBALS.wp('5%')
    }
})