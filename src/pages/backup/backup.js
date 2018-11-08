import React, { Component } from 'react'
import { View, StyleSheet, TouchableOpacity, Alert, Clipboard, Platform, Share, Image, Text } from 'react-native';
import GLOBALS from '../../helper/variables';
import Dialog from "react-native-dialog";
import { getBackupCode } from './backup.service'
import moment from 'moment';
import { Address } from '../../services/auth.service'
import RNFS from 'react-native-fs';
import { setData } from '../../services/data.service'
import Language from '../../i18n/i18n'
import CustomToast from '../../components/toast';


var datetime = new Date();
export default class backup extends Component {

    Default_Toast_Bottom = (message) => {

        this.refs.defaultToastBottom.ShowToastFunction(message);

    }

    static navigationOptions = () => ({
        title: Language.t('Backup.Title'),
        headerStyle: {
            backgroundColor: GLOBALS.Color.primary,
        },
        headerTitleStyle: {
            color: 'white',
            width: GLOBALS.WIDTH
        },
        headerBackTitleStyle: {
            color: 'white',
        },
        headerTintColor: 'white',
    });

    constructor(props) {
        super(props)

        this.state = {
            dialogVisible: false,
            backupcode: '',
            passcode: '',
            getsuccess: false,
            isCopy: false,
            loading: false,
        };
    };

    componentWillUnmount() {
        if (this.props.navigation.state.params) {
            const { params } = this.props.navigation.state;
            params.callDasboard()
        }
    }

    showDialog() {
        this.setState({ dialogVisible: true });
    }

    async handleGet() {
        this.setState({ loading: true })
        getBackupCode(this.state.passcode)
            .then(bc => {
                this.setState({ backupcode: bc, getsuccess: true, dialogVisible: false, loading: false },
                    () => {
                        var NameFile = 'nexty--' + moment().format('YYYY-MM-DD') + '-' + datetime.getTime() + '--' + Address + '.txt'
                        var path = (Platform.OS === 'ios' ? RNFS.TemporaryDirectoryPath + '/' + NameFile : RNFS.ExternalDirectoryPath + '/' + NameFile)
                        RNFS.writeFile(path, bc)
                            .then(success => {
                                if (Platform.OS == 'ios') {
                                    console.log('this is iporn')
                                    setTimeout(() => {
                                        Share.share({
                                            url: path,
                                            title: 'save backup code file'
                                        }).then(share => {
                                            if (share['action'] == "dismissedAction") {
                                                this.Default_Toast_Bottom(Language.t('Backup.IOScancel'))
                                            } else {
                                                this.Default_Toast_Bottom(Language.t('Backup.ToastSaveFile'))
                                            }
                                        }).catch(errShare => {
                                            console.log('err', errShare)
                                        })
                                    }, 1000)
                                }
                                if (Platform.OS == 'android') {
                                    this.Default_Toast_Bottom(Language.t('Backup.ToastSaveFile'))
                                    var newPath = RNFS.ExternalStorageDirectoryPath + '/NextyWallet'
                                    console.log(newPath)
                                    if (RNFS.exists(newPath)) {
                                        console.log('exist dir')
                                    } else {
                                        try {
                                            const granted = PermissionsAndroid.request(
                                                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
                                                    title: "Grant SD card access",
                                                    message: "We need access",
                                                },
                                            );
                                            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                                                console.log("Permission OK");
                                            } else {
                                                console.log("Permission failed");
                                            }
                                            RNFS.mkdir(newPath).then(ssFolder => {
                                                RNFS.copyFile(path, newPath).then(cp => {
                                                    console.log(cp)
                                                }).catch(errCopy => {
                                                    console.log(errCopy)
                                                })
                                            }).catch(errFolder => {
                                                console.log(errFolder)

                                            })
                                        } catch (error) {
                                            console.log(error)
                                        }
                                    }
                                }
                            }).catch(error => {
                                console.log(error)
                            })
                    }
                )
                // var NameFile = 'backup--' + moment().format('YYYY-MM-DD') + '-' + datetime.getTime() + '--' + Address + '.json'
                // console.log(NameFile)
                // saveFile(NameFile, bc).then(ss => {
                //     console.log(ss)
                // }).catch(err => {
                //     console.log(err)
                // })
            }).catch(err => {
                this.setState({ loading: false })
                Alert.alert(
                    Language.t('Backup.Alert.Title'),
                    err,
                    [
                        { text: Language.t('Backup.Alert.TitleButtonCancel'), onPress: () => { this.setState({ dialogVisible: false, passcode: '' }) }, style: 'cancel' },
                        { text: Language.t('Backup.Alert.TitleButtonTry'), onPress: () => { this.setState({ dialogVisible: true, passcode: '' }) } }
                    ]
                )
            })
    }


    Copy() {
        Clipboard.setString(this.state.backupcode);
        this.Default_Toast_Bottom(Language.t('Backup.Toast'));
        setData('isBackup', '1');
        this.setState({ isCopy: true })

    }

    handleCancel() {
        this.setState({ dialogVisible: false, passcode: '' })
    }
    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center' }}>
                {
                    this.state.getsuccess ?
                        <View style={{ flex: 1 }}>
                            <Text style={{ textAlign: 'center', marginTop: GLOBALS.HEIGHT / 20, marginBottom: GLOBALS.HEIGHT / 20 }}>{Language.t('Backup.GetSuccess.Title')}</Text>
                            <Text style={{ textAlign: 'center', marginBottom: GLOBALS.HEIGHT / 20 }}>{this.state.backupcode}</Text>
                            <View style={style.FormRouter}>
                                <TouchableOpacity style={style.button} onPress={this.Copy.bind(this)} disabled={this.state.isCopy}>
                                    {
                                        !this.state.isCopy ?
                                            <Text style={style.TextButton}>{Language.t('Backup.GetSuccess.TitleButton')}</Text>
                                            :
                                            <Text style={style.TextButton}>{Language.t('Backup.GetSuccess.TitleCopied')} </Text>
                                    }

                                </TouchableOpacity>
                            </View>
                        </View>
                        :
                        < View >
                            <Text style={{ textAlign: 'center', marginTop: GLOBALS.HEIGHT / 20, marginBottom: GLOBALS.HEIGHT / 20, fontFamily: GLOBALS.font.Poppins }}>{Language.t('Backup.InitForm.Content')}</Text>
                            <View style={style.FormRouter}>
                                <TouchableOpacity style={style.button} onPress={this.showDialog.bind(this)}>
                                    <Text style={style.TextButton}>{Language.t('Backup.InitForm.TitleButton')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                }

                <Dialog.Container visible={this.state.dialogVisible}>
                    <Dialog.Title style={{ fontFamily: GLOBALS.font.Poppins }}>{Language.t('Backup.DialogConfirm.Title')}</Dialog.Title>
                    <Dialog.Description style={{ fontFamily: GLOBALS.font.Poppins }}>
                        {Language.t('Backup.DialogConfirm.Content')}
                    </Dialog.Description>
                    <Dialog.Input placeholder={Language.t('Backup.DialogConfirm.Placeholder')} style={{ fontFamily: GLOBALS.font.Poppins }} onChangeText={(val) => this.setState({ passcode: val })} secureTextEntry={true} value={this.state.passcode} autoFocus={true}></Dialog.Input>
                    <Dialog.Button label={Language.t('Backup.DialogConfirm.TitleButtonCancel')} onPress={this.handleCancel.bind(this)} />
                    <Dialog.Button label={Language.t('Backup.DialogConfirm.TitleButtonGet')} onPress={this.handleGet.bind(this)} />
                </Dialog.Container>

                <CustomToast ref="defaultToastBottom" position="bottom" />

            </View >
        )
    }
}
const style = StyleSheet.create({

    FormRouter: {
        // flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    TextButton: {
        color: 'white',
        textAlign: 'center',
        fontSize: 15
    },
    button: {
        backgroundColor: GLOBALS.Color.secondary,
        marginBottom: GLOBALS.HEIGHT / 40,
        padding: 10,
        justifyContent: 'center',
        shadowOffset: { width: 3, height: 3, },
        shadowColor: 'black',
        shadowOpacity: 0.2,
    },
})