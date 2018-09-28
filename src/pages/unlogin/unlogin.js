import React, { Component } from 'react'
import { Platform, StyleSheet, Text, View, Image, Dimensions, TouchableOpacity, StatusBar } from 'react-native';
import GLOBALS from '../../helper/variables';
import { StackNavigator } from 'react-navigation';
import { initAuth, isAuth, Address, cachePwd } from '../../services/auth.service'
import { getExchangeRate } from '../../services/rate.service'
import { Spinner } from 'native-base';

export default class unlogin extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isAuth: false
        };
    };


    componentDidMount() {
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
            < View style={style.container} >
                <StatusBar
                    backgroundColor={GLOBALS.Color.primary}
                    barStyle="light-content"
                />
                <Image style={style.logo} source={require('../../images/logo-with-text.png')} resizeMode="contain" />
                <View style={style.FormRouter}>
                    <TouchableOpacity style={styleButton(GLOBALS.Color.primary).button} onPress={this.goLogin.bind(this)} >
                        <Text style={style.TextButton}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styleButton(GLOBALS.Color.secondary).button} onPress={this.goRegister.bind(this)}>
                        <Text style={style.TextButton}>Create Wallet</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styleButton(GLOBALS.Color.tertiary).button} onPress={this.goRestore.bind(this)}>
                        <Text style={style.TextButton}>Restore Wallet</Text>
                    </TouchableOpacity>
                </View>
                {
                    this.state.isAuth ?
                        <View style={{ position: 'absolute', flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(155, 155, 155, 0.63)', height: GLOBALS.HEIGHT, width: GLOBALS.WIDTH }} >
                            <View style={{ backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderRadius: 10, padding: 10, aspectRatio: 1 }}>
                                <Spinner color={GLOBALS.Color.primary} />
                                <Text>Auto login ...</Text>
                            </View>
                        </View>
                        : null
                }

            </View >
        )
    }
    // }
}

var styleButton = (color) => StyleSheet.create({
    button: {
        backgroundColor: color,
        marginBottom: GLOBALS.HEIGHT / 40,
        height: GLOBALS.HEIGHT / 17,
        justifyContent: 'center',
        width: GLOBALS.WIDTH / 1.6
    }
})

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        height: GLOBALS.HEIGHT / 2.1,
        width: GLOBALS.WIDTH / 1.6,
        justifyContent: 'center',
    },
    FormRouter: {

    },
    TextButton: {
        color: 'white',
        textAlign: 'center',
        fontSize: 15
    }
})