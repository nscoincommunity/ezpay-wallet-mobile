import React, { Component } from 'react'
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Clipboard,
    Platform,
    Share,
    Image,
    Text,
    ScrollView,
    Modal,
    ActivityIndicator,
    PermissionsAndroid,
    ToastAndroid,
} from 'react-native';
import GLOBALS from '../../helper/variables';
import Dialog from "react-native-dialog";
import { getBackupCode } from './backup.service'
import moment from 'moment';
import { Address } from '../../services/auth.service'
import RNFS from 'react-native-fs';
import { setData } from '../../services/data.service'
import Language from '../../i18n/i18n'
import CustomToast from '../../components/toast';
import Gradient from 'react-native-linear-gradient';

var datetime = new Date();
export default class backup extends Component {

    Default_Toast_Bottom = (message) => {

        this.refs.defaultToastBottom.ShowToastFunction(message);

    }

    static navigationOptions = () => ({
        title: Language.t('Backup.Title'),
        headerStyle: {
            backgroundColor: '#fafafa',
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
                            .then(async success => {
                                if (Platform.OS == 'ios') {
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
                                    }, 350)
                                }
                                if (Platform.OS == 'android') {
                                    var newPath = RNFS.ExternalStorageDirectoryPath + '/NextyWallet'
                                    if (await RNFS.exists(newPath)) {
                                        RNFS.writeFile(newPath + '/' + NameFile, bc).then(cp => {
                                            ToastAndroid.show(Language.t('Backup.ToastSaveFile'), ToastAndroid.SHORT)
                                        }).catch(errCopy => {
                                            console.log(errCopy)
                                        })
                                    } else {
                                        try {
                                            const granted = await PermissionsAndroid.request(
                                                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
                                                    title: "Grant store access",
                                                    message: "We need access",
                                                },
                                            );
                                            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                                                RNFS.mkdir(newPath).then(ssFolder => {
                                                    var decodedURL = decodeURIComponent(path)
                                                    RNFS.writeFile(newPath + '/' + NameFile, bc).then(cp => {
                                                        ToastAndroid.show(Language.t('Backup.ToastSaveFile'), ToastAndroid.SHORT)
                                                    }).catch(errCopy => {
                                                    })
                                                }).catch(errFolder => {
                                                    console.log(errFolder)

                                                })
                                            } else {
                                                Alert.alert(
                                                    "Error",
                                                    "Write External Storage permission allows us to do store files. Please allow this permission in App Settings.",
                                                    [
                                                        { text: 'Ok', style: 'cancel' }
                                                    ]
                                                )
                                            }

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
            <ScrollView contentContainerStyle={{ flex: 1 }}>
                <View style={style.container} pointerEvents="box-none">
                    {
                        this.state.getsuccess ?
                            <View style={style.MainForm}>
                                <Text style={{ textAlign: 'center', fontFamily: GLOBALS.font.Poppins, fontWeight: '400', fontSize: GLOBALS.wp('5%') }}>{Language.t('Backup.GetSuccess.Title')}</Text>
                                <View style={{ alignItems: 'center' }}>
                                    <Image source={require('../../images/backup.png')}
                                        resizeMode="contain"
                                        style={{ height: GLOBALS.hp('40%'), width: GLOBALS.wp('40%'), marginLeft: GLOBALS.wp('5%') }}
                                    />
                                </View>
                                <Text style={{ textAlign: 'center', fontFamily: GLOBALS.font.Poppins, fontSize: GLOBALS.wp('4%') }}>{this.state.backupcode}</Text>
                                <TouchableOpacity style={style.button} onPress={this.Copy.bind(this)} disabled={this.state.isCopy}>
                                    <Gradient
                                        colors={['#0C449A', '#082B5F']}
                                        start={{ x: 1, y: 0.7 }}
                                        end={{ x: 0, y: 3 }}
                                        style={{ paddingVertical: GLOBALS.hp('2%'), borderRadius: 5 }}
                                    >
                                        {
                                            !this.state.isCopy ?
                                                <Text style={style.TextButton}>{Language.t('Backup.GetSuccess.TitleButton')}</Text>
                                                :
                                                <Text style={style.TextButton}>{Language.t('Backup.GetSuccess.TitleCopied')} </Text>
                                        }
                                    </Gradient>

                                </TouchableOpacity>
                            </View>
                            :
                            < View style={style.MainForm}>
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        fontFamily: GLOBALS.font.Poppins,
                                        fontWeight: '400',
                                        fontSize: GLOBALS.wp('5%')
                                    }}
                                >
                                    {Language.t('Backup.InitForm.Content')}
                                </Text>
                                <View style={{ alignItems: 'center' }}>
                                    <Image source={require('../../images/backup.png')}
                                        resizeMode="contain"
                                        style={{ height: GLOBALS.hp('40%'), width: GLOBALS.wp('40%'), marginLeft: GLOBALS.wp('5%') }}
                                    />
                                </View>
                                <TouchableOpacity style={style.button} onPress={this.showDialog.bind(this)}>
                                    <Gradient
                                        colors={['#0C449A', '#082B5F']}
                                        start={{ x: 1, y: 0.7 }}
                                        end={{ x: 0, y: 3 }}
                                        style={{ paddingVertical: GLOBALS.hp('2%'), borderRadius: 5 }}
                                    >
                                        <Text style={style.TextButton}>{Language.t('Backup.InitForm.TitleButton')}</Text>
                                    </Gradient>
                                </TouchableOpacity>
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
                        {/* {
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
                        } */}
                    </Dialog.Container>
                    <View
                        style={{
                            position: 'absolute',
                            bottom: GLOBALS.hp('10%'),
                            width: GLOBALS.wp('100%'),
                            elevation: 999,
                            alignItems: 'center',
                        }}
                    >
                        <CustomToast ref="defaultToastBottom" position="bottom" />
                    </View>
                </View >

            </ScrollView >
        )
    }
}
const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
        padding: GLOBALS.hp('2%'),
        position: 'relative',
    },
    MainForm: {
        flex: 1,
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: {
            width: -1,
            height: 3,
        },
        shadowOpacity: 0.24,
        shadowRadius: 2.27,
        elevation: 2,
        borderRadius: 5,
        padding: GLOBALS.hp('2.5%'),
        flexDirection: 'column',
        justifyContent: 'space-around'
    },

    TextButton: {
        color: 'white',
        textAlign: 'center',
        fontSize: GLOBALS.wp('4%'),
        fontFamily: GLOBALS.font.Poppins
    },
    button: {
        justifyContent: 'center',
        shadowOffset: { width: 3, height: 3, },
        shadowColor: 'black',
        shadowOpacity: 0.2,
    },
})