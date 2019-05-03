import React, { Component } from 'react'
import { Text, View, StatusBar, StyleSheet, Alert } from 'react-native'
import Gradient from 'react-native-linear-gradient';
import Header from '../../../components/header';
import GLOBAL from '../../../helper/variables'
import { utils } from 'ethers';
import BottomButton from '../../../components/buttonBottom';
import Dialog from "react-native-dialog";
import Language from '../../../i18n/i18n';
import { signMessageDapps } from '../../../services/wallet.service'

export default class DappSignMessage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dialogVisible: false,
            passcode: ''
        }
        this.handleGet = this.handleGet.bind(this)
    }


    onSignPersonalMessage = () => {
        // const { navigation } = this.props
        // MainStore.dapp.sign(params.id, params.object.data);
        this.setState({ dialogVisible: true })
    }

    handleCancel() {
        this.setState({ dialogVisible: false, passcode: '' })
    }

    handleGet() {
        const { params } = this.props.navigation.state;
        signMessageDapps(utils.toUtf8String(params.object.data), this.state.passcode, params.pk_en)
            .then(tx => {
                console.log(tx)
                this.setState({ dialogVisible: false, passcode: '' }, () => {
                    params.callBack(params.id, tx);
                    this.props.navigation.goBack()
                })
            }
            ).catch(e => {
                this.setState({ dialogVisible: false, passcode: '' }, () => {
                    setTimeout(() => {
                        Alert.alert(
                            'Error',
                            e,
                            [{ text: 'Ok', style: 'cancel' }]
                        )
                    }, 350)
                })
            })
    }

    render() {
        const { navigation } = this.props
        const { params } = navigation.state
        const info = utils.toUtf8String(params.object.data)
        return (
            <Gradient
                colors={['#F0F3F5', '#E8E8E8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ flex: 1 }}>
                <StatusBar
                    backgroundColor={'transparent'}
                    translucent
                    barStyle="dark-content"
                />
                <Header
                    backgroundColor="transparent"
                    colorIconLeft="#328FFC"
                    colorTitle="#328FFC"
                    nameIconLeft="arrow-left"
                    title='Sign Message'
                    style={{ marginTop: 23 }}
                    pressIconLeft={() => {
                        this.props.navigation.goBack()
                    }}
                />
                <View style={styles.container}>
                    <Text style={[styles.standardText, { marginTop: 15, alignSelf: 'center' }]}>
                        Only authorize signature from sources that
                    </Text>
                    <Text style={[styles.standardText, { alignSelf: 'center' }]}>
                        you trust.
                    </Text>
                    <View style={[styles.item, { marginTop: 30 }]}>
                        <Text style={styles.key}>
                            Requester
                        </Text>
                        <Text style={[styles.standardText, { marginTop: 10 }]}>
                            {params.url}
                        </Text>
                    </View>
                    <View style={styles.line} />
                    <View style={[styles.item, { marginTop: 20 }]}>
                        <Text style={styles.key}>
                            Message
                        </Text>
                        <Text style={[styles.standardText, { marginTop: 10 }]}>
                            {info}
                        </Text>
                    </View>
                    <BottomButton
                        text="Sign"
                        onPress={this.onSignPersonalMessage}
                    />
                </View>
                <Dialog.Container visible={this.state.dialogVisible} >
                    <Dialog.Title
                        style={{ fontFamily: GLOBAL.font.Poppins }}
                    >
                        {Language.t("NameWallet.AlertConfirm.title")}
                    </Dialog.Title>
                    <Dialog.Description style={{ fontFamily: GLOBAL.font.Poppins }}>
                        {Language.t("NameWallet.AlertConfirm.content")}
                    </Dialog.Description>
                    <Dialog.Input
                        placeholder={Language.t("NameWallet.AlertConfirm.content")}
                        onChangeText={(val) => this.setState({ passcode: val })}
                        secureTextEntry={true} value={this.state.passcode}
                        autoFocus={true}
                    />
                    <Dialog.Button
                        label={Language.t("NameWallet.AlertConfirm.cancel")}
                        onPress={this.handleCancel.bind(this)}
                    />
                    <Dialog.Button
                        label={Language.t("NameWallet.AlertConfirm.ok")}
                        onPress={this.handleGet}
                    />
                </Dialog.Container>
            </Gradient >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    standardText: {
        fontFamily: GLOBAL.font.Poppins,
        fontSize: 14,
        color: GLOBAL.Color.primary
    },
    item: {
        paddingLeft: 20,
        paddingRight: 20
    },
    line: {
        height: 1,
        backgroundColor: '#14192D',
        marginLeft: 20,
        marginRight: 20,
        marginTop: 15
    },
    key: {
        fontFamily: GLOBAL.font.Poppins,
        fontSize: 16,
        color: GLOBAL.Color.primary,
        marginTop: 15
    }
})