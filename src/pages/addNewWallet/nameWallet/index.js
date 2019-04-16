import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    StatusBar,
    TextInput,
    TouchableOpacity,
    FlatList,
    ScrollView,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import Header from '../../../components/header';
import GLOBAL from '../../../helper/variables';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchAllWallet } from '../../../../redux/actions/slideWalletAction'
import Dialog from "react-native-dialog";
import { CreateNewWallet, importWallet } from '../insertWallet';
import { StackActions, NavigationActions } from 'react-navigation';
import Gradient from 'react-native-linear-gradient';
import { CheckExistNameWallet } from '../../../../realm/walletSchema';
import Language from '../../../i18n/i18n';

class NameWallet extends Component {
    constructor(props) {
        super(props)
        this.state = {
            InputName: '',
            dialogVisible: false,
            passcode: ''
        }
        this.handleGet = this.handleGet.bind(this)
    }

    handleCancel() {
        this.setState({ dialogVisible: false, passcode: '' })
    }

    async handleGet() {
        const payload = this.props.navigation.getParam('payload');
        if (payload.type == 'New') {
            CreateNewWallet(this.state.passcode, this.state.InputName, this.props.navigation.getParam('payload').network)
                .then(async (ss) => {
                    await this.props.fetchAllWallet();
                    await this.props.fetchAllWallet();
                    await this.props.navigation.dispatch(StackActions.reset({
                        index: 0,
                        actions: [
                            NavigationActions.navigate({
                                routeName: 'Drawer',
                            }),
                        ],
                    }))
                }
                )
                .catch(e => alert(e))
        } else {
            importWallet(
                payload.data.addressWL,
                payload.data.privateKey,
                this.state.passcode,
                this.state.InputName,
                payload.network
            ).then(async (ss) => {
                await this.props.fetchAllWallet();
                await this.props.fetchAllWallet();
                await this.props.navigation.dispatch(StackActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({
                            routeName: 'Drawer',
                        }),
                    ],
                }))
            })
        }

    }

    TouchButton() {
        if (this.state.InputName.length > 0) {
            this.setState({ dialogVisible: true })
        }
    }

    setName(val) {
        this.setState({ InputName: val })
    }

    render() {
        const payload = this.props.navigation.getParam('payload');
        return (
            <Gradient
                colors={['#F0F3F5', '#E8E8E8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.container}>
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
                    title={payload.type != 'changeNetwork' ? Language.t("NameWallet.Title1") : Language.t("NameWallet.Title2")}
                    style={{ marginTop: 23 }}
                    pressIconLeft={() => { this.props.navigation.goBack(); }}
                />
                <View style={{ flex: 1 }}>
                    {
                        payload.type != 'changeNetwork' ?
                            <FormInput setName={this.setName.bind(this)} />
                            :
                            <SelectWallet {...this.props} />
                    }
                    {payload.type != 'changeNetwork' &&
                        <View style={{ paddingHorizontal: GLOBAL.hp('10%'), marginVertical: GLOBAL.hp('4%') }}>
                            <TouchableOpacity
                                style={styles.buttonSubmit}
                                onPress={() => { this.TouchButton(payload) }}
                            >
                                <Gradient
                                    style={{ paddingVertical: 15, borderRadius: 5 }}
                                    colors={['#328FFC', '#08AEEA']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                >
                                    <Text style={{ color: '#fff', textAlign: 'center', fontFamily: GLOBAL.font.Poppins }}>{Language.t("NameWallet.titleButton")}</Text>
                                </Gradient>
                            </TouchableOpacity>
                        </View>
                    }
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

class SelectWallet extends Component {
    constructor(props) {
        super(props)
    }

    _navigate_Network(data) {
        this.props.navigation.navigate('SelectNetwork', {
            payload: {
                type: 'changeNetwork',
                data: data,
                old_network: data.network.name
            }
        })
    }

    render() {
        return (
            < View >
                {
                    this.props.data.length > 0 != undefined ?
                        <FlatList
                            style={{ padding: GLOBAL.hp('2%') }}
                            data={this.props.data}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => {
                                return (
                                    <TouchableOpacity
                                        style={styles.ButtonList}
                                        onPress={() => this._navigate_Network(item)}
                                    >
                                        <Text style={{
                                            color: '#535353',
                                            fontWeight: 'bold',
                                            fontSize: GLOBAL.fontsize(2),
                                            fontFamily: GLOBAL.font.Poppins
                                        }}>{item.name}</Text>
                                        <Text
                                            style={{
                                                color: '#979797',
                                                fontSize: GLOBAL.fontsize(1.5),
                                                fontFamily: GLOBAL.font.Poppins
                                            }}
                                        >{item.network.name}</Text>
                                    </TouchableOpacity>
                                )
                            }}
                        />
                        : null
                }
            </View >
        )
    }
}

class FormInput extends Component {
    constructor(props) {
        super(props)
        this.state = {
            err: false,
            textError: '',
        }
    }
    async Validate(val) {
        if (val.length >= 1) {
            CheckExistNameWallet(val).then(async exist => {
                console.log(exist)
                if (!exist) {
                    await this.setState({ err: false, textError: '' });
                    this.props.setName(val);
                } else {
                    await this.setState({ err: true, textError: Language.t("NameWallet.AlertConfirm.walletNameExist"), })
                }
            })
        } else {
            await this.setState({ err: true, textError: Language.t("NameWallet.AlertConfirm.walletNameError"), })
        }
    }

    render() {
        return (
            <View style={{ paddingHorizontal: GLOBAL.wp('5%') }}>
                <View style={formInput(this.state.err).input}>
                    <TextInput
                        onChangeText={(val) => this.Validate(val)}
                        style={{ color: '#535353', paddingVertical: 0 }}
                        placeholder={Language.t("NameWallet.Title1")}
                        placeholderTextColor="#979797"
                        underlineColorAndroid="transparent"
                    />
                </View>
                <Text style={{ color: 'red', fontFamily: GLOBAL.font.Poppins }}>{this.state.textError}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonSubmit: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2.27,
        elevation: 7,
    },
    ButtonList: {
        backgroundColor: '#F8F9F9',
        borderRadius: 6,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.24,
        shadowRadius: 2.27,
        elevation: 2,
        marginVertical: 10,
        padding: GLOBAL.wp('5%'),
        margin: Platform.OS == 'android' ? GLOBAL.wp('1%') : 'auto',
    }
})

const formInput = (type) => StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: type ? 'red' : '#328FFC',
        padding: GLOBAL.hp('2%'),
        borderRadius: 5,
        marginTop: GLOBAL.hp('10%')
    }
})

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ fetchAllWallet }, dispatch)
}

const mapStateToProps = (state) => {
    return state.ActionDB
}

export default connect(mapStateToProps, mapDispatchToProps)(NameWallet)