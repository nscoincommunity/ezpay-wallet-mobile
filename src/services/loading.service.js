import PopupDialog, { ScaleAnimation, DialogTitle, DialogButton } from "react-native-popup-dialog"
import React, { Component } from 'react';
import { View, StyleSheet, Platform, Share, Text } from 'react-native';
import GLOBALS from '../helper/variables';
import { Toast } from 'native-base'
import RNFS from 'react-native-fs';
import { Spinner } from 'native-base';

export function showToastBottom(content) {
    Toast.show({
        text: content,
        position: 'bottom'
    })
}
export function showToastTop(content) {
    Toast.show({
        text: content,
        position: 'top'
    })
}
export function showToastConfig(content) {
    Toast.show({
        text: content,
        position: 'bottom',
        type: 'danger'
    })
}

export function ShowLoading() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Spinner color={GLOBALS.Color.primary} />
            <Text></Text>
        </View>
    )
}

export async function saveFile(name, content) {
    var path = (Platform.OS === 'ios' ? RNFS.TemporaryDirectoryPath + '/' + name : RNFS.ExternalDirectoryPath + '/' + name)
    return new Promise((resolve, reject) => {
        RNFS.writeFile(path, content)
            .then(success => {
                if (Platform.OS == 'ios') {
                    setTimeout(() => {
                        Share.share({
                            url: path,
                            title: 'save backup code file'
                        }).then(share => {
                            if (share['action'] == "dismissedAction") {
                                reject(1)
                            } else {
                                console.log('bbb')
                                resolve('save success')
                            }
                        }).catch(errShare => {
                            reject(errShare)
                        })
                    }, 100)
                }
                if (Platform.OS == 'android') {
                    resolve('save success')
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
                reject(error)
            })
    })

}