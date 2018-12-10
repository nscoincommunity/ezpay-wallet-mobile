import React, { Component } from 'react';
import {
    Text,
    View,
    ScrollView,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    StyleSheet,
    Platform
} from 'react-native';
import Language from '../../i18n/i18n';
import Gradient from 'react-native-linear-gradient';
import GLOBAL from '../../helper/variables';
import { changePasscode } from '../../services/auth.service'
import DiaLog from "../../components/Modal"

export default class ChangePIN extends Component {
    initState = {
        passcodeOld: '',
        errPcOld: false,
        textErrPcOld: '',
        passcodeNew: '',
        errPcNew: false,
        textErrPcNew: '',
        passcodeNewConfirm: '',
        errPcNewConfirm: false,
        textErrPcnewConfirm: '',
        typeButton: true,
    }
    constructor(props) {
        super(props)
        this.state = this.initState
    }
    static navigationOptions = () => ({
        // title: Language.t('Settings.ChangePIN'),
        headerStyle: {
            backgroundColor: '#fff',
            borderBottomWidth: 0,
            elevation: 0
        },
        headerTitleStyle: {
            color: '#0C449A',
        },
        headerBackTitleStyle: {
            color: '#0C449A'
        },
        headerTintColor: '#0C449A',
    });
    focusTheField = (id) => {
        this.inputs[id].focus();
    }
    inputs = {};

    async validateOldPass(value) {
        this.setState({ passcodeOld: value })
        if (value.length > 5) {
            await this.setState({ textErrPcOld: '', errPcOld: false, typeButton: false });
        } else {
            await this.setState({ textErrPcOld: Language.t("ChangePIN.ValidOldPasscode"), errPcOld: true, typeButton: true })
        }
        if (this.state.passcodeNew == '' || this.state.passcodeNewConfirm == '' || this.state.errPcNew == true || this.state.errPcNewConfirm == true || this.state.errPcOld == true) {
            await this.setState({ typeButton: true })
        } else {
            await this.setState({ typeButton: false })
        }
    }

    async validateNewPass(value) {
        this.setState({ passcodeNew: value })
        if (value.length > 5) {
            await this.setState({ textErrPcNew: '', errPcNew: false, typeButton: false });
        } else {
            await this.setState({ textErrPcNew: Language.t("Restore.ErrorLocalPasscode"), errPcNew: true, typeButton: true })
        }

        if (this.state.passcodeNewConfirm == '' || this.state.passcodeNewConfirm == value) {
            await this.setState({ textErrPcnewConfirm: '', errPcNewConfirm: false });
        } else {
            await this.setState({ textErrPcnewConfirm: Language.t("Restore.ErrorNotMatch"), errPcNewConfirm: true })
        }
        if (this.state.passcodeNew == '' || this.state.passcodeNewConfirm == '' || this.state.errPcNewConfirm == true || this.state.errPcNew == true || this.state.errPcOld == true) {
            await this.setState({ typeButton: true })
        } else {
            await this.setState({ typeButton: false })
        }
    }

    async validateConfirmPass(value) {
        this.setState({ passcodeNewConfirm: value })
        if (this.state.passcodeNew && this.state.passcodeNew == value) {
            await this.setState({ textErrPcnewConfirm: '', errPcNewConfirm: false, typeButton: false });
        } else {
            await this.setState({ textErrPcnewConfirm: Language.t("Restore.ErrorNotMatch"), errPcNewConfirm: true, typeButton: true })
        }

        if (this.state.errPcNew == true || this.state.errPcOld == true || this.state.errPcNewConfirm == true) {
            await this.setState({ typeButton: true })
        } else {
            await this.setState({ typeButton: false })
        }
    }

    changePasscode() {
        changePasscode(this.state.passcodeOld, this.state.passcodeNew)
            .then((result) => {
                console.log(result)
                this.refs.ShowDialog.openModal('success', Language.t('AddToken.AlerSuccess.Title'), Language.t('ChangePIN.Success'));
                this.setState(this.initState)
            }).catch(err => {
                console.log(err)
                this.setState({ textErrPcOld: Language.t('ChangePIN.OldPasscodeCredentials'), errPcOld: true, typeButton: true })
            })
    }

    render() {
        return (
            <ScrollView style={{ backgroundColor: '#fff' }} contentContainerStyle={{ flexGrow: 1 }}>
                <KeyboardAvoidingView style={{ flex: 1, padding: GLOBAL.hp('2%'), paddingVertical: GLOBAL.hp('5%') }} behavior="position" enabled contentContainerStyle={{ flexGrow: 1 }} >
                    <View style={Styles.container} >

                        <Text style={{
                            fontSize: GLOBAL.hp('4%'),
                            fontWeight: '400',
                            color: '#444444',
                            fontFamily: GLOBAL.font.Poppins
                        }}>{Language.t('ChangePIN.Title')}</Text>
                        <View style={{
                            justifyContent: 'center',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            borderBottomWidth: 1,
                            borderBottomColor: '#AAAAAA',
                            paddingVertical: Platform.OS === 'ios' ? GLOBAL.hp('1.5%') : 'auto',
                            marginTop: GLOBAL.hp('20%')
                        }}>
                            <TextInput
                                placeholder={Language.t("ChangePIN.PlaceholderOld")}
                                secureTextEntry={true}
                                onChangeText={(value) => { this.validateOldPass(value) }}
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                onSubmitEditing={() => { this.focusTheField('field2'); }}
                                style={{ flex: 10, fontSize: GLOBAL.hp('3%') }}
                                underlineColorAndroid="transparent"
                                value={this.state.passcodeOld}
                            />
                        </View>
                        <Text style={{ color: GLOBAL.Color.danger }}>{this.state.textErrPcOld}</Text>
                        <View style={{
                            justifyContent: 'center',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            borderBottomWidth: 1,
                            borderBottomColor: '#AAAAAA',
                            paddingVertical: Platform.OS === 'ios' ? GLOBAL.hp('1.5%') : 'auto',
                        }}>
                            <TextInput
                                placeholder={Language.t("ChangePIN.PlaceholderNewPasscode")}
                                secureTextEntry={true}
                                onChangeText={(value) => { this.validateNewPass(value) }}
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                ref={input => { this.inputs['field2'] = input }}
                                onSubmitEditing={() => { this.focusTheField('field3'); }}
                                style={{ flex: 10, fontSize: GLOBAL.hp('3%') }}
                                underlineColorAndroid="transparent"
                                value={this.state.passcodeNew}
                            />
                        </View>
                        <Text style={{ color: GLOBAL.Color.danger }}>{this.state.textErrPcNew}</Text>
                        <View style={{
                            justifyContent: 'center',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            borderBottomWidth: 1,
                            borderBottomColor: '#AAAAAA',
                            paddingVertical: Platform.OS === 'ios' ? GLOBAL.hp('1.5%') : 'auto',
                        }}>
                            <TextInput
                                placeholder={Language.t("ChangePIN.PlaceholderConfirmNew")}
                                secureTextEntry={true}
                                onChangeText={(value) => { this.validateConfirmPass(value) }}
                                ref={input => { this.inputs['field3'] = input }}
                                returnKeyType={'done'}
                                onSubmitEditing={() => {
                                    if (this.state.typeButton == false) {
                                        this.changePasscode()
                                    }
                                }}
                                style={{ flex: 10, fontSize: GLOBAL.hp('3%') }}
                                underlineColorAndroid="transparent"
                                value={this.state.passcodeNewConfirm}
                            />
                        </View>
                        <Text style={{ color: GLOBAL.Color.danger }}>{this.state.textErrPcnewConfirm}</Text>
                        <TouchableOpacity onPress={() => { this.changePasscode() }} style={Styles.button} disabled={this.state.typeButton}>
                            <Gradient
                                colors={this.state.typeButton ? ['#cccccc', '#cccccc'] : ['#0C449A', '#082B5F']}
                                start={{ x: 1, y: 0.7 }}
                                end={{ x: 0, y: 3 }}
                                style={{ paddingVertical: GLOBAL.hp('2%'), borderRadius: 5 }}
                            >
                                <Text style={Styles.TextButton}>{Language.t("Restore.TitleButton")}</Text>
                            </Gradient>
                        </TouchableOpacity>
                        <DiaLog ref="ShowDialog" />
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
        )
    }
}
const Styles = StyleSheet.create({
    container: {
        flex: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: -1,
            height: 3,
        },
        shadowOpacity: 0.24,
        shadowRadius: 2.27,
        elevation: 2,
        borderRadius: 5,
        backgroundColor: '#fff',
        padding: GLOBAL.hp('2%'),
        paddingVertical: GLOBAL.hp('5%')
    },
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
        marginVertical: GLOBAL.hp('2%'),
    },
    TextButton: {
        color: 'white',
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '400'
    },
})