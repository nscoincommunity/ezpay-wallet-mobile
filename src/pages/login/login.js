import React, { Component } from 'react'
import { Platform, StyleSheet, Text, View, Image, TouchableOpacity, KeyboardAvoidingView, ScrollView, AsyncStorage } from 'react-native';
import { Form, Item, Input, Label, Title, Spinner } from 'native-base'
import GLOBALS from '../../helper/variables';
import { StackNavigator } from 'react-navigation';
import { initAuth, Address, isAuth, Login } from '../../services/auth.service'
import { getData, checkAuth } from '../../services/data.service'
import Lang from '../../i18n/i18n'
// import I18n from 'react-native-i18n';

// I18n.fallbacks = true;
// I18n.translations = {
//     'en': require('../../i18n/en'),
//     'vi': require('../../i18n/vi')
// };

class ScreenLogin extends Component {


    constructor(props) {
        super(props)

        this.state = {
            Address: '',
            Password: '',
            loading: false,
            TextError: '',
            Error: false,
            TextErrorAddress: '',
            ErrorAddress: false,
            TextErrorPwd: '',
            ErrorPwd: false,
            typeButton: true
        };
        initAuth().then(data => {
            this.setState({ Address: Address })
        })

    };

    // componentDidMount() {
    //     console.log(Lang)
    //     initAuth().then(data => {
    //         this.setState({ Address: Address })
    //     })
    // }


    static navigationOptions = {
        header: null,
    };


    LoginNTY() {
        this.setState({ loading: true })
        Login(this.state.Address, this.state.Password)
            .then(data => {
                this.setState({ loading: false })
                const { navigate } = this.props.navigation;
                navigate('Drawer');
            }).catch(err => {
                console.log(err)
                this.setState({ TextError: Lang.t('Login.InvalidCredentials'), loading: false })
            })
    }

    async checkPassword(val) {
        await this.setState({ TextError: '' });
        if (val.length < 6) {
            await this.setState({ ErrorPwd: true, TextErrorPwd: Lang.t('Login.InvalidLocalPasscode'), typeButton: true })
        } else {
            await this.setState({ Password: val, ErrorPwd: false, TextErrorPwd: '', typeButton: false })
        }
    }

    async checkAddress(val) {
        await this.setState({ TextError: '' });
        if (val.length < 1) {
            await this.setState({ Address: '', ErrorAddress: true, TextErrorAddress: Lang.t('Login.InvalidAddress'), typeButton: true });
        } else {
            await this.setState({ Address: val, ErrorAddress: false, TextErrorAddress: '', typeButton: false })
        }
        if (this.state.Password == '' || this.state.ErrorPwd == true) {
            await this.setState({ typeButton: true });
        } else {
            await this.setState({ typeButton: true });
        }

    }
    handleKeyDown(e) {
        console.log(e.nativeEvent)
        if (e.nativeEvent.key == "Enter") {
            dismissKeyboard();
        }
    }

    focusTheField = (id) => {
        this.inputs[id]._root.focus();
    }
    inputs = {};

    render() {
        return (
            <View style={style.container}>
                <Image style={style.logo} source={require('../../images/logo-with-text.png')} resizeMode="contain" />
                <Form style={style.FormLogin}>
                    <Item floatingLabel error={this.state.ErrorAddress}>
                        <Label>{Lang.t('Login.PHAddress')}</Label>
                        {/* <Label>Address wallet</Label> */}
                        <Input
                            autoFocus={true}
                            onChangeText={(val) => this.checkAddress(val)}
                            value={this.state.Address}
                            returnKeyType={"next"}
                            blurOnSubmit={false}
                            onSubmitEditing={() => { this.focusTheField('field2'); }}
                        />
                    </Item>
                    <Item style={{ borderBottomWidth: 0 }}>
                        <Text style={{ color: GLOBALS.Color.danger }}>{this.state.TextErrorAddress}</Text>
                    </Item>
                    <Item floatingLabel error={this.state.ErrorPwd}>
                        <Label>{Lang.t('Login.PHLocalPasscode')}</Label>
                        <Input
                            onChangeText={(val) => this.checkPassword(val)}
                            secureTextEntry={true}
                            returnKeyType="done"
                            getRef={input => { this.inputs['field2'] = input }}
                            onSubmitEditing={() => {
                                if (this.state.typeButton == false) {
                                    this.LoginNTY()
                                }
                            }}
                        />
                    </Item>
                    <Item style={{ borderBottomWidth: 0 }}>
                        <Text style={{ color: GLOBALS.Color.danger }}>{this.state.TextErrorPwd}</Text>
                    </Item>
                    <Item style={{ borderBottomWidth: 0 }}>
                        <Text style={{ color: GLOBALS.Color.danger }}>{this.state.TextError}</Text>
                    </Item>
                </Form>
                <View style={style.FormRouter}>
                    <TouchableOpacity style={styleButton(GLOBALS.Color.secondary, this.state.typeButton).button} onPress={() => this.LoginNTY()} disabled={this.state.typeButton}>
                        <Text style={style.TextButton}>{Lang.t('Login.TitleButton')}</Text>
                    </TouchableOpacity>
                </View>

                {
                    this.state.loading ?
                        <View style={{ position: 'absolute', flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Platform.OS == 'ios' ? 'rgba(155, 155, 155, 0.63)' : 'tranparent', height: GLOBALS.HEIGHT, width: GLOBALS.WIDTH }} >
                            <View style={{ backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderRadius: 10, padding: 10, aspectRatio: 1 }}>
                                <Spinner color={GLOBALS.Color.primary} />
                                <Text>{Lang.t('Login.TitleButton')}</Text>
                            </View>
                        </View>
                        : null
                }
            </View >

        )
    }

}
export default class login extends Component {
    static navigationOptions = () => ({
        title: Lang.t('Login.Title'),
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
    });

    render() {
        return (
            <ScrollView >
                <KeyboardAvoidingView style={style.container} behavior="position" keyboardVerticalOffset={65} enabled>
                    <ScreenLogin {...this.props} />
                </KeyboardAvoidingView>
            </ScrollView>
        )
    }
}
/* style button */
var styleButton = (color, type) => StyleSheet.create({
    button: {
        backgroundColor: type == true ? '#cccccc' : color,
        marginBottom: GLOBALS.HEIGHT / 40,
        height: GLOBALS.HEIGHT / 17,
        justifyContent: 'center',
        width: GLOBALS.WIDTH / 1.6
    }
})

const style = StyleSheet.create({
    container: {
        flex: 1,
        // marginTop: Platform.OS === 'ios' ? 25 : 0,
        alignItems: 'center',
    },
    logo: {
        height: GLOBALS.HEIGHT / 3,
        width: GLOBALS.WIDTH / 1.6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    FormRouter: {
        // paddingLeft: GLOBALS.WIDTH / 5,
        // paddingRight: GLOBALS.WIDTH / 5
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    TextButton: {
        color: 'white',
        textAlign: 'center',
        fontSize: 15
    },
    FormLogin: {
        width: GLOBALS.WIDTH,
        marginBottom: GLOBALS.HEIGHT / 20,
    }
})