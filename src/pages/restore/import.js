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
    SegmentedControlIOS,
    Alert,
    FlatList,
    TextInput,
    Modal,
    ActivityIndicator,
} from 'react-native';
import SegmentControl from 'react-native-segment-controller';
import GLOBALS from '../../helper/variables';
import Icon from "react-native-vector-icons/FontAwesome";
import { restoreByBackup, restoreByPk } from './restore.service';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import { setData, rmData, getData } from '../../services/data.service'
import Lang from '../../i18n/i18n';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../helper/Reponsive';
import Gradient from 'react-native-linear-gradient'
import Header from '../../components/header'


class SwitchTypeImport extends Component {
    constructor() {
        super();

        this.state = {
            index: 0,
            content: '',
            loading: false,
        }
        this.handlePress = this.handlePress.bind(this);
    }

    handlePress(index) {
        this.setState({ content: `Segment ${index + 1} selected !!!`, index });
    }

    showLoading(type: boolean) {
        this.setState({ loading: type })
    }
    selectItem(item) {
        this.setState({ index: item.value })
    }

    render() {
        return (
            <View style={{ flex: 1, flexWrap: 'wrap', flexDirection: 'column' }}>
                <View style={{ paddingHorizontal: GLOBALS.wp('15%'), flex: 1 }}>
                    <SegmentControl
                        values={[Lang.t('Restore.BackUpCode'), Lang.t('Restore.Privatekey')]}
                        selectedIndex={this.state.index}
                        onTabPress={this.handlePress}
                        borderRadius={5}
                        activeTabStyle={{ backgroundColor: '#ACAEBF' }}
                        tabStyle={{ borderColor: '#ACAEBF', paddingVertical: GLOBALS.hp('1.5%') }}
                        activeTabTextStyle={{ fontWeight: 'bold' }}
                        tabTextStyle={{ color: '#393B51' }}
                    />
                </View>
                <View style={{ flex: 3.5 }} />
                {this.state.index === 0 && <FormBackupcode navigation={this.props.navigation} showLoading={this.showLoading.bind(this)} />}
                {this.state.index === 1 && <FormPrivateKey navigation={this.props.navigation} showLoading={this.showLoading.bind(this)} />}

                {
                    this.state.loading ?
                        <Modal
                            onRequestClose={() => null}
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

class FormBackupcode extends Component {
    InitState = {
        backupCode: '',
        password: '',
        confirmPwd: '',
        txtErrBUcode: '',
        txtErrPwd: '',
        txtCfPwd: '',
        errBUcode: false,
        errPwd: false,
        errCfPwd: false,
        typeButton: true
    }
    constructor(props) {
        super(props)
        this.state = this.InitState
    };

    async validateBackUpCode(value) {
        this.setState({ txtErrBUcode: '' })
        if (value.length < 1) {
            await this.setState({ backupCode: '', errBUcode: true, txtErrBUcode: Lang.t('Restore.InvalidRestoreCode'), typeButton: true });
        } else {
            await this.setState({ backupCode: value, errBUcode: false, txtErrBUcode: '', typeButton: false })
        }
    }
    restoreByBackupCode() {
        this.props.showLoading(true);
        const { network, type } = this.props.navigation.getParam('payload')
        restoreByBackup(this.state.backupCode, network)
            .then(data => {
                this.props.showLoading(false);
                this.props.navigation.navigate('NameWallet', {
                    payload: {
                        type: type,
                        network: network,
                        data: data
                    }
                })
            }).catch(err => {
                console.log('catch: ', err)
                this.props.showLoading(false);
                setTimeout(() => {
                    Alert.alert(
                        Lang.t("Restore.Error"),
                        err,
                        [{ text: Lang.t("Restore.Ok"), onPress: () => { this.setState(this.InitState) } }]
                    )
                }, 350);

            })
    }

    SelectFile() {
        // iPhone/Android
        DocumentPicker.show({
            filetype: [DocumentPickerUtil.allFiles()],
        }, (error, res) => {
            if (res != null) {
                // Android
                console.log(
                    res.uri,
                    '\n- ' + res.type, // mime type
                    '\n- ' + res.fileName,
                    '\n- ' + res.fileSize
                );

                if ((res.fileName).substring((res.fileName).lastIndexOf('.') + 1, (res.fileName).length) == 'txt') {
                    RNFS.readFile(res.uri).then(data => {
                        console.log(data)
                        this.setState({ backupCode: data, errBUcode: false, txtErrBUcode: '', typeButton: false })
                    }).catch(err => {
                        console.log(err)
                    })
                } else {
                    Alert.alert(
                        Lang.t("Restore.Warning"),
                        Lang.t("Restore.ContentWarning"),
                        [{ text: Lang.t("Restore.Ok"), onPress: () => { }, style: 'cancel' }]
                    )
                }

            }
        });

    }
    focusTheField = (id) => {
        this.inputs[id].focus();
    }
    inputs = {};

    render() {
        return (
            <View style={{ flex: 5, paddingTop: Platform.OS == "ios" ? GLOBALS.hp('10%') : GLOBALS.hp('15%') }}>
                <View style={style.styleTextInput}>
                    <TextInput
                        placeholder={Lang.t('Restore.BackUpCode') + '/' + Lang.t('Restore.ChooserFile')}
                        onChangeText={(val) => this.validateBackUpCode(val)}
                        value={this.state.backupCode}
                        returnKeyType={"next"}
                        blurOnSubmit={false}
                        onSubmitEditing={() => { this.focusTheField('field2'); }}
                        style={style.TextInput}
                        underlineColorAndroid="transparent"
                        numberOfLines={1}
                    />
                    <TouchableOpacity style={style.buttonFolder} onPress={() => this.SelectFile()}>
                        <Image source={require('../../images/iconRestore/icon_folder.png')} />
                    </TouchableOpacity>
                </View>
                <Text style={{ color: GLOBALS.Color.danger }}>{this.state.txtErrBUcode}</Text>
                <View style={{ alignItems: 'center', paddingVertical: GLOBALS.hp('2%') }}>
                    <TouchableOpacity onPress={() => this.restoreByBackupCode()} disabled={this.state.typeButton}>
                        <Gradient
                            colors={this.state.typeButton ? ['#cccccc', '#cccccc'] : ['#328FFC', '#08AEEA']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styleButton(this.state.typeButton).button}
                        >
                            <Text style={style.TextButton}>{Lang.t('Restore.TitleButton')}</Text>
                        </Gradient>
                    </TouchableOpacity>
                </View>
            </View >
        )
    }
}
class FormPrivateKey extends Component {
    InitState = {
        privateKey: '',
        password: '',
        confirmPwd: '',
        txtErrPKcode: '',
        txtErrPwd: '',
        txtCfPwd: '',
        errPKcode: false,
        errPwd: false,
        errCfPwd: false,
        typeButton: true
    }
    constructor(props) {

        super(props)

        this.state = this.InitState
    };

    async validatePKCode(value) {
        this.setState({ txtErrPKcode: '' })
        if (value.length == 0) {
            await this.setState({ privateKey: '', errPKcode: true, txtErrPKcode: Lang.t("Restore.InvalidPK"), typeButton: true });
            return;
        }
        if (value.length != 64) {
            await this.setState({ privateKey: value, errPKcode: true, txtErrPKcode: Lang.t("Restore.InvalidPK"), typeButton: true });
        } else {
            await this.setState({ privateKey: value, errPKcode: false, txtErrPKcode: '', typeButton: false })
        }
    }

    restoreByPK() {
        this.props.showLoading(true);
        const { network, type } = this.props.navigation.getParam('payload');
        restoreByPk(this.state.privateKey, this.state.password, network)
            .then(data => {
                this.props.showLoading(false);
                this.props.navigation.navigate('NameWallet', {
                    payload: {
                        type: type,
                        network: network,
                        data: data
                    }
                })
            }).catch(err => {
                this.props.showLoading(false);
                console.log('cache', err)
                setTimeout(() => {
                    Alert.alert(
                        Lang.t("Restore.Error"),
                        err,
                        [{ text: Lang.t("Restore.Ok"), onPress: () => { this.setState(this.InitState) } }]
                    )
                }, 350);
            })
    }

    focusTheField = (id) => {
        this.inputs[id].focus();
    }
    inputs = {};

    render() {
        return (
            <View style={{ flex: 5, paddingTop: Platform.OS == "ios" ? GLOBALS.hp('10%') : GLOBALS.hp('15%') }}>
                <View style={style.styleTextInput}>
                    <TextInput
                        placeholder={Lang.t("Restore.Privatekey")}
                        value={this.state.privateKey}
                        onChangeText={(val) => this.validatePKCode(val)}
                        returnKeyType={"next"}
                        blurOnSubmit={false}
                        onSubmitEditing={() => { this.focusTheField('field2'); }}
                        style={style.TextInput}
                        underlineColorAndroid="transparent"
                    />
                </View>
                <Text style={{ color: GLOBALS.Color.danger }}>{this.state.txtErrPKcode}</Text>
                <View style={{ alignItems: 'center', paddingVertical: GLOBALS.hp('2%') }}>
                    <TouchableOpacity onPress={() => this.restoreByPK()} disabled={this.state.typeButton}>
                        <Gradient
                            colors={this.state.typeButton ? ['#cccccc', '#cccccc'] : ['#328FFC', '#08AEEA']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styleButton(this.state.typeButton).button}
                        >
                            <Text style={style.TextButton}>{Lang.t('Restore.TitleButton')}</Text>
                        </Gradient>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

export default class ImportWL extends Component {
    static navigationOptions = () => ({
        // title: Lang.t('Login.Title'),
        headerStyle: {
            backgroundColor: '#fff',
            borderBottomWidth: 0,
            elevation: 0
        },
        headerTitleStyle: {
            color: 'white',
        },
        headerBackTitleStyle: {
            color: '#0C449A'
        },
        headerTintColor: '#0C449A',
    });

    render() {
        return (
            <Gradient
                style={{ flex: 1 }}
                colors={['#F0F3F5', '#E8E8E8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <Header
                    backgroundColor="transparent"
                    colorIconLeft="#328FFC"
                    colorTitle="#328FFC"
                    nameIconLeft="arrow-left"
                    title="Import Wallet"
                    style={{ marginTop: 23 }}
                    pressIconLeft={() => this.props.navigation.goBack()}
                />

                <ScrollView contentContainerStyle={{ flex: 1 }}>
                    <KeyboardAvoidingView
                        style={style.container}
                        keyboardVerticalOffset={Platform.OS == 'ios' ? hp('10%') : hp('-10%')}
                        behavior="position"
                        contentContainerStyle={{ flex: 1 }}
                        enabled>
                        <SwitchTypeImport {...this.props} />
                    </KeyboardAvoidingView>
                </ScrollView>
            </Gradient>
        )
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
    styleTextInput: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: '#E9E9E9',
        paddingVertical: Platform.OS === 'ios' ? hp('1.5%') : 'auto',
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
    container: {
        flex: 1,
        padding: hp('2%')
    },
    TextButton: {
        color: 'white',
        textAlign: 'center',
        fontSize: GLOBALS.fontsize(2)
    },
    buttonFolder: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 2,
    }
})