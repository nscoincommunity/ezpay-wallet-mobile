import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Alert } from 'react-native';
import GLOBALS from '../../helper/variables';
import { Form, Item, Input, Label } from 'native-base'
import Icon from "react-native-vector-icons/Ionicons";
import { exchangeRate } from '../../services/rate.service';
import { Utils } from '../../helper/utils'
import Dialog from "react-native-dialog";
import { SendService } from "../../services/wallet.service";
import { ScaleDialog } from "../../services/loading.service"

import PopupDialog, {
    ScaleAnimation, DialogTitle, DialogButton
} from "react-native-popup-dialog"

const scaleAnimation = new ScaleAnimation();

class FormSend extends Component {
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
        contentDialog: ''
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
            await this.setState({ errorAddress: true, TextErrorAddress: 'Invalid address', VisibaleButton: true })
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
            await this.setState({ errorNTY: true, TextErrorNTY: 'Please enter a valid amount', VisibaleButton: true, USD: '' })
            return
        }

        if (val < 1 || value.length < 1) {
            await this.setState({ errorNTY: true, TextErrorNTY: 'Please enter a valid amount', VisibaleButton: true, USD: '' })
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
            await this.setState({ errorNTY: true, TextErrorNTY: 'Please enter a valid amount', VisibaleButton: true, USD: '' })
            return
        }
        if (val < 1 || value.length < 1) {
            await this.setState({ errorNTY: true, TextErrorNTY: 'Please enter a valid amount', VisibaleButton: true, NTY: '' })
        } else {
            var nty = await Utils.round(val / exchangeRate);
            await this.setState({ errorNTY: false, NTY: nty.toString() })
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

    handleCancel() {
        this.setState({ dialogSend: false })
    }

    // componentDidMount() {
    //     setTimeout(() => {
    //         this.showScaleAnimationDialog()
    //     }, 1000);
    // }

    showScaleAnimationDialog = () => {
        this.scaleAnimationDialog.show();
    }

    render() {
        return (
            <View style={style.container}>
                <Form style={style.FormSend}>
                    <View style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        width: GLOBALS.WIDTH,
                    }}>
                        <Item floatingLabel style={{ width: GLOBALS.WIDTH / 1.4 }} error={this.state.errorAddress}>
                            <Label>To</Label>
                            <Input value={this.state.addresswallet} onChangeText={(val) => this.CheckAddress(val)} />
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
                            <Label>NTY</Label>
                            <Input keyboardType="numeric" onChangeText={(val) => this.CheckNTY(val)} value={this.state.NTY} />
                        </Item>
                        <Icon name="md-swap" size={20} style={{ marginTop: 40 }}></Icon>
                        <Item floatingLabel style={style.ColumItem} error={this.state.errorNTY}>
                            <Label>USD</Label>
                            <Input keyboardType="numeric" onChangeText={(val) => this.CheckUSD(val)} value={this.state.USD} />
                        </Item>
                        <Item style={{ borderBottomWidth: 0 }}>
                            <Text style={{ color: GLOBALS.Color.danger }}>{this.state.TextErrorNTY}</Text>
                        </Item>
                    </View>

                </Form>
                <View style={style.FormRouter}>
                    <TouchableOpacity style={styleButton(GLOBALS.Color.secondary, this.state.VisibaleButton).button} disabled={this.state.VisibaleButton} onPress={() => this.setState({ dialogSend: true })}>
                        <Text style={style.TextButton}>SEND</Text>
                    </TouchableOpacity>
                </View>

                <Dialog.Container visible={this.state.dialogSend}>
                    <Dialog.Title>Confirm send</Dialog.Title>
                    <Dialog.Description>
                        Enter your local passcode to process
                        </Dialog.Description>
                    <Dialog.Input placeholder="Wallet Local passcode" onChangeText={(val) => this.setState({ Password: val })} secureTextEntry={true} autoFocus={true}></Dialog.Input>
                    <Dialog.Button label="Cancel" onPress={this.handleCancel.bind(this)} />
                    <Dialog.Button label="Send" onPress={this.doSend.bind(this)} />
                </Dialog.Container>

                <PopupDialog
                    // dialogStyle={{ width: 300, height: 200 }}
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
                        <Text>{this.state.contentDialog}</Text>
                    </View>
                </PopupDialog>
            </View>
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



export default class send extends Component {
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
    render() {
        return (
            <ScrollView >
                <KeyboardAvoidingView style={style.container} behavior="position" keyboardVerticalOffset={65} enabled>
                    <FormSend navigation={this.props.navigation} ></FormSend>
                </KeyboardAvoidingView>

            </ScrollView>
        )
    }
}


const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    FormSend: {
        width: GLOBALS.WIDTH,
        marginBottom: GLOBALS.HEIGHT / 20,
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
