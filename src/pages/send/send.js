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
    TouchableHighlight,
    ScrollView,
    FlatList,
    PixelRatio,
    Image,
    Linking
} from 'react-native';
import GLOBALS from '../../helper/variables';
import { Form, Item, Input, Label } from 'native-base'
import Icon from "react-native-vector-icons/Ionicons";
import { exchangeRate } from '../../services/rate.service';
import { Utils } from '../../helper/utils'
import Dialog from "react-native-dialog";
import { SendService, SendToken } from "../../services/wallet.service";
import { ScaleDialog } from "../../services/loading.service";
import { getData } from '../../services/data.service';
import { Dropdown } from 'react-native-material-dropdown';
import Language from '../../i18n/i18n';
import PopupDialog, {
    ScaleAnimation, DialogTitle, DialogButton
} from "react-native-popup-dialog";
import Gradient from "react-native-linear-gradient"


const scaleAnimation = new ScaleAnimation();
const pt = PixelRatio.get()

export default class FormSend extends Component {
    static navigationOptions = {
        title: 'Send',
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
    };

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
        disabledButtomSend: false
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

    onSelect = data => {
        if (data['result'] == 'cancelScan') {
            return;
        }
        this.setState(this.resetState)
        /** try-catch check QR **/
        try {
            let typeQR = JSON.parse(data['result']);
            var hexExtraData = '';
            for (let i = 0; i < data['result'].length; i++) {
                hexExtraData += '' + data['result'].charCodeAt(i).toString(16);
            }
            /* have amount*/
            if (typeQR['amount'] != null || typeQR['amount'] != '') {
                var val = parseFloat(typeQR['amount'])
                var usd = Utils.round(val * exchangeRate, 5);
                this.setState({
                    addresswallet: typeQR['walletaddress'],
                    NTY: (typeQR['amount']).toString(),
                    extraData: '0x' + hexExtraData,
                    USD: usd.toString(),
                    editAddress: false,
                    editNTY: true,
                    editUSD: true,
                    VisibaleButton: false,
                    buttomReset: true
                })
            } else {
                /* handle not yet amount*/
                this.setState({
                    addresswallet: typeQR['walletaddress'],
                    NTY: typeQR['amount'],
                    extraData: '0x' + hexExtraData,
                    editAddress: false,
                    editNTY: true,
                    editUSD: true,
                    buttomReset: true
                })
            }
        } catch (error) {
            this.setState({ addresswallet: data['result'] });
        }
    };

    navigateToScan() {
        this.props.navigation.navigate('QRscan', { onSelect: this.onSelect });
    }


    async CheckAddress(value) {
        await this.setState({ TextErrorAddress: '' });
        if (value.length < 1) {
            await this.setState({ addresswallet: value, errorAddress: true, TextErrorAddress: Language.t('Send.ValidAddress'), VisibaleButton: true })
        } else {
            await this.setState({ addresswallet: value, errorAddress: false })
        }
        if (this.state.errorNTY == true || this.state.errorAddress == true || this.state.addresswallet == '' || this.state.NTY == '') {
        } else {
            await this.setState({ VisibaleButton: false });
        }
    }

    async CheckNTY(value) {
        var val = await parseFloat(value)
        await this.setState({ TextErrorNTY: '' });
        if (isNaN(val)) {
            await this.setState({ NTY: '', errorNTY: true, TextErrorNTY: Language.t('Send.ValidAmount'), VisibaleButton: true, USD: '' })
            return
        }

        if (val < 1 || value.length < 1) {
            await this.setState({ NTY: '', errorNTY: true, TextErrorNTY: Language.t('Send.ValidAmount'), VisibaleButton: true, USD: '' })
        } else {
            var usd = await Utils.round(val * exchangeRate, 5);
            await this.setState({ errorNTY: false, USD: usd.toString(), NTY: value });
        }
        if (this.state.errorNTY == true || this.state.errorAddress == true || this.state.addresswallet == '' || this.state.NTY == '') {
        } else {
            await this.setState({ VisibaleButton: false });
        }
    }
    async CheckUSD(value) {
        var val = await parseFloat(value)
        await this.setState({ TextErrorNTY: '' });
        if (isNaN(val)) {
            await this.setState({ errorNTY: true, TextErrorNTY: Language.t('Send.ValidAmount'), VisibaleButton: true, USD: '', NTY: '' })
            return
        }
        if (val < 1 || value.length < 1) {
            await this.setState({ USD: '', errorNTY: true, TextErrorNTY: Language.t('Send.ValidAmount'), VisibaleButton: true, NTY: '' })
        } else {
            var nty = await Utils.round(val / exchangeRate);
            await this.setState({ errorNTY: false, NTY: nty.toString(), USD: value })
        }
        if (this.state.errorNTY == true || this.state.errorAddress == true || this.state.addresswallet == '' || this.state.NTY == '') {
        } else {
            await this.setState({ VisibaleButton: false });
        }
    }

    Send() {
        this.setState(this.InitState);
        this.doSend.bind(this)
    }

    async  doSend() {
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
                    this.showScaleAnimationDialog();
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
                    await this.showScaleAnimationDialog();
                })
        } else {
            SendToken(this.state.addresswallet, this.state.tokenSelected.tokenAddress, this.state.tokenSelected.ABI, parseFloat(this.state.NTY), this.state.Password, this.state.extraData)
                .then(async data => {
                    await this.setState(this.resetState)
                    console.log('send success: ' + data)
                    await this.setState({ titleDialog: Language.t('Send.SendSuccess.Title'), contentDialog: data })
                    await this.showScaleAnimationDialog();
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
                    await this.showScaleAnimationDialog();
                })
        }
    }

    handleCancel() {
        this.setState({ dialogSend: false })
    }

    componentWillMount() {
        this.state.ListToken.push({ value: 'NTY', label: 'NTY' })
        getData('ListToken')
            .then(data => {
                if (data != null) {
                    JSON.parse(data).forEach(element => {
                        this.state.ListToken.push({
                            value: JSON.stringify(element),
                            label: element.symbol
                        })
                    });
                }
            })
    }

    componentDidMount() {
        Linking.getInitialURL().then(url => {
            console.log(url)
            this.handleOpenURL({ url })
        }).catch(err => {
            console.log(err)
        })
        Linking.addEventListener('url', this.handleOpenURL);
    }

    componentWillUnmount() {
        Linking.removeEventListener('url', this.handleOpenURL);
    }

    handleOpenURL(event) {
        if (!event['url'] || event['url'] == "" || event['url'] == null) {

        } else {
            console.log('linking: ', event.url)
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


    showScaleAnimationDialog = () => {
        this.scaleAnimationDialog.show();
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

    render() {
        return (
            <View style={style.container}>
                <ScrollView style={{ flex: 1, height: GLOBALS.HEIGHT }}>
                    <KeyboardAvoidingView style={{ flex: 1, padding: 5 }} behavior="position" keyboardVerticalOffset={65} enabled>

                        <FlatList
                            style={{
                                paddingTop: Platform.OS == 'ios' ? 15 : 10,
                                paddingBottom: Platform.OS == 'ios' ? 15 : 10,

                            }}
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
                        <View style={style.FormAddressTo}>
                            <View style={{
                                justifyContent: 'center',
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                            }}>
                                {/* **** Text input to address wallet **** */}
                                <TextInput
                                    value={this.state.addresswallet}
                                    editable={this.state.editAddress}
                                    style={style.InputToAddress}
                                    placeholder={Language.t('Send.SendForm.To')}
                                    onChangeText={(val) => this.CheckAddress(val)}
                                    returnKeyType={"next"}
                                    blurOnSubmit={false}
                                    onSubmitEditing={() => { this.focusTheField('field2'); }}
                                    underlineColorAndroid="transparent"
                                />
                                <TouchableOpacity
                                    onPress={() => this.navigateToScan()}
                                    style={{ justifyContent: 'center', flex: 2, alignItems: 'center' }}
                                >
                                    <Icon name="md-qr-scanner" size={40} />
                                </TouchableOpacity>
                            </View>
                            <Text style={{
                                color: GLOBALS.Color.danger,
                                height: this.state.TextErrorAddress != '' ? 'auto' : 0
                            }}>{this.state.TextErrorAddress}</Text>
                        </View>

                        <View style={style.FormBalance}>
                            <View style={style.FormInputBalance}>

                                {/* **** Text input NTY **** */}
                                <TextInput
                                    editable={this.state.editNTY}
                                    placeholder={this.state.viewSymbol}
                                    keyboardType="numeric"
                                    value={this.state.NTY}
                                    style={style.InputBalance}
                                    onChangeText={(val) => this.CheckNTY(val)}
                                    ref={input => { this.inputs['field2'] = input }}
                                    underlineColorAndroid="transparent"
                                />
                                {/* <Image source={require('../../images/icon/NTY.png')} /> */}
                            </View>

                            <View style={style.FormInputBalance}>

                                {/* **** Text input USD **** */}
                                <TextInput
                                    editable={this.state.editUSD}
                                    placeholder="USD"
                                    keyboardType="numeric"
                                    value={this.state.USD}
                                    style={style.InputBalance}
                                    onChangeText={(val) => this.CheckUSD(val)}
                                    underlineColorAndroid="transparent"
                                />
                                <Image source={require('../../images/icon/dollar.png')} />
                            </View>
                            <Text style={{ color: GLOBALS.Color.danger }}>{this.state.TextErrorNTY}</Text>

                            <TouchableOpacity style={styleButton(GLOBALS.Color.primary, this.state.VisibaleButton).button} disabled={this.state.VisibaleButton} onPress={() => { this.setState({ dialogSend: true }); Keyboard.dismiss() }}>
                                <Gradient
                                    colors={this.state.VisibaleButton ? ['#cccccc', '#cccccc'] : ['#0C449A', '#082B5F']}
                                    style={{ flex: 1, paddingBottom: 30 / pt, paddingTop: 30 / pt, borderRadius: 5 }}
                                    start={{ x: 0.7, y: 0.0 }}
                                    end={{ x: 0.0, y: 0.0 }}
                                >
                                    <Text style={style.TextButton}>{Language.t('Send.SendForm.TitleButton')}</Text>
                                </Gradient>
                            </TouchableOpacity>
                            {this.state.buttomReset &&
                                <TouchableOpacity style={{
                                    backgroundColor: '#fff',
                                    marginTop: pt * 5,
                                    marginBottom: pt * 5,
                                    borderRadius: 5,
                                    flexDirection: 'row-reverse',
                                    justifyContent: 'center',
                                    paddingBottom: 30 / pt,
                                    paddingTop: 30 / pt,
                                    borderWidth: 2,
                                    borderColor: GLOBALS.Color.primary,
                                }}
                                    onPress={() => this.setState(this.resetState)}>
                                    <Text style={{
                                        color: GLOBALS.Color.primary,
                                        textAlign: 'center',
                                        fontSize: 17,
                                        flex: 1,
                                        fontFamily: GLOBALS.font.Poppins
                                    }}>Reset</Text>
                                </TouchableOpacity>
                            }

                        </View>
                    </KeyboardAvoidingView>
                </ScrollView>

                <Dialog.Container visible={this.state.dialogSend} >
                    <Dialog.Title>{Language.t('Send.ConfirmSend.Title')}</Dialog.Title>
                    <Dialog.Description>
                        {Language.t('Send.ConfirmSend.Content')}
                    </Dialog.Description>
                    <Dialog.Input placeholder={Language.t('Send.ConfirmSend.Placeholder')} onChangeText={(val) => this.setState({ Password: val })} secureTextEntry={true} autoFocus={true}></Dialog.Input>
                    <Dialog.Button label={Language.t('Send.ConfirmSend.TitleButtonCancel')} onPress={this.handleCancel.bind(this)} />
                    <Dialog.Button label={Language.t('Send.SendForm.TitleButton')} onPress={this.doSend.bind(this)} disabled={this.state.disabledButtomSend} />
                </Dialog.Container>

                <PopupDialog
                    dialogStyle={{ width: GLOBALS.WIDTH / 1.2, height: GLOBALS.HEIGHT / 4 }}
                    ref={(popupDialog) => {
                        this.scaleAnimationDialog = popupDialog;
                    }}
                    dialogAnimation={scaleAnimation}
                    dialogTitle={<DialogTitle title={this.state.titleDialog} />}
                    actions={[
                        <DialogButton
                            text={Language.t('Send.Ok')}
                            onPress={() => {
                                this.scaleAnimationDialog.dismiss();
                            }}
                            key="button-1"
                        />,
                    ]}
                >
                    <View style={style.dialogContentView}>
                        <Text style={{ textAlign: 'center', marginTop: 10 }}>{this.state.contentDialog}</Text>
                    </View>
                </PopupDialog>
            </View >
        )
    }
}

/* style button */
var styleButton = (color, type) => StyleSheet.create({
    button: {
        backgroundColor: type == true ? '#cccccc' : "transparent",
        marginTop: pt * 5,
        marginBottom: pt * 5,
        borderRadius: 5,
        flexDirection: 'row-reverse',
        justifyContent: 'center',
        // paddingBottom: 32 / pt,
        // paddingTop: 32 / pt,
    }
})

const style = StyleSheet.create({
    container: {
        flex: 1,
        alignContent: 'center',
        padding: 10,
        backgroundColor: '#fafafa'
    },
    ColumItem: {
        width: GLOBALS.WIDTH / 2.4,
    },

    TextButton: {
        color: 'white',
        textAlign: 'center',
        fontSize: 17,
        flex: 1,
        fontFamily: GLOBALS.font.Poppins
    },
    dialogContentView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    FormAddressTo: {
        paddingTop: 35 / pt,
        paddingBottom: 35 / pt,
        paddingLeft: 28 / pt,
        paddingRight: 28 / pt,
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.14,
        shadowRadius: 2.27,
        elevation: 3,

    },
    InputToAddress: {
        fontSize: 20,
        flex: 8,
        fontFamily: GLOBALS.font.Poppins,
        marginTop: Platform.OS == "ios" ? 0 : 5,
    },

    FormBalance: {
        backgroundColor: '#fff',
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.14,
        shadowRadius: 2.27,
        elevation: 5,
        marginTop: 10,
        justifyContent: 'space-around',
        paddingTop: 50 / pt,
        paddingBottom: 50 / pt,
        paddingLeft: 38 / pt,
        paddingRight: 38 / pt,
    },
    InputBalance: {
        fontSize: 20,
        width: GLOBALS.WIDTH / 1.2,
        flex: 8,
        fontFamily: GLOBALS.font.Poppins,
    },
    FormInputBalance: {
        padding: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderBottomWidth: 1,
        borderBottomColor: '#aaaaaa',
        alignItems: 'center',
        marginBottom: 10,
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
