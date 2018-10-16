import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Share, Clipboard } from 'react-native';
// import Icon from "react-native-vector-icons/FontAwesome";
import GLOBALS from '../../helper/variables';
import QRCode from 'react-native-qrcode';
import { getData } from '../../services/data.service';
import { showToastBottom } from '../../services/loading.service';
import { Toast, Root } from 'native-base';
import Language from '../../i18n/i18n';

export default class request extends Component {
    constructor(props) {
        super(props)

        this.state = {
            address: ''
        };
        try {
            getData('current').then(data => {
                this.setState({ address: data })
            })
        } catch (error) {
            this.setState({ address: '' })
        }
    };


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

        showToastBottom(Language.t('Request.Toast'));

        Clipboard.setString(this.state.address)
    }

    render() {
        return (
            <Root>
                <View style={style.container}>
                    <Text style={{ marginTop: GLOBALS.HEIGHT / 20, marginBottom: GLOBALS.HEIGHT / 40, textAlign: 'center', fontFamily: GLOBALS.font.Poppins }}>{Language.t('Request.TitleCopy')}</Text>
                    <TouchableOpacity onPress={this.CopyAddress.bind(this)}>
                        <QRCode
                            value={this.state.address}
                            size={200}
                            bgColor='black'
                            fgColor="white"
                        />
                    </TouchableOpacity>
                    <Text style={{ marginBottom: GLOBALS.HEIGHT / 40, marginTop: GLOBALS.HEIGHT / 40, fontFamily: GLOBALS.font.Poppins, textAlign: 'center' }} >{this.state.address}</Text>

                    <View style={style.FormRouter}>
                        <TouchableOpacity style={style.button} onPress={this.shareAddress.bind(this)}>
                            <Text style={style.TextButton}>{Language.t('Request.Share')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Root>
        )
    }
}
const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
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
    button: {
        backgroundColor: GLOBALS.Color.secondary,
        marginBottom: GLOBALS.HEIGHT / 40,
        height: GLOBALS.HEIGHT / 17,
        justifyContent: 'center',
        width: GLOBALS.WIDTH / 1.6,
        shadowOffset: { width: 3, height: 3, },
        shadowColor: 'black',
        shadowOpacity: 0.2,
    }
})
