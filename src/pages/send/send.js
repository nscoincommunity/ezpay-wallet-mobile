import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Alert, Keyboard, TextInput } from 'react-native';
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


import PopupDialog, {
    ScaleAnimation, DialogTitle, DialogButton
} from "react-native-popup-dialog"

const scaleAnimation = new ScaleAnimation();

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
        tokenSelected: {}
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
        this.setState({ addresswallet: data['result'] });
    };

    navigateToScan() {
        this.props.navigation.navigate('QRscan', { onSelect: this.onSelect });
    }


    async CheckAddress(value) {
        await this.setState({ TextErrorAddress: '' });
        if (value.length < 1) {
            await this.setState({ addresswallet: value, errorAddress: true, TextErrorAddress: 'Invalid address', VisibaleButton: true })
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
            await this.setState({ NTY: '', errorNTY: true, TextErrorNTY: 'Please enter a valid amount', VisibaleButton: true, USD: '' })
            return
        }

        if (val < 1 || value.length < 1) {
            await this.setState({ NTY: '', errorNTY: true, TextErrorNTY: 'Please enter a valid amount', VisibaleButton: true, USD: '' })
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
            await this.setState({ errorNTY: true, TextErrorNTY: 'Please enter a valid amount', VisibaleButton: true, USD: '', NTY: '' })
            return
        }
        if (val < 1 || value.length < 1) {
            await this.setState({ USD: '', errorNTY: true, TextErrorNTY: 'Please enter a valid amount', VisibaleButton: true, NTY: '' })
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
        if (this.state.viewSymbol == 'NTY') {
            SendService(this.state.addresswallet, parseFloat(this.state.NTY), this.state.Password)
                .then(async data => {
                    await this.setState(this.resetState)
                    console.log('send success: ' + data)
                    await this.setState({ titleDialog: 'Send successfully', contentDialog: data })
                    await this.showScaleAnimationDialog();
                    // Alert.alert(
                    //     'Send successfully',
                    //     data,
                    //     [
                    //         { text: 'OK', onPress: () => { }, style: 'cancel' }
                    //     ]
                    // )
                }).catch(async error => {
                    await this.setState({ VisibaleButton: true, dialogSend: false, VisibaleButton: false })
                    console.log('send error: ' + error)
                    if (error == 'Returned error: insufficient funds for gas * price + value') {
                        await this.setState({ titleDialog: 'Error', contentDialog: "You do not have enough NTY for this transaction" })
                    } else {
                        await this.setState({ titleDialog: 'Error', contentDialog: error })
                    }
                    await this.showScaleAnimationDialog();
                    console.log(error)

                    // Alert.alert(
                    //     'Error',
                    //     error,
                    //     [
                    //         { text: 'OK', onPress: () => { }, style: 'cancel' }
                    //     ]
                    // )
                })
        } else {
            SendToken(this.state.addresswallet, this.state.tokenSelected.tokenAddress, this.state.tokenSelected.ABI, parseFloat(this.state.NTY), this.state.Password)
                .then(async data => {
                    await this.setState(this.resetState)
                    console.log('send success: ' + data)
                    await this.setState({ titleDialog: 'Send successfully', contentDialog: data })
                    await this.showScaleAnimationDialog();
                    // Alert.alert(
                    //     'Send successfully',
                    //     data,
                    //     [
                    //         { text: 'OK', onPress: () => { }, style: 'cancel' }
                    //     ]
                    // )
                }).catch(async error => {
                    await this.setState(this.resetState)
                    console.log('send error: ' + error)
                    await this.setState({ titleDialog: 'Error', contentDialog: error })
                    await this.showScaleAnimationDialog();
                    console.log(error)

                    // Alert.alert(
                    //     'Error',
                    //     error,
                    //     [
                    //         { text: 'OK', onPress: () => { }, style: 'cancel' }
                    //     ]
                    // )
                })
        }
    }

    handleCancel() {
        this.setState({ dialogSend: false })
    }

    componentDidMount() {
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
        // setTimeout(() => {
        //     this.setState({ dialogSend: true });
        //     setTimeout(() => {
        //         Keyboard.dismiss()
        //         this.setState({ dialogSend: false })
        // setTimeout(() => {
        //     this.showScaleAnimationDialog()
        // }, 1000);
        //     }, 3000)
        // }, 1000);
    }

    showScaleAnimationDialog = () => {
        this.scaleAnimationDialog.show();
    }

    focusTheField = (id) => {
        this.inputs[id]._root.focus();
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

    render() {
        return (
            <View style={style.container}>

                <ScrollView style={{ flex: 1 }}>
                    <KeyboardAvoidingView style={style.container} behavior="position" keyboardVerticalOffset={65} enabled>

                        <View style={{ width: GLOBALS.WIDTH, paddingLeft: GLOBALS.WIDTH / 25, paddingRight: GLOBALS.WIDTH / 25 }}>

                            {
                                this.state.ListToken &&
                                <Dropdown
                                    onChangeText={(item) => this.selectToken(item)}
                                    label='Select Token'
                                    data={this.state.ListToken}
                                    value={'NTY'}
                                />
                            }
                        </View>

                        <Form style={style.FormSend}>
                            <View style={{
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                width: GLOBALS.WIDTH,
                            }}>
                                <Item floatingLabel style={{ width: GLOBALS.WIDTH / 1.4 }} error={this.state.errorAddress}>
                                    <Label>To</Label>
                                    <Input
                                        value={this.state.addresswallet}
                                        onChangeText={(val) => this.CheckAddress(val)}
                                        returnKeyType={"next"}
                                        blurOnSubmit={false}
                                        onSubmitEditing={() => { this.focusTheField('field2'); }}
                                    />
                                </Item>


                                <Item style={{ borderBottomWidth: 0 }}>
                                    <TouchableOpacity style={style.buttonScan} onPress={this.navigateToScan.bind(this)}>
                                        <Icon name="md-qr-scanner" size={30} color="#fff">
                                        </Icon>
                                    </TouchableOpacity>
                                </Item>
                                <Item style={{ borderBottomWidth: 0 }}>
                                    <Text style={{ color: GLOBALS.Color.danger }}>{this.state.TextErrorAddress}</Text>
                                </Item>
                            </View>
                            <View style={{
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                width: GLOBALS.WIDTH,
                            }}>
                                <Item floatingLabel style={style.ColumItem} error={this.state.errorNTY}>
                                    <Label>{this.state.viewSymbol}</Label>
                                    <Input
                                        keyboardType="numeric"
                                        onChangeText={(val) => this.CheckNTY(val)}
                                        value={this.state.NTY}
                                        getRef={input => { this.inputs['field2'] = input }}
                                    />
                                </Item>
                                <Icon name="md-swap" size={20} style={{ marginTop: 40 }}></Icon>
                                <Item floatingLabel style={style.ColumItem} error={this.state.errorNTY}>
                                    <Label>USD</Label>
                                    <Input
                                        keyboardType="numeric"
                                        onChangeText={(val) => this.CheckUSD(val)}
                                        value={this.state.USD} />
                                </Item>
                                <Item style={{ borderBottomWidth: 0 }}>
                                    <Text style={{ color: GLOBALS.Color.danger }}>{this.state.TextErrorNTY}</Text>
                                </Item>
                            </View>
                            <TouchableOpacity style={styleButton(GLOBALS.Color.secondary, this.state.VisibaleButton).button} disabled={this.state.VisibaleButton} onPress={() => this.setState({ dialogSend: true })}>
                                <Text style={style.TextButton}>SEND</Text>
                            </TouchableOpacity>
                        </Form>

                        <Dialog.Container visible={this.state.dialogSend} >
                            <Dialog.Title>Confirm send</Dialog.Title>
                            <Dialog.Description>
                                Enter your local passcode to process
                        </Dialog.Description>
                            <Dialog.Input placeholder="Wallet Local passcode" onChangeText={(val) => this.setState({ Password: val })} secureTextEntry={true} autoFocus={true}></Dialog.Input>
                            <Dialog.Button label="Cancel" onPress={this.handleCancel.bind(this)} />
                            <Dialog.Button label="Send" onPress={this.doSend.bind(this)} />
                        </Dialog.Container>
                    </KeyboardAvoidingView>
                </ScrollView>

                <PopupDialog
                    dialogStyle={{ width: GLOBALS.WIDTH / 1.2, height: GLOBALS.HEIGHT / 4 }}
                    ref={(popupDialog) => {
                        this.scaleAnimationDialog = popupDialog;
                    }}
                    dialogAnimation={scaleAnimation}
                    dialogTitle={<DialogTitle title={this.state.titleDialog} />}
                    actions={[
                        <DialogButton
                            text="OK"
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
        backgroundColor: type == true ? '#cccccc' : color,
        marginBottom: GLOBALS.HEIGHT / 40,
        height: GLOBALS.HEIGHT / 17,
        justifyContent: 'center',
        width: GLOBALS.WIDTH / 1.6,
        marginTop: GLOBALS.HEIGHT / 30,
    }
})

const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    FormSend: {
        width: GLOBALS.WIDTH,
        alignItems: 'center',
    },
    buttonScan: {
        flexDirection: 'column',
        width: GLOBALS.WIDTH / 6,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: GLOBALS.Color.primary,
        borderRadius: 2,
        paddingTop: 8,
        paddingBottom: 8,
    },
    ColumItem: {
        width: GLOBALS.WIDTH / 2.4,
    },
    FormLogin: {
        width: GLOBALS.WIDTH,
        marginBottom: GLOBALS.HEIGHT / 20,
    },
    button: {
        backgroundColor: GLOBALS.Color.secondary,
        marginBottom: GLOBALS.HEIGHT / 40,
        height: GLOBALS.HEIGHT / 17,
        justifyContent: 'center',
        width: GLOBALS.WIDTH / 1.6,
        shadowOffset: { width: 3, height: 3, },
        shadowColor: 'black',
        shadowOpacity: 0.2,
    },
    TextButton: {
        color: 'white',
        textAlign: 'center',
        fontSize: 15
    },
    dialogContentView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
})
