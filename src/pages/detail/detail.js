import React, { Component } from 'react'
import {
    View,
    TouchableOpacity,
    Linking,
    StyleSheet,
    Text,
    Platform,
    Clipboard,
    ToastAndroid,
    Vibration,
    VibrationIOS,
    StatusBar
} from 'react-native';
import GLOBALS from '../../helper/variables';
import CONSTANTS from '../../helper/constants'
// import Icon from "react-native-vector-icons/FontAwesome";
import {
    ListItem,
    Body,
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import Language from '../../i18n/i18n';
import CustomToast from '../../components/toast'
import Header from '../../components/header';
import Gradient from 'react-native-linear-gradient';

export default class DetailHis extends Component {
    copy = (value) => {
        Clipboard.setString(value)
        Vibration.vibrate(100)
        if (Platform.OS == "android") {
            ToastAndroid.show(Language.t('Backup.GetSuccess.TitleCopied'), ToastAndroid.BOTTOM)
        } else {
            this.refs.defaultToastBottom.ShowToastFunction(Language.t('Backup.GetSuccess.TitleCopied'));
        }
    }

    _goExplorer(tx, network) {
        const { navigate } = this.props.navigation;
        // Linking.openURL(CONSTANTS.EXPLORER_API + '/#/tx/' + data.tx);
        switch (network) {
            case 'ethereum':
                navigate('Browser', { url: 'https://etherscan.io/tx/' + tx });
                break;
            case 'nexty':
                navigate('Browser', { url: CONSTANTS.EXPLORER_API + '/tx/' + tx })
                break;
            default:
                navigate('Browser', { url: 'https://tronscan.org/#/transaction/' + tx })
                break;
        }
    }

    render() {
        var data = this.props.navigation.getParam('data');
        var network = this.props.navigation.getParam('network');

        return (
            <Gradient
                colors={['#F0F3F5', '#E8E8E8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ flex: 1 }}>
                <StatusBar
                    backgroundColor={'transparent'}
                    translucent
                    barStyle="dark-content"
                />
                <Header
                    backgroundColor="transparent"
                    colorIconLeft="#328FFC"
                    colorTitle="#328FFC"
                    nameIconLeft="arrow-left"
                    title=''
                    style={{ marginTop: 23 }}
                    pressIconLeft={() => this.props.navigation.goBack()}
                />
                <View style={{ flex: 1, padding: GLOBALS.hp('2%') }}>
                    <View style={{
                        paddingHorizontal: GLOBALS.wp('4%'),
                        paddingVertical: GLOBALS.hp('3%'),
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 0,
                        },
                        shadowOpacity: 0.34,
                        shadowRadius: 2.27,
                        elevation: 5,
                        borderRadius: 10,
                        flex: 1,
                        backgroundColor: '#fff',
                        justifyContent: 'center'
                    }} >
                        <Text style={{
                            fontSize: GLOBALS.hp('4%'),
                            fontWeight: '400',
                            color: '#444444',
                            fontFamily: GLOBALS.font.Poppins,
                            marginBottom: GLOBALS.hp('5%'),
                            textAlign: 'center'
                        }}>{Language.t('DetailHistory.Title')}</Text>

                        <ListItem icon style={{ marginTop: 5, marginBottom: 5, marginLeft: 0 }} onPress={() => { this.copy(data.tx) }} >
                            <Body>
                                <Text style={styleText} >{Language.t('DetailHistory.Txhash')}</Text>
                                <Text style={styleText} note numberOfLines={1} ellipsizeMode="middle" >{data.tx}</Text>
                            </Body>
                        </ListItem>

                        <ListItem icon style={{ marginTop: 5, marginBottom: 5, marginLeft: 0, marginLeft: 0 }} onPress={() => { data.type == "arrow-up" ? this.copy(data.data.to) : this.copy(data.data.from) }}>
                            <Body>
                                <Text style={styleText}>{data.type == "arrow-up" ? Language.t('DetailHistory.To') : Language.t('DetailHistory.From')}</Text>
                                <Text
                                    style={styleText}
                                    note
                                    numberOfLines={1}
                                    ellipsizeMode="middle"
                                >
                                    {data.type == "arrow-up" ? data.data.to : data.data.from}
                                </Text>
                            </Body>
                        </ListItem>

                        <ListItem icon style={{ marginTop: 5, marginBottom: 5, marginLeft: 0 }}>
                            <Body>
                                <Text style={styleText}>{Language.t('DetailHistory.Amount')}</Text>
                                {
                                    Platform.OS == "ios" ?
                                        <Text style={styleText} note numberOfLines={1}>{
                                            parseFloat(data.quantity) % 1 == 0
                                                ? parseFloat(data.quantity).toLocaleString()
                                                : parseFloat(data.quantity).toFixed(2).toLocaleString()
                                        }</Text>
                                        :
                                        <Text style={styleText} note numberOfLines={1}>{
                                            parseFloat(data.quantity) % 1 == 0
                                                ? (parseFloat(data.quantity).toLocaleString()).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                                : (parseFloat(data.quantity).toFixed(2).toLocaleString()).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                        }</Text>
                                }
                            </Body>
                        </ListItem>

                        <ListItem icon style={{ marginTop: 5, marginBottom: 5, marginLeft: 0 }}>
                            <Body>
                                <Text style={styleText}>{Language.t('DetailHistory.Date')}</Text>
                                <Text note numberOfLines={1} style={styleText}>{data.datetime}</Text>
                            </Body>
                        </ListItem>

                        <ListItem icon style={{ marginTop: 5, marginBottom: 5, marginLeft: 0 }}>
                            <Body>
                                <Text style={styleText}>{Language.t('DetailHistory.Status')}</Text>
                                <Text style={{ color: "green", fontFamily: GLOBALS.font.Poppins }} note numberOfLines={1} >COMPLETE</Text>
                            </Body>
                        </ListItem>
                        <View style={{ marginVertical: GLOBALS.hp('4%'), paddingHorizontal: GLOBALS.wp('10%') }}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => this._goExplorer(data.tx, network)}
                            >
                                <Gradient
                                    colors={['#328FFC', '#08AEEA']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={{ paddingVertical: GLOBALS.hp('2%'), borderRadius: 5 }}
                                >
                                    <Text style={styles.TextButton}>{Language.t('DetailHistory.TitleButton')}</Text>
                                </Gradient>

                            </TouchableOpacity>
                        </View>

                        <View style={{ alignItems: 'center' }}>
                            <CustomToast ref="defaultToastBottom" position="bottom" />
                        </View>
                    </View>
                </View>
            </Gradient>
        )
    }
}
const styleText = {
    fontFamily: GLOBALS.font.Poppins
}
const styles = StyleSheet.create({
    TextButton: {
        color: 'white',
        textAlign: 'center',
        fontSize: GLOBALS.wp('4%'),
        fontFamily: GLOBALS.font.Poppins,
    },
    button: {
        justifyContent: 'center',
        shadowOffset: {
            width: 3,
            height: 3,
        },
        shadowColor: 'black',
        shadowOpacity: 0.2,
    },
})