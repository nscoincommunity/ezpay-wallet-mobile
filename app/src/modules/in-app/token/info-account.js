import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Alert, Clipboard, TouchableHighlight } from 'react-native'
import Header from '../../../components/header';
import Color from '../../../../helpers/constant/color';
import ImageApp from '../../../../helpers/constant/image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Gradient from 'react-native-linear-gradient';
import { Remove_account_of_token } from './actions'
import { widthPercentageToDP as wp, heightPercentageToDP as hp, responsiveFontSize as font_size } from '../../../../helpers/constant/responsive'
import RBSheet from '../../../../lib/bottom-sheet'
import QRCode from 'react-native-qrcode-svg';
import FlashMessage, { showMessage } from '../../../../lib/flash-message'


export default class InforAccount extends Component {

    state = {
        copied: false
    }

    Remove_wallet = () => {
        const { section, funcReload } = this.props.navigation.getParam('payload');
        console.log(this.props.navigation.state.params)
        Remove_account_of_token(section.id).then(ss => {
            funcReload();
            this.props.navigation.goBack();
        })
    }

    Export_private = () => {
        Alert.alert(
            'WARNING!',
            `It is essential to understand that the private key is the most important and sensitive part of your account information.
Whoever has knowledge of a private has full contral over the associated funds and assets.
It is important for restoring your account so you should never lose it but also keep it top secret`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Continue', onPress: () => this.open_sheet(), style: 'destructive' }
            ]
        )
    }

    open_sheet = () => {
        this.setState({ copied: false })
        setTimeout(() => {
            this.RBSheet.open();
        }, 350);
    }

    func_Copy = (private_key) => {
        Clipboard.setString(private_key)
        this.setState({ copied: true })
    }


    render() {
        const { section, symbol, addressTK } = this.props.navigation.getParam('payload');
        console.log('section', section)
        return (
            <Gradient
                colors={Color.Gradient_backgound_page}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ flex: 1 }}
            >
                <FlashMessage position="top" style={{ zIndex: 999999 }} />
                <Header
                    IconLeft="arrow-back"
                    onPressLeft={() => this.props.navigation.goBack()}
                    Title={section.name}
                    styleTitle={{ color: Color.Tomato }}
                />
                <View style={{ flex: 1, padding: 10 }}>
                    <View style={styles.FormInfor}>
                        <View style={styles.styleRow}>
                            <Text style={{ flex: 2, fontWeight: 'bold' }}>Name:</Text>
                            <Text style={{ flex: 7 }}>{section.name}</Text>
                            <TouchableOpacity
                                style={{ flex: 1 }}
                            >
                                <Icon name="pencil" color={Color.Tomato} size={20} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.styleRow}>
                            <Text style={{ flex: 2, fontWeight: 'bold' }}>Address:</Text>
                            <Text style={{ flex: 8, color: Color.Dark_gray }} numberOfLines={1} ellipsizeMode="middle">{section.address}</Text>
                        </View>

                        <View style={styles.styleRow}>
                            <Text style={{ flex: 2, fontWeight: 'bold' }}>Type:</Text>
                            <Text style={{ flex: addressTK == '' ? 8 : 6, color: Color.Dark_gray }}>{symbol}</Text>
                            {
                                addressTK !== '' &&
                                <Text style={{ flex: 2, color: Color.Dark_gray }}>ERC20</Text>
                            }
                        </View>

                        <View style={styles.styleRow}>
                            <Text style={{ flex: 2, fontWeight: 'bold' }}>Balance:</Text>
                            <Text style={{ flex: 8, color: Color.Dark_gray }}>{section.balance}</Text>
                        </View>
                        <View style={{ padding: hp('1'), paddingHorizontal: wp('15') }}>
                            <TouchableOpacity
                                style={{
                                    shadowColor: '#000',
                                    shadowOffset: {
                                        width: 1,
                                        height: 2,
                                    },
                                    shadowOpacity: 0.21,
                                    shadowRadius: 5,
                                    elevation: 2,
                                }}
                                onPress={() => this.Export_private()}
                            >
                                <Gradient
                                    colors={Color.Gradient_button_tomato}
                                    style={styles.styleButton}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                >
                                    <Text style={{ color: '#fff', fontSize: font_size(2), }}>Export private key</Text>
                                </Gradient>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    shadowColor: '#000',
                                    shadowOffset: {
                                        width: 1,
                                        height: 2,
                                    },
                                    shadowOpacity: 0.21,
                                    shadowRadius: 5,
                                    elevation: 2,
                                }}
                                onPress={() => this.Remove_wallet()}
                            >
                                <Gradient
                                    colors={Color.Gradient_dark}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.styleButton}
                                >
                                    <Text style={{ color: '#fff', fontSize: font_size(2), }}>Remove</Text>
                                </Gradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <RBSheet
                    ref={ref => {
                        this.RBSheet = ref;
                    }}
                    closeOnDragDown={true}
                    height={hp('80')}
                    duration={250}
                    customStyles={{
                        container: {
                            borderTopLeftRadius: 5,
                            borderTopRightRadius: 5,
                            backgroundColor: Color.Tomato
                        }
                    }}
                >
                    <View
                        style={{
                            padding: hp('1'),
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <TouchableHighlight
                            onPress={() => this.RBSheet.close()}
                            underlayColor="transparent"
                        >
                            <View style={{
                                height: hp('0.7%'),
                                width: wp('10%'),
                                backgroundColor: '#fff',
                                borderRadius: 5
                            }} />
                        </TouchableHighlight>

                    </View>

                    <View style={{
                        flex: 1,
                        justifyContent: 'space-around',
                        paddingHorizontal: 5,
                        backgroundColor: '#fff',
                        borderTopLeftRadius: 5,
                        borderTopRightRadius: 5,
                    }}>
                        <View>
                            <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: font_size(4), color: '#000' }}>Your private key</Text>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <QRCode
                                value={section.private_key}
                                logoBackgroundColor='#fff'
                                backgroundColor='transparent'
                                size={wp('70')}
                            />
                            <Text
                                style={{ textAlign: 'center', marginVertical: hp('2') }}
                            >{section.private_key}</Text>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <TouchableOpacity
                                style={styles.styleButtonCopy}
                                onPress={() => this.func_Copy(section.private_key)}
                            >
                                <Text style={{ marginRight: 5 }}>
                                    {!this.state.copied ? 'Copy' : 'Copied'}
                                </Text>
                                <Icon
                                    name={!this.state.copied ? 'content-copy' : 'check-circle'}
                                    size={20}
                                    color={!this.state.copied ? Color.Dark_gray : Color.Success}
                                />
                            </TouchableOpacity>
                        </View>

                    </View>
                </RBSheet>
            </Gradient>
        )
    }
}

const styles = StyleSheet.create({
    FormInfor: {
        backgroundColor: '#fff',
        padding: hp('2'),
        borderRadius: 10,
    },
    styleRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: Color.Dark_gray,
        padding: hp('2')
    },
    FirstCol: {

    },
    SecondCol: {

    },
    EndCol: {

    },
    styleButton: {
        alignItems: 'center',
        borderRadius: 8,
        paddingVertical: hp('1.5'),
        marginVertical: hp('1.5'),
    },
    styleButtonCopy: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 50,
        paddingVertical: hp('1'),
        paddingHorizontal: wp('10'),
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
    }
})