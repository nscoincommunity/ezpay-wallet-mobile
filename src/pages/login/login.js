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
    ActivityIndicator,
    Alert,
    PixelRatio
} from 'react-native';
import GLOBALS from '../../helper/variables';
import { StackNavigator } from 'react-navigation';
import { initAuth, Address, isAuth, Login, LoginTouchID, Login2 } from '../../services/auth.service';
import { getData, check_Registered, registered } from '../../services/data.service';
import { LoginWithFinger } from '../../services/auth.service'
import Lang from '../../i18n/i18n';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../helper/Reponsive';
import Gradient from 'react-native-linear-gradient'
import TouchID from 'react-native-touch-id'
import { lang } from 'moment';
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
    };

    static navigationOptions = {
        header: null,
    };


    componentDidMount() {
        // Login2('123456')
        //     .then(status => {
        //         this.setState({ loading: false })
        //         console.log(status)
        //         const { navigate } = this.props.navigation;
        //         navigate('Dashboard');
        //     }).catch(err => {
        //         console.log(err)
        //         this.setState({ TextError: Lang.t('Login.InvalidCredentials'), loading: false })
        //     })
        this.LoginwithFingerprint()
    }

    LoginNTY() {
        this.setState({ loading: true })
        Login2(this.state.Password)
            .then(status => {
                this.setState({ loading: false })
                console.log(status)
                const { navigate } = this.props.navigation;
                navigate('Dashboard');
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

    LoginwithFingerprint() {
        getData('TouchID').then(check => {
            if (check != null) {
                let options = {
                    title: "Nexty wallet", // Android
                    sensorDescription: Lang.t("TouchID.Options.sensorDescription"), // Android
                    sensorErrorDescription: Lang.t("TouchID.Options.sensorErrorDescription"), // Android
                    cancelText: Lang.t("TouchID.Options.cancelText"), // Android
                    fallbackLabel: "", // iOS (if empty, then label is hidden)
                }
                var reason = Lang.t("TouchID.Options.reason")
                TouchID.authenticate(reason, options).then(success => {
                    // registered(true)
                    LoginWithFinger(check);
                    const { navigate } = this.props.navigation;
                    navigate('Dashboard');
                })
            }
        })
    }

    render() {
        // alert(PixelRatio.getFontScale() + '-' + PixelRatio.get() + '-' + PixelRatio.getPixelSizeForLayoutSize() + '-' + PixelRatio.roundToNearestPixel())
        return (
            <View style={{ flex: 1 }} >
                <Text style={{ fontSize: hp('4%'), fontWeight: '400', color: '#444444', marginTop: hp('7%'), fontFamily: GLOBALS.font.Poppins }}>{Lang.t("Login.Title")}</Text>
                <Text style={{ color: GLOBALS.Color.danger }}>{this.state.TextErrorAddress}</Text>
                <View style={{
                    justifyContent: 'center',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    borderBottomWidth: 1,
                    borderBottomColor: '#AAAAAA',
                    paddingVertical: Platform.OS === 'ios' ? hp('1.5%') : 'auto',
                    marginTop: hp('25%')
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
                        style={{ flex: 9, fontSize: hp('2.5%') }}
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
                            visible={true} >
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
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.24,
        shadowRadius: type ? 2.27 : 0.22,
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
    }
})