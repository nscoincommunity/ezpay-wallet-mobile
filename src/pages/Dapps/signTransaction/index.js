import React, { Component } from 'react'
import { Text, View, StatusBar, StyleSheet, TouchableOpacity } from 'react-native'
import Gradient from 'react-native-linear-gradient';
import Header from '../../../components/header';
import GLOBAL from '../../../helper/variables';
import BottomButton from '../../../components/buttonBottom';
import Dialog from "react-native-dialog";
import Language from '../../../i18n/i18n';
import { Utils } from '../../../helper/utils';
import { getExchangeRateETH } from '../../../services/rate.service';
import { signTransaction } from '../Dapp.service'

export default class ConfirmSignTransaction extends Component {
    constructor(props) {
        super(props)
        this.state = {
            usd: 0,
            dialogVisible: false,
            passcode: ''
        }
        this.handleGet = this.handleGet.bind(this);
    }

    componentWillMount() {
        getExchangeRateETH().then(rate => {
            const { ViewObject } = this.props.navigation.state.params;
            this.setState({ usd: Utils.round(ViewObject.value * rate, 5) })

        })
    }


    onSignPersonalMessage = () => {
        this.setState({ dialogVisible: true })
    }

    handleCancel() {
        this.setState({ dialogVisible: false, passcode: '' })
    }

    handleGet() {
        const { params } = this.props.navigation.state;
        signTransaction(
            this.state.passcode,
            params.pk_en,
            params.object.from,
            params.object.to,
            params.object.data,
            params.ViewObject.value)
            .then((tx) => {
                this.setState({ dialogVisible: false, passcode: '' }, () => {
                    console.log(tx)
                    params.callBack(params.id, tx);
                    this.props.navigation.goBack()
                })
            }).catch(e => console.log(e))
    }


    render() {
        const { id, object, url, ViewObject } = this.props.navigation.state.params;
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
                    title='Sign Transaction'
                    style={{ marginTop: 23 }}
                    pressIconLeft={() => {
                        this.props.navigation.goBack()
                    }}
                />
                <View style={styles.container}>
                    <View style={[styles.item, { marginTop: 10 }]}>
                        <Text style={styles.key}>
                            From
                        </Text>
                        <Text style={[styles.standardText, { marginTop: 10 }]} numberOfLines={1} ellipsizeMode="middle">
                            {object.from}
                        </Text>
                    </View>
                    <View style={styles.line} />
                    <View style={[styles.item, { marginTop: 10 }]}>
                        <Text style={styles.key}>
                            To
                        </Text>
                        <Text style={[styles.standardText, { marginTop: 10 }]} numberOfLines={1} ellipsizeMode="middle">
                            {object.to}
                        </Text>
                    </View>
                    <View style={styles.line} />
                    <View style={[styles.item, { marginTop: 10 }]}>
                        <Text style={styles.key}>
                            Amount
                        </Text>
                        <Text style={[styles.standardText, { marginTop: 10 }]}>
                            {ViewObject.value}
                        </Text>
                    </View>
                    <View style={styles.line} />
                    <View style={[styles.item, { marginTop: 10 }]}>
                        <Text style={styles.key}>
                            USD
                        </Text>
                        <Text style={[styles.standardText, { marginTop: 10 }]}>
                            {this.state.usd}
                        </Text>
                    </View>
                    <View style={styles.line} />
                    <View style={[styles.item, { marginTop: 10 }]}>
                        <Text style={styles.key}>
                            Dapp
                        </Text>
                        <Text style={[styles.standardText, { marginTop: 10 }]}>
                            {url}
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
            </Gradient>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        padding: GLOBAL.hp('2%'),
    },
    formAddressTo: {
        flex: 1,
        borderRadius: 7,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.24,
        shadowRadius: 1.27,
        backgroundColor: '#fff',
        elevation: 2,
        marginVertical: GLOBAL.hp('1.5%'),
        justifyContent: 'center',
        padding: GLOBAL.hp('2%')
    },
    formValue: {
        flex: 8,
        borderRadius: 7,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.24,
        shadowRadius: 1.27,
        backgroundColor: '#fff',
        elevation: 2,
        justifyContent: 'space-around',
        padding: GLOBAL.hp('2%')
    },
    styleText: {
        fontSize: 20,
        fontFamily: GLOBAL.font.Poppins,
        color: '#6d6d6d'
    },
    styleButton: {

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
        marginTop: 15,
        fontWeight: '400',
    }
})



