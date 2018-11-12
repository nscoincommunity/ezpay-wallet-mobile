import React, { Component } from 'react'
import { Platform, StyleSheet, Text, View, Image, Dimensions, TouchableOpacity, ImageBackground } from 'react-native';
import GLOBALS from '../../helper/variables';
import { initAuth, isAuth, Address, cachePwd } from '../../services/auth.service'
import { getExchangeRate } from '../../services/rate.service'
import { Spinner } from 'native-base';
import Lang from '../../i18n/i18n';
import Gradient from "react-native-linear-gradient"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../helper/Reponsive';


export default class unlogin extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isAuth: false
        };
    };


    componentDidMount() {
        // const { navigate } = this.props.navigation;
        // navigate('Drawer');
        initAuth()
            .then(async data => {
                if (isAuth) {
                    await this.setState({ isAuth });
                    await getExchangeRate()
                    const { navigate } = await this.props.navigation;
                    navigate('TabNavigator');
                    setTimeout(() => {
                        this.setState({ isAuth: false })

                    }, 100);
                }
            }

            )
    }

    async goLogin() {
        const { navigate } = this.props.navigation;
        navigate('login');
    }
    goRegister() {
        const { navigate } = this.props.navigation;
        navigate('register');
    }
    goRestore() {
        const { navigate } = this.props.navigation;
        navigate('restore');
    }
    render() {
        return (
            < ImageBackground style={style.container} source={require('../../images/bg.png')}>
                <Image style={style.logo} source={require('../../images/Logo.png')} resizeMode="contain" />
                <View style={style.FormRouter}>
                    <TouchableOpacity style={style.button} onPress={this.goLogin.bind(this)} >
                        <Gradient
                            colors={['#0C449A', '#082B5F']}
                            start={{ x: 1, y: 0.7 }}
                            end={{ x: 0, y: 3 }}
                            style={style.gradient}
                        >
                            <Text style={style.TextButton}>{Lang.t('Unlogin.Login')}</Text>
                        </Gradient>
                    </TouchableOpacity>
                    <TouchableOpacity style={style.button} onPress={this.goRegister.bind(this)}>
                        <Gradient
                            colors={['#EDA420', '#FCB415']}
                            start={{ x: 0, y: 0 }}
                            style={style.gradient}
                        >
                            <Text style={style.TextButton}>{Lang.t('Unlogin.CreateWallet')}</Text>
                        </Gradient>
                    </TouchableOpacity>
                    <TouchableOpacity style={style.button} onPress={this.goRestore.bind(this)}>
                        <Gradient
                            colors={['#30C7D3', '#17AAEC']}
                            start={{ x: 1, y: 0.4 }}
                            style={style.gradient}
                        >
                            <Text style={style.TextButton}>{Lang.t('Unlogin.Restore')}</Text>
                        </Gradient>
                    </TouchableOpacity>
                </View>
                {
                    this.state.isAuth ?
                        <View style={{ position: 'absolute', flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(155, 155, 155, 0.63)', height: GLOBALS.HEIGHT, width: GLOBALS.WIDTH }} >
                            <View style={{ backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderRadius: 10, padding: 10, aspectRatio: 1 }}>
                                <Spinner color={GLOBALS.Color.primary} />
                                <Text>{Lang.t('Unlogin.AutoLogin')}</Text>
                            </View>
                        </View>
                        : null
                }
            </ ImageBackground >
        )
    }
    // }
}


const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gradient: {
        paddingHorizontal: GLOBALS.WIDTH / 5,
        paddingVertical: GLOBALS.HEIGHT / 60,
        borderRadius: 5
    },
    button: {
        marginBottom: GLOBALS.HEIGHT / 30,
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: -1,
            height: 1,
        },
        shadowOpacity: 0.54,
        shadowRadius: 5.27,
        elevation: 30,
    },
    logo: {
        height: GLOBALS.HEIGHT / 2.1,
        width: GLOBALS.WIDTH / 1.6,
        justifyContent: 'center',
        marginBottom: GLOBALS.HEIGHT / 13,
    },
    TextButton: {
        color: 'white',
        textAlign: 'center',
        fontSize: hp('2.3%'),
        fontFamily: GLOBALS.font.Poppins,
        fontWeight: '400',
    }
})