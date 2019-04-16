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
    ActivityIndicator,
    StatusBar,
    Keyboard
} from 'react-native';
import GLOBALS from '../../helper/variables';
import { checkIOS, Register, } from '../../services/auth.service';
import { setData, rmData } from '../../services/data.service'
import Lang from '../../i18n/i18n'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../helper/Reponsive';
import Gradient from 'react-native-linear-gradient'
import FbAnalytics from '../../services/fcm.service'
import { InsertNewToken, } from '../../../realm/walletSchema';
import { StackActions, NavigationActions } from 'react-navigation'


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
        FbAnalytics.setUserProperty('action', 'create_wallet')
        FbAnalytics.logEvent('view_action', { 'create_wallet': 'create_wallet' })
        await this.setState({ loading: true });

        Register(this.state.password, 'nexty', 'Default wallet')
            .then(() => {
                Keyboard.dismiss()
                const Token = {
                    id: Math.floor(Date.now() / 1000) + 1,
                    walletId: Math.floor(Date.now() / 1000),
                    name: 'NTF',
                    addressToken: '0x2c783ad80ff980ec75468477e3dd9f86123ecbda',
                    balance: 0,
                    network: 'nexty',
                    avatar: '',
                    exchagerate: '0',
                    change: '0'

                }
                InsertNewToken(Token).then(() => {
                    this.setState({ loading: false });
                    // const { navigate } = this.props.navigation;
                    // navigate('Dashboard');
                    this.props.navigation.dispatch(StackActions.reset({
                        index: 0,
                        actions: [
                            NavigationActions.navigate({
                                routeName: 'Drawer',
                            })
                        ]
                    }))
                }).catch(e => this.setState({ loading: false }))

            }).catch(e => this.setState({ loading: false }))

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
            <View style={{ flex: 1 }}>
                <StatusBar
                    backgroundColor={'transparent'}
                    translucent
                    barStyle="dark-content"
                />
                <Text style={{ fontSize: hp('4%'), fontWeight: '400', color: '#444444', marginTop: hp('10%'), fontFamily: GLOBALS.font.Poppins }}>{Lang.t("Register.Title")}</Text>
                <Text style={{ fontSize: hp('2.5%'), fontWeight: '400', color: '#444444', marginTop: hp('4%'), fontFamily: GLOBALS.font.Poppins }} >
                    {Lang.t("Register.policy")}
                    <Text style={{ color: GLOBALS.Color.secondary, marginBottom: GLOBALS.HEIGHT / 20, fontFamily: GLOBALS.font.Poppins }} onPress={() => { this.props.navigation.navigate('Browser', { url: 'https://nexty.io/privacy-policy/' }) }}> Term of Service</Text>
                </Text>
                <View style={[style.styleTextInput, { marginTop: hp('20%') }]}>
                    <TextInput
                        placeholder={Lang.t("Register.PHWalletLocalPasscode")}
                        secureTextEntry={true}
                        onChangeText={(value) => { this.validatePass(value) }}
                        returnKeyType={"next"}
                        blurOnSubmit={false}
                        onSubmitEditing={() => { this.focusTheField('field2'); }}
                        style={style.TextInput}
                        underlineColorAndroid="transparent"
                    />
                </View>
                <Text style={{ color: GLOBALS.Color.danger }}>{this.state.TexterrorPw}</Text>
                <View style={style.styleTextInput}>
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
                        style={style.TextInput}
                        underlineColorAndroid="transparent"
                    />
                </View>
                <Text style={{ color: GLOBALS.Color.danger }}>{this.state.TexterrorCPw}</Text>
                <View style={style.FormRouter}>
                    <TouchableOpacity
                        onPress={this.register.bind(this)}
                        disabled={this.state.typeButton}
                    >
                        <Gradient
                            colors={this.state.typeButton ? ['#cccccc', '#cccccc'] : ['#328FFC', '#08AEEA']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styleButton(this.state.typeButton).button}
                        >
                            <Text style={style.TextButton}>{Lang.t("Register.TitleButton")}</Text>
                        </Gradient>
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('SelectNetwork', {
                            payload: {
                                type: 'restore'
                            }
                        })}
                        style={{ marginVertical: GLOBALS.hp('4%') }}
                    >
                        <Text style={{ fontFamily: GLOBALS.font.Poppins, textAlign: 'center' }}>Or <Text style={{ color: GLOBALS.Color.primary, fontWeight: 'bold' }}>import exist wallet</Text></Text>
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
    render() {
        return (
            <ScrollView style={{ backgroundColor: '#fff' }}>
                <KeyboardAvoidingView style={style.container} behavior="position" keyboardVerticalOffset={hp('0%')} enabled>
                    <ScreenRegister {...this.props}></ScreenRegister>
                </KeyboardAvoidingView>
            </ScrollView>
        );
    }
}



/* style button */
var styleButton = (type) => StyleSheet.create({
    button: {
        justifyContent: 'center',
        shadowOffset: {
            width: 3,
            height: 3,
        },
        shadowColor: '#000',
        shadowOpacity: type ? 0.2 : 0,
        borderRadius: 5,
        paddingHorizontal: GLOBALS.wp('20%'),
        paddingVertical: GLOBALS.hp('2%'),
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
        alignItems: 'center',
        paddingVertical: GLOBALS.hp('2%')
    },
    styleTextInput: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: '#E9E9E9',
        paddingVertical: Platform.OS === 'ios' ? GLOBALS.hp('1.5%') : 'auto',
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
    },
    TextInput: {
        flex: 8,
        fontSize: GLOBALS.fontsize(2.5),
        paddingLeft: GLOBALS.wp('5%')
    },
})