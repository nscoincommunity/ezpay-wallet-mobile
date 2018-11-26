import React, { Component } from 'react';
import {
    StyleSheet,
    Platform,
    Text,
    View,
    Image,
    TouchableOpacity,
    KeyboardAvoidingView,
    ScrollView,
    Linking,
    Modal,
    TextInput,
    ActivityIndicator
} from 'react-native';
import GLOBALS from '../../helper/variables';
import { checkIOS, Register, Address } from '../../services/auth.service';
import { setData, rmData } from '../../services/data.service'
import Lang from '../../i18n/i18n'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../helper/Reponsive';
import Gradient from 'react-native-linear-gradient'
import FbAnalytics from '../../services/fcm.service'

class ScreenRegister extends Component {
    constructor(props) {
        super(props)
        this.state = {
            password: '',
            confirmpassword: '',
            loading: false,
            submit: false,
            TexterrorPw: '',
            TexterrorCPw: '',
            errorPw: false,
            errorCPw: false,
            typeButton: true,
            // visibaleMd: false
        };
    };


    async register() {
        FbAnalytics.setUserProperty('action', 'create wallet')
        FbAnalytics.logEvent('view_action', { 'action_name': 'register' })
        this.setState({ loading: true })
        Register(this.state.password).then(() => {
            rmData('ListToken').then(() => {
                var initialData = [{
                    "tokenAddress": '',
                    "balance": '0',
                    "symbol": 'NTY',
                    "decimals": '',
                    "ABI": ''
                }]
                setData('ListToken', JSON.stringify(initialData)).then(() => {
                    this.setState({ loading: false })
                    const { navigate } = this.props.data.navigation;
                    navigate('TabNavigator');
                    setData('isBackup', '0');
                })
            })

        })
    }

    async validatePass(value) {
        this.setState({ password: value })
        if (value.length > 5) {
            await this.setState({ TexterrorPw: '', errorPw: false, typeButton: false });
        } else {
            await this.setState({ TexterrorPw: Lang.t("Register.ErrorLocalPasscode"), errorPw: true, typeButton: true })
        }

        if (this.state.confirmpassword == '' || this.state.confirmpassword == value) {
            await this.setState({ TexterrorCPw: '', errorCPw: false });
        } else {
            await this.setState({ TexterrorCPw: Lang.t("Register.ErrorNotMatch"), errorCPw: true })
        }
        if (this.state.password == '' || this.state.confirmpassword == '' || this.state.errorCPw == true || this.state.errorPw == true) {
            await this.setState({ typeButton: true })
        } else {
            await this.setState({ typeButton: false })
        }

    }
    validateConfirmPass(value) {
        this.setState({ confirmpassword: value })
        if (this.state.password && this.state.password == value) {
            this.setState({ TexterrorCPw: '', errorCPw: false, typeButton: false });
        } else {
            this.setState({ TexterrorCPw: Lang.t("Register.ErrorNotMatch"), errorCPw: true, typeButton: true })
        }
        if (this.state.errorPw == true) {
            this.setState({ typeButton: true })
        }
    }

    focusTheField = (id) => {
        this.inputs[id].focus();
    }
    inputs = {};
    render() {
        return (
            <View style={style.container}>

                <Text style={{ fontSize: hp('4%'), fontWeight: '400', color: '#444444', marginTop: hp('10%'), fontFamily: GLOBALS.font.Poppins }}>Create Wallet</Text>
                <Text style={{ fontSize: hp('2.5%'), fontWeight: '400', color: '#444444', marginTop: hp('4%'), fontFamily: GLOBALS.font.Poppins }} >
                    {Lang.t("Register.policy")}
                    <Text style={{ color: GLOBALS.Color.secondary, marginBottom: GLOBALS.HEIGHT / 20, fontFamily: GLOBALS.font.Poppins }} onPress={() => { Linking.openURL('https://nexty.io/privacy-policy/') }}> Term of Service</Text>
                </Text>
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
                        placeholder={Lang.t("Register.PHWalletLocalPasscode")}
                        secureTextEntry={true}
                        onChangeText={(value) => { this.validatePass(value) }}
                        returnKeyType={"next"}
                        blurOnSubmit={false}
                        onSubmitEditing={() => { this.focusTheField('field2'); }}
                        style={{ flex: 10, fontSize: hp('3%') }}
                        underlineColorAndroid="transparent"
                    />
                </View>
                <Text style={{ color: GLOBALS.Color.danger }}>{this.state.TexterrorPw}</Text>
                <View style={{
                    justifyContent: 'center',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    borderBottomWidth: 1,
                    borderBottomColor: '#AAAAAA',
                    paddingVertical: Platform.OS === 'ios' ? hp('1.5%') : 'auto',
                }}>
                    <TextInput
                        placeholder={Lang.t("Register.PHConfirmLocalPasscode")}
                        secureTextEntry={true}
                        onChangeText={(value) => { this.validateConfirmPass(value) }}
                        ref={input => { this.inputs['field2'] = input }}
                        returnKeyType={'done'}
                        onSubmitEditing={() => {
                            if (this.state.typeButton == false) {
                                this.register()
                            }
                        }}
                        style={{ flex: 10, fontSize: hp('3%') }}
                        underlineColorAndroid="transparent"
                    />
                </View>
                <Text style={{ color: GLOBALS.Color.danger }}>{this.state.TexterrorCPw}</Text>
                <View style={style.FormRouter}>
                    <TouchableOpacity style={styleButton(GLOBALS.Color.secondary, this.state.typeButton).button} onPress={this.register.bind(this)} disabled={this.state.typeButton}>
                        <Gradient
                            colors={this.state.typeButton ? ['#cccccc', '#cccccc'] : ['#0C449A', '#082B5F']}
                            start={{ x: 1, y: 0.7 }}
                            end={{ x: 0, y: 3 }}
                            style={{ paddingVertical: hp('2%'), borderRadius: 5 }}
                        >
                            <Text style={style.TextButton}>{Lang.t("Register.TitleButton")}</Text>
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
                                <ActivityIndicator size='large' color="#30C7D3" style={{ flex: 1 }} />
                            </View>
                        </Modal>
                        : null
                }
            </View>

        )
    }

}
export default class register extends Component {
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
                <KeyboardAvoidingView style={style.container} behavior="position" keyboardVerticalOffset={hp('14%')} enabled>
                    <ScreenRegister data={this.props}></ScreenRegister>
                </KeyboardAvoidingView>
            </ScrollView>
        );
    }
}



var styleButton = (color, type) => StyleSheet.create({
    button: {
        justifyContent: 'center',
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.64,
        shadowRadius: 2.27,
        elevation: 7,
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
    },
    FormRouter: {
        marginTop: hp('5%'),
    }
})