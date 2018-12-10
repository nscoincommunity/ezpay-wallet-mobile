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
    ActivityIndicator
} from 'react-native';
import { Form, Item, Input, Label, Spinner } from 'native-base'
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

class ScreenRestore extends Component {
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
        const SwitchSeg = [{ type: Lang.t('Restore.BackUpCode'), value: 0 }, { type: Lang.t('Restore.Privatekey'), value: 1 }]
        return (
            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: hp('4%'), fontWeight: '400', color: '#444444', marginTop: hp('10%'), fontFamily: GLOBALS.font.Poppins }}>{Lang.t('Restore.Title')}</Text>

                <FlatList
                    style={{ marginTop: hp('2%'), width: GLOBALS.wp('100%') - GLOBALS.hp('4%') }}
                    data={SwitchSeg}
                    horizontal={true}
                    scrollEnabled={false}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity
                                onPress={() => this.selectItem(item)}
                                style={
                                    selectedBtn(this.state.index === item.value).selected
                                }
                            >
                                <Text style={[selectedBtn(this.state.index === item.value).text]}>{item.type}</Text>
                            </TouchableOpacity>
                        )
                    }}
                    keyExtractor={(item) => item.type}
                    extraData={this.state}
                />

                {this.state.index === 0 && <FormBackupcode navigator={this.props.navigator} showLoading={this.showLoading.bind(this)} />}
                {this.state.index === 1 && <FormPrivateKey navigator={this.props.navigator} showLoading={this.showLoading.bind(this)} />}

                {
                    this.state.loading ?
                        <Modal
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

const selectedBtn = (type) => StyleSheet.create({
    selected: {
        backgroundColor: type ? GLOBALS.Color.secondary : '#fff',
        borderRadius: 20,
        padding: wp('3%'),
        margin: hp('0.5%'),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: type ? 0.34 : 0,
        shadowRadius: 2.27,
        elevation: type ? 5 : 0,
        alignItems: 'center',
        width: GLOBALS.wp('50%') - GLOBALS.hp('3%')
    },
    text: {
        fontWeight: type ? 'bold' : 'normal',
        color: type ? '#FFFFFF' : "#000",
        fontFamily: GLOBALS.font.Poppins,
        textAlign: 'center'
    }
})

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

    async validateBuCode(value) {
        this.setState({ txtErrBUcode: '' })
        if (value.length < 1) {
            await this.setState({ backupCode: '', errBUcode: true, txtErrBUcode: Lang.t('Restore.InvalidRestoreCode'), typeButton: true });
        } else {
            await this.setState({ backupCode: value, errBUcode: false, txtErrBUcode: '', typeButton: false })
        }

        if (this.state.password == '' || this.state.confirmPwd == '' || this.state.errCfPwd == true || this.state.errPwd == true || this.state.errBUcode == true) {
            await this.setState({ typeButton: true })
        } else {
            await this.setState({ typeButton: false })
        }
    }

    async validatePwd(value) {
        this.setState({ password: value })
        if (value.length > 5) {
            await this.setState({ txtErrPwd: '', errPwd: false, typeButton: false });
        } else {
            await this.setState({ txtErrPwd: Lang.t("Restore.ErrorLocalPasscode"), errPwd: true, typeButton: true })
        }

        if (this.state.confirmPwd == '' || this.state.confirmPwd == value) {
            await this.setState({ txtCfPwd: '', errCfPwd: false });
        } else {
            await this.setState({ txtCfPwd: Lang.t("Restore.ErrorNotMatch"), errCfPwd: true })
        }
        if (this.state.password == '' || this.state.confirmPwd == '' || this.state.errCfPwd == true || this.state.errPwd == true || this.state.errBUcode == true) {
            await this.setState({ typeButton: true })
        } else {
            await this.setState({ typeButton: false })
        }

    }

    async validateCfPwd(value) {
        this.setState({ confirmPwd: value })
        if (this.state.password && this.state.password == value) {
            await this.setState({ txtCfPwd: '', errCfPwd: false, typeButton: false });
        } else {
            await this.setState({ txtCfPwd: Lang.t("Restore.ErrorNotMatch"), errCfPwd: true, typeButton: true })
        }

        if (this.state.errPwd == true || this.state.errBUcode == true || this.state.errCfPwd == true) {
            await this.setState({ typeButton: true })
        } else {
            await this.setState({ typeButton: false })
        }
    }
    restoreByBackupCode() {
        this.props.showLoading(true);
        restoreByBackup(this.state.backupCode, this.state.password)
            .then(rCode => {
                this.props.showLoading(false);
                if (rCode == 0) {
                    rmData('ListToken').then(() => {
                        var initialData = [{
                            "tokenAddress": '',
                            "balance": '0',
                            "symbol": 'NTY',
                            "decimals": '',
                            "ABI": ''
                        }]
                        setData('ListToken', JSON.stringify(initialData)).then(() => {
                            setData('isBackup', '0');
                            const { navigate } = this.props.navigator;
                            navigate('TabNavigator');
                        })
                    })
                } else {
                    Alert.alert(
                        Lang.t("Restore.Error"),
                        Lang.t("Restore.InvalidRestoreCode"),
                        [{ text: Lang.t("Restore.Ok"), onPress: () => this.setState(this.InitState) }]
                    )
                }
            }).catch(err => {
                this.props.showLoading(false);
                Alert.alert(
                    Lang.t("Restore.Error"),
                    Lang.t("Restore.InvalidRestoreCode"),
                    [{ text: Lang.t("Restore.Ok"), onPress: () => { this.setState(this.InitState) } }]
                )
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

                if ((res.fileName).substring((res.fileName).lastIndexOf('.') + 1, (res.fileName).length) == 'txt' && (res.fileName).indexOf('nexty') > -1) {
                    RNFS.readFile(res.uri).then(data => {
                        console.log(data)
                        this.setState({ backupCode: data })
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
            <View style={{ marginTop: hp('12%') }}>
                <View style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    borderBottomWidth: 1,
                    borderBottomColor: '#AAAAAA',
                    paddingVertical: Platform.OS === 'ios' ? hp('1.5%') : 'auto',
                }}>
                    <TextInput
                        placeholder={Lang.t('Restore.BackUpCode') + '/' + Lang.t('Restore.ChooserFile')}
                        onChangeText={(val) => this.validateBuCode(val)}
                        value={this.state.backupCode}
                        returnKeyType={"next"}
                        blurOnSubmit={false}
                        onSubmitEditing={() => { this.focusTheField('field2'); }}
                        style={{ flex: 8, fontSize: hp('2.5%') }}
                        underlineColorAndroid="transparent"
                    />
                    <TouchableOpacity style={style.buttonFolder} onPress={() => this.SelectFile()}>
                        <Icon name="folder-open" color={GLOBALS.Color.secondary} size={35} />
                    </TouchableOpacity>
                </View>
                <Text style={{ color: GLOBALS.Color.danger }}>{this.state.txtErrBUcode}</Text>
                <View style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    borderBottomWidth: 1,
                    borderBottomColor: '#AAAAAA',
                    paddingVertical: Platform.OS === 'ios' ? hp('1.5%') : 'auto',
                }}>
                    <TextInput
                        placeholder={Lang.t('Restore.LocalPasscode')}
                        value={this.state.password}
                        secureTextEntry={true}
                        onChangeText={(val) => this.validatePwd(val)}
                        ref={input => { this.inputs['field2'] = input }}
                        returnKeyType={'next'}
                        blurOnSubmit={false}
                        onSubmitEditing={() => { this.focusTheField('field3'); }}
                        style={{ flex: 10, fontSize: hp('2.5%') }}
                        underlineColorAndroid="transparent"
                    />
                </View>

                <Text style={{ color: GLOBALS.Color.danger }}>{this.state.txtErrPwd}</Text>
                <View style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    borderBottomWidth: 1,
                    borderBottomColor: '#AAAAAA',
                    paddingVertical: Platform.OS === 'ios' ? hp('1.5%') : 'auto',
                }}
                >
                    <TextInput
                        placeholder={Lang.t('Restore.ComfirmLocalPasscode')}
                        value={this.state.confirmPwd}
                        secureTextEntry={true}
                        onChangeText={(val) => this.validateCfPwd(val)}
                        ref={input => { this.inputs['field3'] = input }}
                        returnKeyType={'done'}
                        onSubmitEditing={() => {
                            if (this.state.typeButton == false) {
                                this.restoreByBackupCode()
                            }
                        }}
                        style={{ flex: 10, fontSize: hp('2.5%') }}
                        underlineColorAndroid="transparent"
                    />
                </View>
                <Text style={{ color: GLOBALS.Color.danger }}>{this.state.txtCfPwd}</Text>

                <TouchableOpacity style={style.button} onPress={() => this.restoreByBackupCode()} disabled={this.state.typeButton}>
                    <Gradient
                        colors={this.state.typeButton ? ['#cccccc', '#cccccc'] : ['#0C449A', '#082B5F']}
                        start={{ x: 1, y: 0.7 }}
                        end={{ x: 0, y: 3 }}
                        style={{ paddingVertical: hp('2%'), borderRadius: 5 }}
                    >
                        <Text style={style.TextButton}>{Lang.t('Restore.TitleButton')}</Text>
                    </Gradient>
                </TouchableOpacity>
            </View>
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

        if (this.state.password == '' || this.state.confirmPwd == '' || this.state.errCfPwd == true || this.state.errPwd == true || this.state.errPKcode == true) {
            await this.setState({ typeButton: true })
        } else {
            await this.setState({ typeButton: false })
        }
    }

    async validatePwd(value) {
        this.setState({ password: value })
        if (value.length > 5) {
            await this.setState({ txtErrPwd: '', errPwd: false, typeButton: false });
        } else {
            await this.setState({ txtErrPwd: Lang.t("Restore.ErrorLocalPasscode"), errPwd: true, typeButton: true })
        }

        if (this.state.confirmPwd == '' || this.state.confirmPwd == value) {
            await this.setState({ txtCfPwd: '', errCfPwd: false });
        } else {
            await this.setState({ txtCfPwd: Lang.t("Restore.ErrorNotMatch"), errCfPwd: true })
        }
        if (this.state.password == '' || this.state.confirmPwd == '' || this.state.errCfPwd == true || this.state.errPwd == true || this.state.errPKcode == true) {
            await this.setState({ typeButton: true })
        } else {
            await this.setState({ typeButton: false })
        }

    }

    async validateCfPwd(value) {
        this.setState({ confirmPwd: value })
        if (this.state.password && this.state.password == value) {
            await this.setState({ txtCfPwd: '', errCfPwd: false, typeButton: false });
        } else {
            await this.setState({ txtCfPwd: Lang.t("Restore.ErrorNotMatch"), errCfPwd: true, typeButton: true })
        }
        if (this.state.errPwd == true || this.state.errPKcode == true || this.state.errCfPwd) {
            await this.setState({ typeButton: true })
        } else {
            await this.setState({ typeButton: false })
        }
    }

    restoreByPK() {
        this.props.showLoading(true);
        restoreByPk(this.state.privateKey, this.state.password)
            .then(rCode => {
                this.props.showLoading(false);
                if (rCode == 0) {
                    rmData('ListToken').then(() => {
                        var initialData = [{
                            "tokenAddress": '',
                            "balance": '0',
                            "symbol": 'NTY',
                            "decimals": '',
                            "ABI": ''
                        }]
                        setData('ListToken', JSON.stringify(initialData)).then(() => {
                            setData('isBackup', '0');
                            const { navigate } = this.props.navigator;
                            navigate('TabNavigator');
                        })
                    })
                } else {
                    Alert.alert(
                        Lang.t("Restore.Error"),
                        Lang.t("Restore.AlertInvalidPK"),
                        [{ text: Lang.t("Restore.Ok"), onPress: () => this.setState(this.InitState) }]
                    )
                }
            }).catch(err => {
                this.props.showLoading(false);
                console.log('cache', err)
                Alert.alert(
                    Lang.t("Restore.Error"),
                    Lang.t("Restore.AlertInvalidPK"),
                    [{ text: Lang.t("Restore.Ok"), onPress: () => { this.setState(this.InitState) } }]
                )
            })
    }

    focusTheField = (id) => {
        this.inputs[id].focus();
    }
    inputs = {};

    render() {
        return (
            <View style={{ marginTop: hp('14.5%') }}>
                <View style={{
                    justifyContent: 'center',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    borderBottomWidth: 1,
                    borderBottomColor: '#AAAAAA',
                    paddingVertical: Platform.OS === 'ios' ? hp('1.5%') : 'auto',
                }}>
                    <TextInput
                        placeholder={Lang.t("Restore.Privatekey")}
                        value={this.state.privateKey}
                        onChangeText={(val) => this.validatePKCode(val)}
                        returnKeyType={"next"}
                        blurOnSubmit={false}
                        onSubmitEditing={() => { this.focusTheField('field2'); }}
                        style={{ flex: 10, fontSize: hp('2.5%') }}
                        underlineColorAndroid="transparent"
                    />
                </View>
                <Text style={{ color: GLOBALS.Color.danger }}>{this.state.txtErrPKcode}</Text>
                <View style={{
                    justifyContent: 'center',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    borderBottomWidth: 1,
                    borderBottomColor: '#AAAAAA',
                    paddingVertical: Platform.OS === 'ios' ? hp('1.5%') : 'auto',
                }}>
                    <TextInput
                        placeholder={Lang.t("Restore.LocalPasscode")}
                        value={this.state.password}
                        secureTextEntry={true}
                        onChangeText={(val) => this.validatePwd(val)}
                        ref={input => { this.inputs['field2'] = input }}
                        returnKeyType={'next'}
                        blurOnSubmit={false}
                        onSubmitEditing={() => { this.focusTheField('field3'); }}
                        style={{ flex: 10, fontSize: hp('2.5%') }}
                        underlineColorAndroid="transparent"
                    />
                </View>
                <Text style={{ color: GLOBALS.Color.danger }}>{this.state.txtErrPwd}</Text>
                <View style={{
                    justifyContent: 'center',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    borderBottomWidth: 1,
                    borderBottomColor: '#AAAAAA',
                    paddingVertical: Platform.OS === 'ios' ? hp('1.5%') : 'auto',
                }}>
                    <TextInput
                        placeholder={Lang.t("Restore.ComfirmLocalPasscode")}
                        value={this.state.confirmPwd}
                        secureTextEntry={true}
                        onChangeText={(val) => this.validateCfPwd(val)}
                        ref={input => { this.inputs['field3'] = input }}
                        returnKeyType={'done'}
                        onSubmitEditing={() => {
                            if (this.state.typeButton == false) {
                                this.restoreByPK()
                            }
                        }}
                        style={{ flex: 10, fontSize: hp('2.5%') }}
                        underlineColorAndroid="transparent"
                    />
                </View>
                <Text style={{ color: GLOBALS.Color.danger }}>{this.state.txtCfPwd}</Text>
                <TouchableOpacity style={style.button} onPress={() => this.restoreByPK()} disabled={this.state.typeButton}>
                    <Gradient
                        colors={this.state.typeButton ? ['#cccccc', '#cccccc'] : ['#0C449A', '#082B5F']}
                        start={{ x: 1, y: 0.7 }}
                        end={{ x: 0, y: 3 }}
                        style={{ paddingVertical: hp('2%'), borderRadius: 5 }}
                    >
                        <Text style={style.TextButton}>{Lang.t('Restore.TitleButton')}</Text>
                    </Gradient>
                </TouchableOpacity>
            </View>
        )
    }
}

export default class restore extends Component {
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
            <ScrollView style={{ backgroundColor: '#fff' }}>
                <KeyboardAvoidingView style={style.container} keyboardVerticalOffset={Platform.OS == 'ios' ? hp('15%') : hp('3%')} behavior="position" enabled>
                    <ScreenRestore navigator={this.props.navigation}></ScreenRestore>
                </KeyboardAvoidingView>
            </ScrollView>
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
        shadowOffset: {
            width: 3,
            height: 3,
        },
        shadowColor: '#000',
        shadowOpacity: 0.2,
        borderRadius: 2
    }
})

const style = StyleSheet.create({
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
        marginTop: hp('2%'),
    },
    container: {
        flex: 1,
        padding: hp('2%')
    },
    logo: {
        height: GLOBALS.HEIGHT / 3,
        width: GLOBALS.WIDTH / 1.6,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    TextButton: {
        color: 'white',
        textAlign: 'center',
        fontSize: 15
    },
    buttonFolder: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 2,
    }
})