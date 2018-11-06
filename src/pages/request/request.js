import React, { Component } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Share,
    Clipboard,
    PixelRatio,
    Image,
    TextInput,
    ScrollView,
    Platform
} from 'react-native';
// import Icon from "react-native-vector-icons/FontAwesome";
import GLOBALS from '../../helper/variables';
import QRCode from 'react-native-qrcode';
import { getData } from '../../services/data.service';
import { showToastBottom } from '../../services/loading.service';
import Language from '../../i18n/i18n';
import CustomToast from '../../components/toast';
import { Address } from '../../services/auth.service';
import Gradient from "react-native-linear-gradient"


const pt = PixelRatio.get()

export default class request extends Component {

    Default_Toast_Bottom = (message) => {

        this.refs.defaultToastBottom.ShowToastFunction(message);

    }
    constructor(props) {
        super(props)

        this.state = {
            address: Address
        };
        // try {
        //     getData('current').then(data => {
        //         this.setState({ address: data })
        //     })
        // } catch (error) {
        //     this.setState({ address: '' })
        // }
    };
    componentWillMount() {
        this.setState({ address: Address })

        try {
            getData('current').then(data => {
                this.setState({ address: data })
            })
        } catch (error) {
            this.setState({ address: '' })
        }
    }

    static navigationOptions = {
        title: 'Request',
        headerStyle: {
            backgroundColor: GLOBALS.Color.primary,
        },
        headerTitleStyle: {
            color: 'white',
        },
        headerBackTitleStyle: {
            color: 'white',
        },
        headerTintColor: 'white',
    };

    shareAddress() {
        Share.share({ message: this.state.address }).then(res => console.log(res)).catch(err => console.log(err))
    }

    CopyAddress() {
        console.log('copied')
        this.Default_Toast_Bottom(Language.t('Request.Toast'));
        Clipboard.setString(this.state.address)
    }

    render() {
        return (
            <ScrollView >
                <View style={style.container}>
                    <View style={style.FormAddress}>
                        <Text numberOfLines={1} style={{ flex: 8, fontFamily: GLOBALS.font.Poppins, fontSize: 15, alignContent: 'center' }} ellipsizeMode="middle" >{this.state.address} </Text>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={require('../../images/icon/wallet.png')} />
                        </View>
                    </View>
                    <View style={style.FormQR}>
                        <Text style={{ textAlign: 'center', fontFamily: GLOBALS.font.Poppins }}>{Language.t('Request.TitleCopy')}</Text>
                        {
                            this.state.address != '' ?
                                <TouchableOpacity onPress={this.CopyAddress.bind(this)} style={{ justifyContent: 'center', alignItems: 'center', margin: 20 }}>
                                    <QRCode
                                        value={this.state.address}
                                        size={200}
                                        bgColor='black'
                                        fgColor="white"
                                    />
                                </TouchableOpacity>
                                : null
                        }

                        <TouchableOpacity style={style.button} onPress={this.shareAddress.bind(this)}>
                            <Gradient
                                colors={['#0C449A', '#082B5F']}
                                style={{ flex: 1, paddingBottom: 30 / pt, paddingTop: 30 / pt, borderRadius: 5 }}
                                start={{ x: 0.7, y: 0.0 }}
                                end={{ x: 0.0, y: 0.0 }}
                            >
                                <Text style={style.TextButton}>{Language.t('Request.Share')}</Text>
                            </Gradient>
                        </TouchableOpacity>
                        {
                            Platform.OS == 'android' &&
                            <CustomToast ref="defaultToastBottom" position="top" />
                        }
                    </View>
                    {
                        Platform.OS == 'ios' &&
                        <CustomToast ref="defaultToastBottom" position="bottom" />
                    }
                </View>
            </ScrollView>
        )
    }
}
const style = StyleSheet.create({
    container: {
        flex: 1,
        alignContent: 'center',
        backgroundColor: '#fafafa',
        alignItems: 'center',
        padding: 10,
    },
    TextButton: {
        color: 'white',
        textAlign: 'center',
        fontSize: 15,
        flex: 1,
    },
    FormLogin: {
        width: GLOBALS.WIDTH,
        marginBottom: GLOBALS.HEIGHT / 20,
    },
    button: {
        // backgroundColor: GLOBALS.Color.primary,
        flexDirection: 'row-reverse',
        // justifyContent: 'center',
        // paddingBottom: 30 / pt,
        // paddingTop: 30 / pt,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.14,
        shadowRadius: 2.27,
        elevation: 3,
        borderRadius: 5,
        marginTop: 40 / pt,
    },
    FormAddress: {
        paddingTop: 40 / pt,
        paddingBottom: 40 / pt,
        paddingLeft: 28 / pt,
        paddingRight: 28 / pt,
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.14,
        shadowRadius: 2.27,
        elevation: 3,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',

    },
    FormQR: {
        backgroundColor: '#fff',
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.14,
        shadowRadius: 2.27,
        elevation: 5,
        marginTop: 10,
        justifyContent: 'space-around',
        paddingTop: 50 / pt,
        paddingBottom: 50 / pt,
        paddingLeft: 38 / pt,
        paddingRight: 38 / pt,
        alignItems: 'center',
    },
})
