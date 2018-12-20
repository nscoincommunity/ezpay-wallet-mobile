import React, { Component } from 'react'
import {
    View,
    Platform,
    Text,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Alert,
    Keyboard,
    TextInput,
    ScrollView,
    FlatList,
    PixelRatio,
    Image,
    Linking,
    BackHandler
} from 'react-native';
import GLOBALS from './helper/variables';
import { Form, Item, Input, Label } from 'native-base'
import Icon from "react-native-vector-icons/FontAwesome";
import { exchangeRate } from './services/rate.service';
import { Utils } from './helper/utils'
import Dialog from "react-native-dialog";
import { SendService, SendToken } from "./services/wallet.service";
import { ScaleDialog } from "./services/loading.service";
import { getData } from './services/data.service';
import { Dropdown } from 'react-native-material-dropdown';
import Language from './i18n/i18n';
import PopupDialog, {
    ScaleAnimation, DialogTitle, DialogButton
} from "react-native-popup-dialog";
import Gradient from "react-native-linear-gradient"
import TouchID from "react-native-touch-id"
import CryptoJS from 'crypto-js';
import { cachePwd } from './services/auth.service'
import AlerModal from './components/Modal';
import { exitApp } from './services/exit/index'


const scaleAnimation = new ScaleAnimation();
const pt = PixelRatio.get()

export default class FormSend extends Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        title: Language.t('Send.Title'),
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
        headerLeft: <Text style={{ color: '#fff', paddingHorizontal: GLOBALS.wp('3%') }}
            onPress={() => {
                exitApp()
            }} >{Language.t('TouchID.Options.cancelText')}</Text>,
    });

    InitState = {
        addresswallet: '',
        TextErrorAddress: '',
        errorAddress: false,
        TextErrorNTY: '',
        errorNTY: false,
        VisibaleButton: true,
        NTY: '',
        USD: '',
        dialogSend: false,
        Password: '',
        titleDialog: '',
        contentDialog: '',
        ListToken: [],
        viewSymbol: 'NTY',
        tokenSelected: {},
        selected: 'NTY',
        extraData: '',
        editAddress: true,
        editNTY: true,
        editUSD: true,
        buttomReset: false,
        disabledButtomSend: false,
        showTouchID: false,
        deepLink: false,
    }

    resetState = {
        addresswallet: '',
        TextErrorAddress: '',
        errorAddress: false,
        TextErrorNTY: '',
        errorNTY: false,
        VisibaleButton: true,
        NTY: '',
        USD: '',
        dialogSend: false,
        extraData: '',
        editAddress: true,
        editNTY: true,
        editUSD: true,
        buttomReset: false,
        disabledButtomSend: false
    }

    constructor(props) {
        super(props)
        this.state = this.InitState;
        this.state
    };


    Send() {
        this.setState(this.InitState);
        this.doSend.bind(this)
    }

    async  doSend() {
        Keyboard.dismiss()
        if (this.state.walletaddress == '') {
            console.log('chay vao day')
            return;
        }
        if (this.state.viewSymbol == 'NTY') {
            SendService(this.state.addresswallet, parseFloat(this.state.NTY), this.state.Password, this.state.extraData)
                .then(data => {
                    this.setState(this.resetState)
                    console.log('send success: ' + data)
                    this.setState({ titleDialog: Language.t('Send.SendSuccess.Title'), contentDialog: data })
                    this.showScaleAnimationDialog('success', this.state.titleDialog, this.state.contentDialog);
                }).catch(async error => {
                    await this.setState({ dialogSend: false, })
                    console.log('send error: ' + error)
                    console.log(error.slice(0, 34))
                    if (error.slice(0, 34) == "Returned error: known transaction:") {
                        this.setState({ titleDialog: Language.t('Send.SendSuccess.Title'), contentDialog: "0x" + error.slice(35, error.length) })
                        return;
                    }
                    if (error == 'Returned error: insufficient funds for gas * price + value') {
                        await this.setState({ titleDialog: Language.t('Send.AlerError.Error'), contentDialog: Language.t('Send.AlerError.NotEnoughNTY') })
                    } else {
                        await this.setState({ titleDialog: Language.t('Send.AlerError.Error'), contentDialog: error })
                    }
                    await this.showScaleAnimationDialog('error', this.state.titleDialog, this.state.contentDialog);
                })
        } else {
            SendToken(this.state.addresswallet, this.state.tokenSelected.tokenAddress, this.state.tokenSelected.ABI, parseFloat(this.state.NTY), this.state.Password, this.state.extraData)
                .then(async data => {
                    await this.setState(this.resetState)
                    console.log('send success: ' + data)
                    await this.setState({ titleDialog: Language.t('Send.SendSuccess.Title'), contentDialog: data })
                    await this.showScaleAnimationDialog('success', this.state.titleDialog, this.state.contentDialog);
                }).catch(async error => {
                    await this.setState({ dialogSend: false, })
                    console.log('send error: ' + error)
                    console.log(error.slice(0, 34))
                    if (error.slice(0, 34) == "Returned error: known transaction:") {
                        this.setState({ titleDialog: Language.t('Send.SendSuccess.Title'), contentDialog: "0x" + error.slice(35, error.length) })
                        return;
                    }
                    if (error == 'Returned error: insufficient funds for gas * price + value') {
                        await this.setState({ titleDialog: Language.t('Send.AlerError.Error'), contentDialog: Language.t('Send.AlerError.NotEnoughToken') })
                    } else {
                        await this.setState({ titleDialog: Language.t('Send.AlerError.Error'), contentDialog: error })
                    }
                    await this.showScaleAnimationDialog('error', this.state.titleDialog, this.state.contentDialog);
                })
        }
    }

    handleCancel() {
        Keyboard.dismiss()
        this.setState({ dialogSend: false })
    }

    componentWillUnmount() {
        Linking.removeEventListener('url', this.handleOpenURL);
        BackHandler.removeEventListener("hardwareBackPress");

        console.log('unmount')
        // exitApp();
    }
    componentDidMount() {
        getData('TouchID').then((touch) => {
            if (touch != null) {
                this.setState({ showTouchID: true })
            } else {
                this.setState({ showTouchID: false })
            }
        }).catch(() => {
            this.setState({ showTouchID: false })
        })
        getData('ListToken')
            .then(data => {
                if (data != null) {
                    var tempArray = []
                    JSON.parse(data).forEach(element => {
                        tempArray.push({
                            value: JSON.stringify(element),
                            label: element.symbol
                        })
                    });
                }
                this.setState({ ListToken: tempArray })
            })
        if (this.props.navigation.state.params != undefined) {
            console.log('chay', this.props)
            this.handleOpenURL(this.props.navigation.state.params.url)
        }
        Linking.getInitialURL().then(url => {
            // console.log(url)
            this.handleOpenURL({ url })
        }).catch(err => {
            console.log(err)
        })
        Linking.addEventListener('url', this.handleOpenURL.bind(this));
        if (Platform.OS == 'android') {
            BackHandler.addEventListener("hardwareBackPress", () => {
                exitApp()
            });
        }
    }

    handleOpenURL(event) {
        if (!event['url'] || event['url'] == "" || event['url'] == null) {

        } else {
            console.log('linking: ', event.url)
            this.setState({ deepLink: true })
            var tempArr = []
            var CutStr = event.url.substr(event.url.lastIndexOf('://') + 3, (event.url.length) - 1);
            var splStr = CutStr.split('&');
            splStr.forEach(element => {
                tempArr.push(element.split("="))
            });
            var tempExtraData = '{"' + tempArr[0][0] + '":"' + tempArr[0][1] + '","' + tempArr[3][0] + '":"' + tempArr[3][1] + '"}';
            var hexExtraData = '';
            console.log('hexExtra: ' + tempExtraData)
            for (let i = 0; i < tempExtraData.length; i++) {
                hexExtraData += '' + tempExtraData.charCodeAt(i).toString(16);
            }
            if (tempArr[1][1] != '0' || tempArr[1][1] != null || tempArr[1][1] != '') {

                var val = parseFloat(tempArr[1][1])
                var usd = Utils.round(val * exchangeRate, 5);

                this.setState({
                    addresswallet: tempArr[2][1],
                    NTY: tempArr[1][1],
                    extraData: '0x' + hexExtraData,
                    USD: usd.toString(),
                    editAddress: false,
                    editNTY: false,
                    editUSD: false,
                    VisibaleButton: false,
                    buttomReset: true
                })
                console.log('hex extra data: ' + hexExtraData)
            } else {
                this.setState({
                    addresswallet: tempArr[2][1],
                    NTY: tempArr[1][1],
                    extraData: '0x' + hexExtraData,
                    editAddress: false,
                    editNTY: true,
                    editUSD: true,
                    buttomReset: true
                })
            }
        }
    }


    showScaleAnimationDialog = (typeModal, title, content) => {
        // this.scaleAnimationDialog.show();
        setTimeout(() => {
            if (typeModal == "success") {
                this.refs.PopupDialog.openModal(typeModal, title, content, true, this.state.deepLink)
            } else {
                this.refs.PopupDialog.openModal(typeModal, title, content, false, this.state.deepLink)
            }
        }, 350);
    }

    focusTheField = (id) => {
        this.inputs[id].focus();
    }
    inputs = {};

    selectToken(token) {
        if (token == 'NTY') {
            this.setState({ viewSymbol: token })
        } else {
            this.state.tokenSelected = JSON.parse(token)
            this.setState({ viewSymbol: this.state.tokenSelected.symbol })
        }
    }
    Selected(item) {
        this.setState({ selected: item.label })
        this.selectToken(item.value)
    }

    ButtonSend() {
        Keyboard.dismiss();
        if (this.state.VisibaleButton == true) {

            return;
        }
        getData('TouchID').then(data => {
            if (data != null) {
                let options = {
                    title: "Nexty wallet", // Android
                    sensorDescription: Language.t("TouchID.Options.sensorDescription"), // Android
                    sensorErrorDescription: Language.t("TouchID.Options.sensorErrorDescription"), // Android
                    cancelText: Language.t("TouchID.Options.cancelText"), // Android
                    fallbackLabel: "", // iOS (if empty, then label is hidden)
                };
                var reason = Language.t("TouchID.Options.reason");

                TouchID.authenticate(reason, options)
                    .then(success => {
                        try {
                            var passwordDecrypt = CryptoJS.AES.decrypt(data, cachePwd).toString(CryptoJS.enc.Utf8)
                            this.setState({ Password: passwordDecrypt }, () => {
                                this.doSend()
                            })
                        } catch (error) {
                            console.log(error)
                        }

                    })
            } else {
                this.setState({ dialogSend: true })
            }
        })
    }

    render() {
        return (
            <ScrollView style={{ backgroundColor: '#fafafa' }}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={'position'}
                    enabled
                    keyboardVerticalOffset={Platform.OS == 'ios' ? GLOBALS.hp('-1') : GLOBALS.hp('-5%')}
                >
                    <View style={Styles.container}>
                        {
                            this.state.ListToken.length > 0 &&
                            <FlatList
                                style={{ paddingVertical: GLOBALS.hp('1%') }}
                                horizontal={true}
                                data={this.state.ListToken}
                                renderItem={({ item, index }) => {
                                    return (
                                        <TouchableOpacity
                                            onPress={() => this.Selected(item)}
                                            style={
                                                selectedBtn(this.state.selected === item.label).selected
                                            }
                                        >
                                            <Text style={[selectedBtn(this.state.selected === item.label).text]}>{item.label}</Text>
                                        </TouchableOpacity>
                                    )
                                }}
                                keyExtractor={(item, index) => item.value}
                            />
                        }
                        <View style={[Styles.Form, { height: GLOBALS.hp('11%') }]}>
                            <View style={{ flexDirection: 'row' }}>
                                <TextInput
                                    value={this.state.addresswallet}
                                    editable={this.state.editAddress}
                                    style={Styles.InputToAddress}
                                    placeholder={Language.t('Send.SendForm.To')}
                                    onChangeText={(val) => this.CheckAddress(val)}
                                    returnKeyType={"next"}
                                    blurOnSubmit={false}
                                    onSubmitEditing={() => { this.focusTheField('field2'); }}
                                    underlineColorAndroid="transparent"
                                />
                            </View>
                            <Text style={{
                                color: GLOBALS.Color.danger,
                                height: this.state.TextErrorAddress != '' ? 'auto' : 0
                            }}>{this.state.TextErrorAddress}</Text>
                        </View>

                        <View style={[Styles.Form, { height: GLOBALS.hp('50%') },]}>
                            <View style={{ flexDirection: 'row', borderBottomWidth: 0.5 }}>
                                <TextInput
                                    editable={this.state.editNTY}
                                    placeholder={this.state.viewSymbol}
                                    keyboardType="numeric"
                                    value={this.state.NTY}
                                    style={Styles.InputBalance}
                                    onChangeText={(val) => this.CheckNTY(val)}
                                    ref={input => { this.inputs['field2'] = input }}
                                    underlineColorAndroid="transparent"
                                />
                            </View>
                            <View style={{ flexDirection: 'row', borderBottomWidth: 0.5 }}>
                                <TextInput
                                    editable={this.state.editUSD}
                                    placeholder="USD"
                                    keyboardType="numeric"
                                    value={this.state.USD}
                                    style={Styles.InputBalance}
                                    onChangeText={(val) => this.CheckUSD(val)}
                                    underlineColorAndroid="transparent"
                                />
                                <Image source={require('./images/icon/dollar.png')} />
                            </View>

                            <Text style={{ color: GLOBALS.Color.danger, height: this.state.TextErrorAddress != '' ? 'auto' : 0 }}>{this.state.TextErrorNTY}</Text>

                            <TouchableOpacity style={Styles.button} disabled={this.state.VisibaleButton} onPress={() => { this.setState({ dialogSend: true }); Keyboard.dismiss() }}>
                                <Gradient
                                    colors={this.state.VisibaleButton ? ['#cccccc', '#cccccc'] : ['#0C449A', '#082B5F']}
                                    style={{ paddingVertical: GLOBALS.hp('2%'), borderRadius: 5 }}
                                    start={{ x: 0.7, y: 0.0 }}
                                    end={{ x: 0.0, y: 0.0 }}
                                >
                                    <Text style={Styles.TextButton}>{Language.t('Send.SendForm.TitleButton')}</Text>
                                </Gradient>
                            </TouchableOpacity>
                            {
                                this.state.showTouchID && !this.state.VisibaleButton ?
                                    <TouchableOpacity
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                        onPress={() => this.ButtonSend()}
                                    >
                                        <View style={{ flex: 1.5, alignItems: 'flex-end' }}>
                                            <Image
                                                source={require('./images/icon/touch-icon.png')}
                                                resizeMode='contain'
                                            />
                                        </View>
                                        <Text
                                            style={{
                                                flex: 8.5,
                                                fontFamily: GLOBALS.font.Poppins,
                                                fontSize: PixelRatio.getFontScale() > 1 ? GLOBALS.hp('2%') : GLOBALS.hp('2.5%'),
                                                textAlign: 'center',
                                            }}>{Language.t('TouchID.Send')}</Text>
                                    </TouchableOpacity>
                                    : null
                            }

                        </View>
                        <View style={{ flex: 1 }} />
                    </View>

                    <Dialog.Container visible={this.state.dialogSend} >
                        <Dialog.Title>{Language.t('Send.ConfirmSend.Title')}</Dialog.Title>
                        <Dialog.Description>
                            {Language.t('Send.ConfirmSend.Content')}
                        </Dialog.Description>
                        <Dialog.Input placeholder={Language.t('Send.ConfirmSend.Placeholder')} onChangeText={(val) => this.setState({ Password: val })} secureTextEntry={true} autoFocus={true}></Dialog.Input>
                        <Dialog.Button label={Language.t('Send.ConfirmSend.TitleButtonCancel')} onPress={this.handleCancel.bind(this)} />
                        <Dialog.Button label={Language.t('Send.SendForm.TitleButton')} onPress={this.doSend.bind(this)} disabled={this.state.disabledButtomSend} />
                    </Dialog.Container>
                    <AlerModal ref="PopupDialog" />
                </KeyboardAvoidingView>
            </ScrollView >
        )
    }
}


const Styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: GLOBALS.hp('2%'),
        backgroundColor: '#fafafa',
        // flexDirection: 'column'
    },
    Form: {
        padding: GLOBALS.hp('2%'),
        borderRadius: 7,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.24,
        shadowRadius: 1.27,
        elevation: 2,
        backgroundColor: '#fff',
        marginVertical: GLOBALS.hp('0.5%'),
        justifyContent: 'space-around'
    },
    button: {
        borderRadius: 5,
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.24,
        shadowRadius: 1.27,
        elevation: 2,
    },
    TextButton: {
        color: 'white',
        textAlign: 'center',
        fontSize: 17,
        fontFamily: GLOBALS.font.Poppins
    },
    ColumItem: {
        width: GLOBALS.WIDTH / 2.4,
    },

    TextButton: {
        color: 'white',
        textAlign: 'center',
        fontSize: 17,
        fontFamily: GLOBALS.font.Poppins
    },
    dialogContentView: {
        justifyContent: 'center',
    },

    InputToAddress: {
        fontSize: 20,
        flex: 9,
        fontFamily: GLOBALS.font.Poppins,
        paddingBottom: Platform.OS == 'ios' ? 'auto' : 0
    },
    InputBalance: {
        fontSize: 20,
        width: GLOBALS.WIDTH / 1.2,
        flex: 8,
        fontFamily: GLOBALS.font.Poppins,
        paddingBottom: Platform.OS == 'ios' ? 'auto' : 0
    }
})

const selectedBtn = (type) => StyleSheet.create({
    selected: {
        backgroundColor: type ? '#EDA420' : '#fafafa',
        borderRadius: 20,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 15,
        paddingRight: 15,
        margin: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: type ? 0.34 : 0,
        shadowRadius: 2.27,
        elevation: type ? 5 : 0,
    },
    text: {
        fontWeight: type ? 'bold' : 'normal',
        color: type ? '#FFFFFF' : "#000",
        fontFamily: GLOBALS.font.Poppins
    }
})
