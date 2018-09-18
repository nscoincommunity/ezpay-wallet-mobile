import React, { Component } from 'react'
import { Platform, StyleSheet, Text, View, Image, TouchableOpacity, KeyboardAvoidingView, ScrollView, SegmentedControlIOS, Alert } from 'react-native';
import { Form, Item, Input, Label } from 'native-base'
import SegmentControl from 'react-native-segment-controller';
import GLOBALS from '../../helper/variables';
import Icon from "react-native-vector-icons/FontAwesome";
import { restoreByBackup, restoreByPk } from './restore.service';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import RNFS from 'react-native-fs';


class ScreenRestore extends Component {
    constructor() {
        super();

        this.state = {
            index: 0,
            content: ''
        }
        this.handlePress = this.handlePress.bind(this);
    }

    handlePress(index) {
        this.setState({ content: `Segment ${index + 1} selected !!!`, index });
    }
    render() {
        return (
            <View style={style.container}>
                <Image style={style.logo} source={require('../../images/logo-with-text.png')} resizeMode="contain" />

                <SegmentControl
                    values={['BACKUP CODE', 'PRIVATE KEY']}
                    selectedIndex={this.state.index}
                    height={30}
                    onTabPress={this.handlePress}
                    borderRadius={5}
                    activeTabStyle={{ backgroundColor: GLOBALS.Color.primary }}
                    borderRadius={9}
                />

                {this.state.index === 0 && <FormBackupcode navigator={this.props.navigator} />}
                {this.state.index === 1 && <FormPrivateKey navigator={this.props.navigator} />}

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

    async validateBuCode(value) {
        this.setState({ txtErrBUcode: '' })
        if (value.length < 1) {
            await this.setState({ errBUcode: true, txtErrBUcode: 'Please enter a valid backup code.', typeButton: true });
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
            await this.setState({ txtErrPwd: 'Wallet local passcode needs at least 6 characters', errPwd: true, typeButton: true })
        }

        if (this.state.confirmPwd == '' || this.state.confirmPwd == value) {
            await this.setState({ txtCfPwd: '', errCfPwd: false });
        } else {
            await this.setState({ txtCfPwd: 'Wallet local passcode not match', errCfPwd: true })
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
            await this.setState({ txtCfPwd: 'Wallet local passcode not match', errCfPwd: true, typeButton: true })
        }

        if (this.state.errPwd == true || this.state.errBUcode == true || this.state.errCfPwd == true) {
            await this.setState({ typeButton: true })
        } else {
            await this.setState({ typeButton: false })
        }
    }
    restoreByBackupCode() {
        restoreByBackup(this.state.backupCode, this.state.password)
            .then(rCode => {
                if (rCode == 0) {
                    const { navigate } = this.props.navigator;
                    navigate('TabNavigator');
                } else {
                    Alert.alert(
                        'Error',
                        'Invalid restore code, please try again!',
                        [{ text: 'OK', onPress: () => this.setState(this.InitState) }]
                    )
                }
            }).catch(err => {
                Alert.alert(
                    'Error',
                    'Invalid restore code, please try again!',
                    [{ text: 'OK', onPress: () => { this.setState(this.InitState) } }]
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
                        'Warning',
                        'Please select a valid backup file',
                        [{ text: 'OK', onPress: () => { }, style: 'cancel' }]
                    )
                }

            }
        });

    }

    render() {
        return (
            <View>
                <Form style={style.FormLogin}>
                    <View style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        width: GLOBALS.WIDTH,
                    }}>
                        <Item floatingLabel style={{ width: GLOBALS.WIDTH / 1.3 }} error={this.state.errBUcode}>
                            <Label>Backup code/Choose file</Label>
                            <Input onChangeText={(val) => this.validateBuCode(val)} value={this.state.backupCode} />
                        </Item>

                        <TouchableOpacity style={style.buttonFolder} onPress={() => this.SelectFile()}>
                            <Icon name="folder-open" backgroundColor="#3b5998" color="rgb(170, 170, 27)" size={35}>
                            </Icon>
                        </TouchableOpacity>
                    </View>
                    <Item style={{ borderBottomWidth: 0 }}>
                        <Text style={{ color: GLOBALS.Color.danger }}>{this.state.txtErrBUcode}</Text>
                    </Item>

                    <Item floatingLabel error={this.state.errPwd}>
                        <Label>Local passcode</Label>
                        <Input secureTextEntry={true} onChangeText={(val) => this.validatePwd(val)} />
                    </Item>
                    <Item style={{ borderBottomWidth: 0 }}>
                        <Text style={{ color: GLOBALS.Color.danger }}>{this.state.txtErrPwd}</Text>
                    </Item>

                    <Item floatingLabel error={this.state.errCfPwd}>
                        <Label>Comfirm local passcode</Label>
                        <Input secureTextEntry={true} onChangeText={(val) => this.validateCfPwd(val)} />
                    </Item>
                    <Item style={{ borderBottomWidth: 0 }}>
                        <Text style={{ color: GLOBALS.Color.danger }}>{this.state.txtCfPwd}</Text>
                    </Item>

                </Form>
                <View style={style.FormRouter}>
                    <TouchableOpacity style={styleButton(GLOBALS.Color.primary, this.state.typeButton).button} onPress={() => this.restoreByBackupCode()} disabled={this.state.typeButton}>
                        <Text style={style.TextButton}>Continue</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}
class FormPrivateKey extends Component {
    constructor(props) {

        super(props)

        this.state = {
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
        };
    };

    async validatePKCode(value) {
        this.setState({ txtErrPKcode: '' })
        if (value.length != 64) {
            await this.setState({ errPKcode: true, txtErrPKcode: 'Please enter a valid private key.', typeButton: true });
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
            await this.setState({ txtErrPwd: 'Wallet local passcode needs at least 6 character', errPwd: true, typeButton: true })
        }

        if (this.state.confirmPwd == '' || this.state.confirmPwd == value) {
            await this.setState({ txtCfPwd: '', errCfPwd: false });
        } else {
            await this.setState({ txtCfPwd: 'Wallet local passcode not match', errCfPwd: true })
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
            await this.setState({ txtCfPwd: 'Wallet local passcode not match', errCfPwd: true, typeButton: true })
        }
        if (this.state.errPwd == true || this.state.errPKcode == true || this.state.errCfPwd) {
            await this.setState({ typeButton: true })
        } else {
            await this.setState({ typeButton: false })
        }
    }

    restoreByPK() {
        restoreByPk(this.state.privateKey, this.state.password)
            .then(rCode => {
                if (rCode == 0) {
                    const { navigate } = this.props.navigator;
                    navigate('TabNavigator');
                } else {
                    Alert.alert(
                        'Error',
                        'Invalid private key, please try again!',
                        [{ text: 'OK', onPress: () => this.setState(this.InitState) }]
                    )
                }
            }).catch(err => {
                console.log('cache', err)
                Alert.alert(
                    'Error',
                    'Invalid private key, please try again!',
                    [{ text: 'OK', onPress: () => { this.setState(this.InitState) } }]
                )
            })
    }

    render() {
        return (
            <View>
                <Form style={style.FormLogin}>
                    <Item floatingLabel error={this.state.errPKcode}>
                        <Label>Private key</Label>
                        <Input onChangeText={(val) => this.validatePKCode(val)} />
                    </Item>
                    <Item style={{ borderBottomWidth: 0 }}>
                        <Text style={{ color: GLOBALS.Color.danger }}>{this.state.txtErrPKcode}</Text>
                    </Item>

                    <Item floatingLabel error={this.state.errPwd}>
                        <Label>Local passcode</Label>
                        <Input secureTextEntry={true} onChangeText={(val) => this.validatePwd(val)} />
                    </Item>
                    <Item style={{ borderBottomWidth: 0 }}>
                        <Text style={{ color: GLOBALS.Color.danger }}>{this.state.txtErrPwd}</Text>
                    </Item>

                    <Item floatingLabel error={this.state.errCfPwd}>
                        <Label>Comfirm local passcode</Label>
                        <Input secureTextEntry={true} onChangeText={(val) => this.validateCfPwd(val)} />
                    </Item>
                    <Item style={{ borderBottomWidth: 0 }}>
                        <Text style={{ color: GLOBALS.Color.danger }}>{this.state.txtCfPwd}</Text>
                    </Item>
                </Form>
                <View style={style.FormRouter}>
                    <TouchableOpacity style={styleButton(GLOBALS.Color.primary, this.state.typeButton).button} disabled={this.state.typeButton} onPress={() => this.restoreByPK()}>
                        <Text style={style.TextButton}>Continue</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

export default class restore extends Component {
    render() {
        return (
            <ScrollView >
                <KeyboardAvoidingView style={style.container} behavior="position" keyboardVerticalOffset={65} enabled>
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
        shadowOffset: { width: 3, height: 3, },
        shadowColor: 'black',
        shadowOpacity: 0.2,
        borderRadius: 2
    }
})

const style = StyleSheet.create({
    container: {
        flex: 1,
        // marginTop: Platform.OS === 'ios' ? 25 : 0,

        alignItems: 'center',
    },
    logo: {
        height: GLOBALS.HEIGHT / 3,
        width: GLOBALS.WIDTH / 1.6,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    FormRouter: {
        alignItems: 'center',
        // paddingLeft: GLOBALS.WIDTH / 5,
        // paddingRight: GLOBALS.WIDTH / 5
    },
    TextButton: {
        color: 'white',
        textAlign: 'center',
        fontSize: 15
    },
    FormLogin: {
        width: GLOBALS.WIDTH,
        marginBottom: GLOBALS.HEIGHT / 20,
    },
    buttonFolder: {
        flexDirection: 'column',
        width: GLOBALS.WIDTH / 6,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        backgroundColor: GLOBALS.Color.primary,
        borderRadius: 5
    }
})