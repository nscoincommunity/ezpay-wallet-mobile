import React, { Component } from 'react'
import { View, StyleSheet, TouchableOpacity, Alert, Clipboard, Platform, Share, Image } from 'react-native';
import { Text, Root } from "native-base";
import GLOBALS from '../../helper/variables';
import Dialog from "react-native-dialog";
import { getBackupCode } from './backup.service'
import { showToastBottom, showToastTop } from '../../services/loading.service'
import moment from 'moment';
import { Address } from '../../services/auth.service'
import RNFS from 'react-native-fs';
import { setData } from '../../services/data.service'


var datetime = new Date();
export default class backup extends Component {
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


    showDialog() {
        this.setState({ dialogVisible: true });
    }

    async handleGet() {
        this.setState({ loading: true })
        getBackupCode(this.state.passcode)
            .then(bc => {
                this.setState({ backupcode: bc, getsuccess: true, dialogVisible: false, loading: false }, () => {
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
                                            showToastTop('Save file was cancel')
                                        } else {
                                            showToastTop('Save file backup success!')
                                        }
                                    }).catch(errShare => {
                                        console.log('err', errShare)
                                    })
                                }, 1000)
                            }
                            if (Platform.OS == 'android') {
                                showToastTop('Save file backup success!')
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
                })
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
                    'Get backup code failed',
                    err,
                    [
                        { text: 'Cancel', onPress: () => { this.setState({ dialogVisible: false, passcode: '' }) }, style: 'cancel' },
                        { text: 'Try again', onPress: () => { this.setState({ dialogVisible: true, passcode: '' }) } }
                    ]
                )
            })
    }


    Copy() {
        Clipboard.setString(this.state.backupcode);
        showToastBottom('Copied to clipboard');
        setData('isBackup', '1');
        this.setState({ isCopy: true })

    }

    handleCancel() {
        this.setState({ dialogVisible: false, passcode: '' })
    }
    render() {
        return (
            <Root>
                <View>
                    {!this.state.getsuccess ?
                        < View >
                            <Text style={{ textAlign: 'center', marginTop: GLOBALS.HEIGHT / 20, marginBottom: GLOBALS.HEIGHT / 20, fontFamily: GLOBALS.font.Poppins }}>Click below button to backup wallet</Text>
                            <View style={style.FormRouter}>
                                <TouchableOpacity style={style.button} onPress={this.showDialog.bind(this)}>
                                    <Text style={style.TextButton}>BACKUP</Text>
                                </TouchableOpacity>
                            </View>
                        </View> : null
                    }
                    {
                        this.state.getsuccess ?
                            <View>
                                <Text style={{ textAlign: 'center', marginTop: GLOBALS.HEIGHT / 20, marginBottom: GLOBALS.HEIGHT / 20 }}>Backup code</Text>
                                <Text style={{ textAlign: 'center', marginBottom: GLOBALS.HEIGHT / 20 }}>{this.state.backupcode}</Text>
                                <View style={style.FormRouter}>
                                    <TouchableOpacity style={style.button} onPress={this.Copy.bind(this)} disabled={this.state.isCopy}>
                                        {
                                            !this.state.isCopy ?
                                                <Text style={style.TextButton}>Copy backup code</Text>
                                                :
                                                <Text style={style.TextButton}>Copied </Text>
                                        }

                                    </TouchableOpacity>
                                </View>
                            </View> : null
                    }

                    <Dialog.Container visible={this.state.dialogVisible}>
                        <Dialog.Title style={{ fontFamily: GLOBALS.font.Poppins }}>Confirm backup</Dialog.Title>
                        <Dialog.Description style={{ fontFamily: GLOBALS.font.Poppins }}>
                            Enter you local passcode to process
                        </Dialog.Description>
                        <Dialog.Input placeholder="Local passcode" style={{ fontFamily: GLOBALS.font.Poppins }} onChangeText={(val) => this.setState({ passcode: val })} secureTextEntry={true} value={this.state.passcode} autoFocus={true}></Dialog.Input>
                        <Dialog.Button label="Cancel" onPress={this.handleCancel.bind(this)} />
                        <Dialog.Button label="Backup" onPress={this.handleGet.bind(this)} />
                    </Dialog.Container>
                    {
                        this.state.loading ?
                            <View style={{ position: 'absolute', flex: 1, justifyContent: 'center', alignItems: 'center', height: GLOBALS.HEIGHT, width: GLOBALS.WIDTH }} >
                                {/* <View style={{ backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderRadius: 10, padding: 10, aspectRatio: 1 }}> */}
                                <Image source={require('../../images/loading.gif')} resizeMode="contain" style={{ height: 80, width: 80 }} />
                                {/* </View> */}
                            </View>
                            : null
                    }
                </View >
            </Root>
        )
    }
}
const style = StyleSheet.create({

    FormRouter: {
        flexDirection: 'column',
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
        height: GLOBALS.HEIGHT / 17,
        justifyContent: 'center',
        width: GLOBALS.WIDTH / 1.6,
        shadowOffset: { width: 3, height: 3, },
        shadowColor: 'black',
        shadowOpacity: 0.2,
    },
})