import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    ImageBackground,
    Platform,
    Share,
    ToastAndroid,
    Clipboard
} from 'react-native';
import { QRCode } from 'react-native-custom-qr-codes';
import QRCodeAndroid from 'react-native-qrcode-svg';
import Header from '../../components/header';
import GLOBAL from '../../helper/variables';
import CustomToast from '../../components/toast';
import { getBottomSpace, getStatusBarHeight } from 'react-native-iphone-x-helper'
import Gradient from 'react-native-linear-gradient';
import Language from '../../i18n/i18n';


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
    _copyAddress(address) {
        Clipboard.setString(address)
        if (Platform.OS == 'ios') {
            this.refs.toastBottom.ShowToastFunction(Language.t('Request.Toast'));
        } else {
            ToastAndroid.show(Language.t('Request.Toast'), ToastAndroid.SHORT)
        }
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
                <View style={styles.body}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ textAlign: 'center' }} numberOfLines={1} ellipsizeMode="middle" >{item.address}</Text>
                    </View>
                    <View style={{ flex: 5, }}>
                        <TouchableOpacity
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            onPress={() => this._copyAddress(item.address)}
                        >
                            <ImageBackground
                                source={require('../../images/bg-qr.png')}
                                style={{ padding: GLOBAL.wp('6%') }}
                                resizeMode="contain"
                            >
                                {/* <BarcodeFinder width={GLOBAL.wp('70%')} height={GLOBAL.wp('70%')} borderColor="#328FFC" borderWidth={3} /> */}
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
                                            size={GLOBAL.wp('60%')}
                                        />
                                }
                            </ImageBackground>
                        </TouchableOpacity>
                    </View>

                    <View style={{ flex: 4, }}>
                        <TouchableOpacity
                            style={styles.buttonShare}
                            onPress={() => this._getPrivatekey(item.pk_en)}
                        >
                            <Gradient
                                style={{ paddingVertical: GLOBAL.hp('2%'), borderRadius: 5, paddingHorizontal: GLOBAL.wp('15%') }}
                                colors={['#08AEEA', '#328FFC']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <Text style={{ textAlign: 'center', color: '#fff' }}>Export private key</Text>
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
                        <TouchableOpacity
                            style={styles.buttonShare}
                            onPress={() => Share.share({ message: item.address })}
                        >
                            <Gradient
                                style={{ paddingVertical: GLOBAL.hp('2%'), borderRadius: 5 }}
                                colors={['#08AEEA', '#328FFC']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <Text style={{ textAlign: 'center', color: '#fff' }}>Share</Text>
                            </Gradient>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.buttonShare}
                            onPress={() => Share.share({ message: item.address })}
                        >
                            <Gradient
                                style={{ paddingVertical: GLOBAL.hp('2%'), borderRadius: 5 }}
                                colors={['#F34C4C', '#C80000']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <Text style={{ textAlign: 'center', color: '#fff' }}>Remove wallet</Text>
                            </Gradient>
                        </TouchableOpacity>
                    </View>
                    <CustomToast ref="toastBottom" position="bottom" />
                </View>
            </Gradient>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    body: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'column',
        paddingVertical: GLOBAL.hp('2%'),
        alignItems: 'center'
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

export class BarcodeFinder extends Component {
    constructor(props) {
        super(props);
    }

    getSizeStyles() {
        return {
            width: this.props.width,
            height: this.props.height
        };
    }

    render() {
        return (
            <View style={[stylesQR.container]}>
                <View style={[stylesQR.finder, this.getSizeStyles()]}>
                    <View
                        style={[
                            { borderColor: this.props.borderColor },
                            stylesQR.topLeftEdge,
                            {
                                borderLeftWidth: this.props.borderWidth,
                                borderTopWidth: this.props.borderWidth
                            }
                        ]}
                    />
                    <View
                        style={[
                            { borderColor: this.props.borderColor },
                            stylesQR.topRightEdge,
                            {
                                borderRightWidth: this.props.borderWidth,
                                borderTopWidth: this.props.borderWidth
                            }
                        ]}
                    />
                    <View
                        style={[
                            { borderColor: this.props.borderColor },
                            stylesQR.bottomLeftEdge,
                            {
                                borderLeftWidth: this.props.borderWidth,
                                borderBottomWidth: this.props.borderWidth
                            }
                        ]}
                    />
                    <View
                        style={[
                            { borderColor: this.props.borderColor },
                            stylesQR.bottomRightEdge,
                            {
                                borderRightWidth: this.props.borderWidth,
                                borderBottomWidth: this.props.borderWidth
                            }
                        ]}
                    />
                </View>
            </View>
        );
    }
}
var stylesQR = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'transparent'
    },
    finder: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: 'transparent'
    },
    topLeftEdge: {
        position: "absolute",
        top: 0,
        left: 0,
        width: 40,
        height: 40
    },
    topRightEdge: {
        position: "absolute",
        top: 0,
        right: 0,
        width: 40,
        height: 40
    },
    bottomLeftEdge: {
        position: "absolute",
        bottom: 0,
        left: 0,
        width: 40,
        height: 40
    },
    bottomRightEdge: {
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 40,
        height: 40
    }
});