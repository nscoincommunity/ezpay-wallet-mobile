import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, StatusBar, ImageBackground, Platform } from 'react-native';
import { QRCode } from 'react-native-custom-qr-codes';
import QRCodeAndroid from 'react-native-qrcode-svg';
import Header from '../../components/header';
import GLOBAL from '../../helper/variables';
import { getBottomSpace, getStatusBarHeight } from 'react-native-iphone-x-helper'
import Gradient from 'react-native-linear-gradient';
export default class InforWallet extends Component {

    _getPrivatekey(pk_en) {
        this.props.navigation.navigate('Privatekey', {
            payload: {
                pk_en
            }
        })
    }

    _goHistory(address, network) {
        this.props.navigation.navigate('History', {
            payload: {
                address,
                network
            }
        })
    }


    render() {
        const item = this.props.navigation.getParam('payload');
        let logo_net;
        switch (item.network.name) {
            case 'ethereum':
                logo_net = require('../../images/AddWallet/network/eth.png')
                break;
            case 'nexty':
                logo_net = require('../../images/AddWallet/network/nty.png')
                break;
            default:
                logo_net = require('../../images/AddWallet/network/tron.png')
                break;
        }
        let base64Logo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAA..';

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
                    nameIconLeft="times"
                    title={item.name}
                    style={{ paddingTop: getStatusBarHeight() }}
                    pressIconLeft={() => { this.props.navigation.goBack(); }}
                />
                <View style={{ flex: 1, backgroundColor: 'transparent', flexDirection: 'column', paddingVertical: 20 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ textAlign: 'center' }} numberOfLines={1} ellipsizeMode="middle" >{item.address}</Text>
                    </View>
                    <View style={{ flex: 6 }}>
                        <TouchableOpacity style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <ImageBackground
                                source={require('../../images/bg-qr.png')}
                                style={{ padding: GLOBAL.wp('6%') }}
                                resizeMode="contain"
                            >
                                {
                                    Platform.OS == 'android' ?
                                        <QRCodeAndroid
                                            value={item.address}
                                            logo={logo_net}
                                            logoSize={GLOBAL.wp('20%')}
                                            logoBackgroundColor='transparent'
                                            backgroundColor='transparent'
                                            size={GLOBAL.wp('60%')}
                                        />
                                        :
                                        <QRCode
                                            content={item.address}
                                            backgroundColor='transparent'
                                            logo={logo_net}
                                            logoSize={GLOBAL.wp('20%')}
                                        />
                                }

                            </ImageBackground>
                        </TouchableOpacity>
                    </View>

                    <View style={{ paddingHorizontal: GLOBAL.wp('20%'), flex: 3 }}>
                        <TouchableOpacity
                            style={styles.buttonShare}
                            onPress={() => this._getPrivatekey(item.pk_en)}
                        >
                            <Gradient
                                style={{ paddingVertical: GLOBAL.hp('2%'), borderRadius: 5 }}
                                colors={['#08AEEA', '#328FFC']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <Text style={{ textAlign: 'center', color: '#fff' }}>Get private key</Text>
                            </Gradient>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.buttonShare}
                            onPress={() => this._goHistory(item.address, item.network.name)}
                        >
                            <Gradient
                                style={{ paddingVertical: GLOBAL.hp('2%'), borderRadius: 5 }}
                                colors={['#08AEEA', '#328FFC']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <Text style={{ textAlign: 'center', color: '#fff' }}>History</Text>
                            </Gradient>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonShare}>
                            <Gradient
                                style={{ paddingVertical: GLOBAL.hp('2%'), borderRadius: 5 }}
                                colors={['#08AEEA', '#328FFC']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <Text style={{ textAlign: 'center', color: '#fff' }}>Share</Text>
                            </Gradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </Gradient>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonShare: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2.27,
        elevation: 7,
        marginVertical: GLOBAL.hp('1%'),
    }
})