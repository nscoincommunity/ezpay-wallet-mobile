import React, { Component } from 'react'
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    KeyboardAvoidingView,
    ScrollView,
    AsyncStorage,
    TextInput,
    Modal,
    ActivityIndicator
} from 'react-native';
import GLOBALS from '../../helper/variables';
import { StackNavigator } from 'react-navigation';
import { initAuth, Address, isAuth, Login } from '../../services/auth.service'
import { getData, checkAuth } from '../../services/data.service'
import Lang from '../../i18n/i18n';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../helper/Reponsive';
import Gradient from 'react-native-linear-gradient'


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
        this.inputs[id].focus();
    }
    inputs = {};


    render() {
        return (
            <View style={style.container}>
                <Text style={{ fontSize: hp('4%'), fontWeight: '400', color: '#444444', marginTop: hp('10%'), fontFamily: GLOBALS.font.Poppins }}>Sign in to continue</Text>
                <Text style={{ fontSize: hp('2.5%'), fontWeight: '400', color: '#444444', marginTop: hp('4%'), fontFamily: GLOBALS.font.Poppins }}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</Text>
                <View style={{
                    justifyContent: 'center',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    borderBottomWidth: 1,
                    borderBottomColor: '#AAAAAA',
                    paddingVertical: Platform.OS === 'ios' ? hp('1.5%') : 'auto',
                    marginTop: hp('20%')
                }}>
                    <TextInput
                        placeholder={Lang.t('Login.PHAddress')}
                        onChangeText={(val) => this.checkAddress(val)}
                        value={this.state.Address}
                        returnKeyType={"next"}
                        blurOnSubmit={false}
                        onSubmitEditing={() => { this.focusTheField('field2'); }}
                        style={{ flex: 9, fontSize: hp('3%') }}
                        underlineColorAndroid="transparent"
                    />
                    <Image source={require('../../images/icon/wallet.png')} style={{ flex: 1 }} resizeMode="contain" />
                </View>
                <Text style={{ color: GLOBALS.Color.danger }}>{this.state.TextErrorAddress}</Text>
                <View style={{
                    justifyContent: 'center',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    borderBottomWidth: 1,
                    borderBottomColor: '#AAAAAA',
                    paddingVertical: Platform.OS === 'ios' ? hp('1.5%') : 'auto',
                }}>
                    <TextInput
                        placeholder={Lang.t('Login.PHLocalPasscode')}
                        onChangeText={(val) => this.checkPassword(val)}
                        secureTextEntry={true}
                        returnKeyType="done"
                        ref={input => { this.inputs['field2'] = input }}
                        onSubmitEditing={() => {
                            if (this.state.typeButton == false) {
                                this.LoginNTY()
                            }
                        }}
                        style={{ flex: 9, fontSize: hp('3%') }}
                        underlineColorAndroid="transparent"
                    />
                    <Image source={require('../../images/icon/Private-key.png')} style={{ flex: 1 }} resizeMode="contain" />

                </View>
                <Text style={{ color: GLOBALS.Color.danger }}>{this.state.TextErrorPwd}</Text>
                <Text style={{ color: GLOBALS.Color.danger }}>{this.state.TextError}</Text>

                <View style={style.FormRouter}>
                    <TouchableOpacity style={styleButton(GLOBALS.Color.secondary, this.state.typeButton).button} onPress={() => this.LoginNTY()} disabled={this.state.typeButton}>
                        <Gradient
                            colors={this.state.typeButton ? ['#cccccc', '#cccccc'] : ['#0C449A', '#082B5F']}
                            start={{ x: 1, y: 0.7 }}
                            end={{ x: 0, y: 3 }}
                            style={{ paddingVertical: hp('2%'), borderRadius: 5 }}
                        >
                            <Text style={style.TextButton}>{Lang.t('Login.TitleButton')}</Text>
                        </Gradient>
                    </TouchableOpacity>
                </View>

                {
                    this.state.loading ?
                        <Modal
                            animationType='fade'
                            transparent={true}
                            visible={true}>
                            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,.2)' }}>
                                <ActivityIndicator size='large' color={GLOBALS.Color.primary} style={{ flex: 1 }} />
                            </View>
                        </Modal>
                        : null
                }
            </View >

        )
    }

}
export default class login extends Component {
    static navigationOptions = () => ({
        // title: Lang.t('Login.Title'),
        headerStyle: {
            backgroundColor: '#fff',
            borderBottomWidth: 0,
            elevation: 0
        },
        headerTitleStyle: {
            color: 'white',
        },
        headerBackTitleStyle: {
            color: '#0C449A'
        },
        headerTintColor: '#0C449A',
    });

    render() {
        return (
            <ScrollView style={{ backgroundColor: '#fff' }}>
                <KeyboardAvoidingView style={style.container} behavior="position" keyboardVerticalOffset={Platform.OS == 'ios' ? hp('15%') : hp('3%')} enabled>
                    <ScreenLogin {...this.props} />
                </KeyboardAvoidingView>
            </ScrollView>
        )
    }
}
/* style button */
var styleButton = (color, type) => StyleSheet.create({
    button: {
        justifyContent: 'center',
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: -1,
            height: 3,
        },
        shadowOpacity: 0.24,
        shadowRadius: 5.27,
        elevation: 30,
    }
})

const style = StyleSheet.create({
    container: {
        flex: 1,
        padding: hp('2%')
    },
    TextButton: {
        color: 'white',
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '400'
    },
    FormLogin: {
        width: GLOBALS.WIDTH,
        marginBottom: GLOBALS.HEIGHT / 20,
    }
})