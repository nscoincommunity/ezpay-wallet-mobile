import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Clipboard,
    Alert,
    Image,
    ImageBackground,
    TouchableHighlight,
    Share,
    Platform,
    TextInput,
    ScrollView
} from 'react-native';
import Color from '../../../../helpers/constant/color';
import Gradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CONSTANT from '../../../../helpers/constant';
import Header from '../../../components/header';
import QRCode from 'react-native-qrcode-svg';
import URI from '../../../../helpers/constant/uri'
import VectorIcon from 'react-native-vector-icons'
import FlashMessage, { showMessage } from '../../../../lib/flash-message'
import DeviceBrightness from 'react-native-device-brightness';
import RBSheet from '../../../../lib/bottom-sheet';

interface walletProps {
    to: string,
    value: number,
    gas: number,
    decimal: number,
    symbol: string,
    token: string,
    description: string
}
export default class Receive extends Component {
    InforWallet = {};
    state = {
        valueQR: '',
        brightnessCurrent: 0
    };
    JsonQr: walletProps = {}
    addressTK = "";

    async componentWillMount() {
        const { item, id_market, decimals, symbol, address } = this.props.navigation.getParam('payload');
        this.JsonQr.to = item.address;
        this.JsonQr.decimal = decimals;
        this.JsonQr.token = address;
        this.JsonQr.symbol = symbol;
        this.JsonQr.token = address;

        this.setState({ valueQR: item.address });
        this.setState({ brightnessCurrent: Platform.OS == 'ios' ? await DeviceBrightness.getBrightnessLevel() : await DeviceBrightness.getSystemBrightnessLevel() })
        DeviceBrightness.setBrightnessLevel(1)
    }

    componentWillUnmount() {
        DeviceBrightness.setBrightnessLevel(this.state.brightnessCurrent)
    }

    func_share = (message) => {
        Share.share({ message: message });
    }

    customQR = () => {
        this.RBSheet.open()
    }

    Func_customQR = () => {
        this.setState({ valueQR: JSON.stringify(this.JsonQr) }, () => {
            this.RBSheet.close()
        })
    }

    ChangeAmount = (val) => {
        this.JsonQr.value = val;
    }

    ChangeNote = (val) => {
        this.JsonQr.description = val
    }

    render() {
        const { item, id_market } = this.props.navigation.getParam('payload')
        return (
            <Gradient
                colors={Color.Gradient_backgound_page}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ flex: 1 }}
            >
                <Header
                    IconLeft="arrow-back"
                    onPressLeft={() => this.props.navigation.goBack()}
                    Title="Your public address"
                    styleTitle={{ color: Color.Tomato }}
                />

                <FlashMessage position="top" />
                <View style={styles.container}>

                    <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 30 }}>
                        <Text numberOfLines={1} ellipsizeMode="middle" style={{ fontFamily: CONSTANT.Poppins }}>{item.address}</Text>
                    </View>

                    <TouchableOpacity
                        style={{ justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => showMessage({
                            message: 'Copy success',
                            type: 'success',
                            animated: true,
                            icon: "success",
                        })}
                    >

                        <ImageBackground
                            source={require('../../../../assets/images/bg-qr.png')}
                            resizeMode="contain"
                            style={{ padding: 20 }}
                        >
                            <QRCode
                                value={this.state.valueQR}
                                // logo={{ uri: URI.MARKET_CAP_ICON + id_market + '.png' }}
                                // logoMargin={5}
                                // logoSize={50}
                                // logoBorderRadius={25}
                                logoBackgroundColor='#fff'
                                backgroundColor='transparent'
                                size={200}
                            />
                        </ImageBackground>
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 30 }}>
                        <TouchableOpacity
                            style={[styles.styleButton, { flex: 4 }]}
                            onPress={() => this.func_share(this.state.valueQR)}
                        >
                            <Text style={{ fontFamily: CONSTANT.Poppins, marginRight: 5 }}>
                                Share
                            </Text>
                            <Icon name="share-variant" size={20} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.styleButton, { flex: 6 }]}
                            onPress={() => this.customQR()}
                        >
                            <Text style={{ fontFamily: CONSTANT.Poppins, marginRight: 5 }}>
                                Custom QR
                            </Text>
                            <Icon name="qrcode-edit" size={20} />
                        </TouchableOpacity>
                    </View>
                </View>
                <RBSheet
                    ref={ref => {
                        this.RBSheet = ref;
                    }}
                    closeOnDragDown={true}
                    height={300}
                    duration={250}
                    customStyles={{
                        container: {
                            borderTopLeftRadius: 5,
                            borderTopRightRadius: 5,
                        }
                    }}
                >
                    <ScrollView>
                        <Text style={{ fontSize: 25, fontWeight: 'bold', fontFamily: CONSTANT.Poppins, textAlign: 'center', marginVertical: 10 }}>Custom QR code</Text>
                        <View style={{ paddingHorizontal: 10 }}>
                            <Text style={{ fontSize: 15, fontFamily: CONSTANT.Poppins }}>Amount:</Text>
                            <View style={{ backgroundColor: Color.Wild_sand, padding: Platform.OS == 'ios' ? 10 : 2, borderRadius: 5 }}>
                                <TextInput
                                    underlineColorAndroid="transparent"
                                    style={{ borderBottomWidth: 0 }}
                                    onChangeText={(val) => this.ChangeAmount(val)}
                                    keyboardType="numeric"
                                />
                            </View>
                            <Text style={{ fontSize: 15, fontFamily: CONSTANT.Poppins }}>Note:</Text>
                            <View style={{ backgroundColor: Color.Wild_sand, borderRadius: 5, padding: Platform.OS == 'ios' ? 10 : 2 }}>
                                <TextInput
                                    style={{ borderBottomWidth: 0, height: 70 }}
                                    maxLength={300}
                                    numberOfLines={3}
                                    multiline={true}
                                    underlineColorAndroid="transparent"
                                    onChangeText={(val) => this.ChangeNote(val)}
                                />
                            </View>
                        </View>
                        <View style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginVertical: 15
                        }}>
                            <TouchableHighlight
                                style={{
                                    paddingHorizontal: 50,
                                    paddingVertical: 10,
                                    backgroundColor: Color.Steel_blue,
                                    borderRadius: 50
                                }}
                                onPress={() => this.Func_customQR()}
                            >
                                <Text style={{ textAlign: 'center', color: '#fff' }}>Ok</Text>
                            </TouchableHighlight>
                        </View>
                    </ScrollView>
                </RBSheet>
            </Gradient>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        justifyContent: 'center'
    },
    styleButton: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 50,
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 2.27,
        elevation: 7,
        marginHorizontal: 10
    }
})
