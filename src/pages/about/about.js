import React, { Component } from 'react'
import { View, Image, StyleSheet, Platform, StatusBar, Text } from 'react-native';
import GLOBALS from '../../helper/variables';
import Language from '../../i18n/i18n'
import Header from '../../components/header';
import Gradient from 'react-native-linear-gradient';
import { getStatusBarHeight } from 'react-native-iphone-x-helper'


export default class About extends Component {

    render() {
        return (
            <Gradient
                colors={['#F0F3F5', '#E8E8E8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ flex: 1 }}>
                <StatusBar
                    backgroundColor={'transparent'}
                    translucent
                    barStyle="dark-content"
                />
                <Header
                    backgroundColor="transparent"
                    colorIconLeft="#328FFC"
                    colorTitle="#328FFC"
                    nameIconLeft="align-left"
                    title={Language.t('About.Title')}
                    style={{ paddingTop: getStatusBarHeight() }}
                    pressIconLeft={() => { this.props.navigation.openDrawer() }}
                />

                <View style={style.container}>
                    <View style={style.MainForm}>
                        <Image style={style.logo} source={require('../../images/logo-with-text.png')} resizeMode="contain" />
                        <Text style={{ textAlign: 'center', marginTop: GLOBALS.HEIGHT / 40, fontFamily: GLOBALS.font.Poppins }}>{Language.t("About.Content")}</Text>
                    </View>
                </View>
            </Gradient>
        )
    }
}
const style = StyleSheet.create({
    container: {
        flex: 1,
        padding: GLOBALS.hp('2%'),
    },
    MainForm: {
        flex: 1,
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: {
            width: -1,
            height: 3,
        },
        shadowOpacity: 0.24,
        shadowRadius: 2.27,
        elevation: 2,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        padding: GLOBALS.wp('2%')
    },
    logo: {
        height: GLOBALS.HEIGHT / 3,
        width: GLOBALS.WIDTH / 1.6,
        // justifyContent: 'center',
        // alignItems: 'center',
        // marginTop: GLOBALS.HEIGHT / 15
    },
})
