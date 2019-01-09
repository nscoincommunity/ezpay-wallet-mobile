import React, { Component } from 'react'
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    KeyboardAvoidingView,
    TouchableOpacity,
    Alert,
    Keyboard,
    Platform,
    TextInput,
    PixelRatio,
    Image
} from 'react-native';
import GLOBALS from '../../helper/variables';
import { GetInfoToken } from '../../services/wallet.service';
import { setData, getData, rmData } from '../../services/data.service'
import Language from '../../i18n/i18n';
import IconFeather from "react-native-vector-icons/Feather"
import Gradient from 'react-native-linear-gradient'

import {
    Container,
    Header,
    Title,
    Content,
    Button,
    Left,
    Right,
    Body,
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";


export default class Addtoken extends Component {

    render() {
        return (
            <Container style={{ backgroundColor: "#fafafa" }}>
                <Header style={{ backgroundColor: '#fafafa', borderBottomWidth: 0, borderBottomColor: '#fff' }}>
                    <Left>
                        <Button
                            transparent
                            onPress={() => { this.props.navigation.openDrawer(); Keyboard.dismiss() }}
                        >
                            <IconFeather name="align-left" color={GLOBALS.Color.primary} size={25} />
                        </Button>
                    </Left>
                    <Body style={Platform.OS == 'ios' ? { flex: 3 } : {}}>
                        <Title style={{ color: GLOBALS.Color.primary }}>{Language.t('AddToken.Title')}</Title>
                    </Body>
                    <Right>
                        <Button
                            transparent
                            onPress={() => this.props.navigation.navigate('ListToken')}
                        >
                            <Icon name="list-alt" color={GLOBALS.Color.primary} size={25} />
                        </Button>
                    </Right>
                </Header>

                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flex: 1 }}>
                    <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={Platform.OS == "ios" ? 0 : GLOBALS.hp('-30%')} enabled style={{ flex: 1 }} contentContainerStyle={{ flex: 1 }}>
                        <FormAddToken />
                    </KeyboardAvoidingView>
                </ScrollView>
            </Container>
        )
    }
}

class FormAddToken extends Component {
    ListToken = [];
    initState = {
        addressTK: '',
        txtErr: '',
        symbol: '',
        decimals: '',
        typeButton: true,
        ValidToken: false,
        ExistToken: false,
        balance: ''
    }
    constructor(props) {
        super(props)

        this.state = this.initState
    };

    componentWillUnmount() {
        this.ListToken = []
    }
    async setValue(val: string) {
        this.setState({ addressTK: val });
        if (val.length > 0) {
            GetInfoToken(val).then(async data => {
                if (data.symbol != null) {
                    if (val == "0x73c99a8a9f82a4df0c6b5819f68ecc732d7bdc3d") {
                        await this.setState({ symbol: "NTF OLD", decimals: data.decimals, balance: data.balance, ValidToken: false, txtErr: '' }, () => {
                            this.disableButton()
                        })
                    } else {
                        await this.setState({ symbol: data.symbol, decimals: data.decimals, balance: data.balance, ValidToken: false, txtErr: '' }, () => {
                            this.disableButton()
                        })
                    }

                }
                else {
                    await this.setState({ ValidToken: true, txtErr: Language.t('AddToken.ValidToken'), symbol: '' }, () => {
                        this.disableButton()
                    })
                }
            }).catch(async err => {
                console.log(err);
                await this.setState({ ValidToken: true, txtErr: Language.t('AddToken.ValidToken'), symbol: '' }, () => {
                    this.disableButton()
                })
            })
        }
    }

    async disableButton() {
        if (this.state.ValidToken == true || this.state.ExistToken == true || this.state.symbol == '' || this.state.addressTK == '') {
            await this.setState({ typeButton: true })
        } else {
            await this.setState({ typeButton: false })
        }
    }

    addToken = () => {
        getData('ListToken').then(async data => {
            if (data != null) {
                this.ListToken = JSON.parse(data);
                if (this.ListToken.findIndex(x => x['tokenAddress'] == this.state.addressTK) > -1 || this.ListToken.findIndex(x => x['symbol'] == this.state.symbol) > -1) {
                    this.setState({ ExistToken: true });
                    Alert.alert(
                        Language.t('AddToken.AlerError.Title'),
                        Language.t('AddToken.AlerError.Content'),
                        [{ text: Language.t('AddToken.AlerError.TitleButton'), onPress: () => this.setState(this.initState), style: 'cancel' }]
                    )
                } else {
                    try {
                        console.log(this.ListToken)
                        await this.ListToken.push({
                            "tokenAddress": this.state.addressTK,
                            "balance": this.state.balance,
                            "symbol": this.state.symbol,
                            "decimals": this.state.decimals,
                            "ABI": ''
                        })
                        console.log(this.ListToken)
                        setData('ListToken', JSON.stringify(this.ListToken)).then(data => {
                            Alert.alert(
                                Language.t('AddToken.AlerSuccess.Title'),
                                Language.t('AddToken.AlerSuccess.Content'),
                                [{ text: Language.t('AddToken.AlerSuccess.TitleButton'), onPress: () => this.setState(this.initState), style: 'cancel' }]
                            )
                        })
                    } catch (error) {
                        Alert.alert(
                            Language.t('AddToken.AlerError.Title'),
                            error,
                            [{ text: Language.t('AddToken.AlerError.TitleButton'), onPress: () => this.setState(this.initState), style: 'cancel' }]
                        )
                    }
                }
            } else {
                try {
                    await this.ListToken.push({
                        'tokenAddress': this.state.addressTK,
                        'balance': this.state.balance,
                        'symbol': this.state.symbol,
                        'decimals': this.state.decimals,
                        'ABI': ''
                    })
                    setData('ListToken', JSON.stringify(this.ListToken)).then(data => {
                        Alert.alert(
                            Language.t('AddToken.AlerSuccess.Title'),
                            Language.t('AddToken.AlerSuccess.Content'),
                            [{ text: Language.t('AddToken.AlerSuccess.TitleButton'), onPress: () => this.setState(this.initState), style: 'cancel' }]
                        )
                    })
                } catch (error) {
                    Alert.alert(
                        Language.t('AddToken.AlerError.Title'),
                        error,
                        [{ text: Language.t('AddToken.AlerError.TitleButton'), onPress: () => this.setState(this.initState), style: 'cancel' }]
                    )
                }
            }
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.MainForm}>
                    <View style={{ alignItems: 'center', paddingVertical: GLOBALS.hp('5%') }}>
                        <Image
                            source={require('../../images/Add-token.png')}
                            resizeMode="contain"
                            style={{ height: GLOBALS.wp('40%'), width: GLOBALS.wp('40%') }} />
                    </View>
                    <View style={{
                        justifyContent: 'center',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        borderBottomWidth: 1,
                        borderBottomColor: '#d8d8d8',
                        paddingVertical: Platform.OS === 'ios' ? GLOBALS.hp('1.5%') : 'auto',
                    }}>
                        <TextInput
                            placeholder={Language.t("AddToken.FormAdd.PlaceholderToken")}
                            value={this.state.addressTK}
                            onChangeText={(value) => { this.setValue(value) }}
                            style={{ flex: 10, fontSize: PixelRatio.getFontScale() > 1 ? GLOBALS.hp('2%') : GLOBALS.hp('2.5%') }}
                            underlineColorAndroid="transparent"
                        />
                    </View>
                    <Text style={{ color: GLOBALS.Color.danger, textAlign: 'left' }}>{this.state.txtErr}</Text>

                    <View style={{
                        justifyContent: 'center',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        borderBottomWidth: 1,
                        borderBottomColor: '#d8d8d8',
                        paddingVertical: Platform.OS === 'ios' ? GLOBALS.hp('1.5%') : 'auto',
                    }}>
                        <TextInput
                            placeholder={Language.t("AddToken.FormAdd.PlaceholderSymbol")}
                            editable={false}
                            value={this.state.symbol}
                            style={{ flex: 10, fontSize: PixelRatio.getFontScale() > 1 ? GLOBALS.hp('2%') : GLOBALS.hp('2.5%'), }}
                            underlineColorAndroid="transparent"
                        />
                    </View>
                    <TouchableOpacity style={styles.button} onPress={this.addToken} disabled={this.state.typeButton}>
                        <Gradient
                            colors={this.state.typeButton ? ['#cccccc', '#cccccc'] : ['#0C449A', '#082B5F']}
                            start={{ x: 1, y: 0.7 }}
                            end={{ x: 0, y: 3 }}
                            style={{ paddingVertical: GLOBALS.hp('2%'), borderRadius: 5 }}
                        >
                            <Text style={styles.TextButton}>{Language.t('AddToken.FormAdd.TitleButton')}</Text>
                        </Gradient>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        // padding: GLOBALS.hp('4%'),
        // paddingTop: GLOBALS.hp('10%'),
        padding: GLOBALS.hp('2%'),
        backgroundColor: '#fafafa',
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
        justifyContent: 'center'
    },
    TextButton: {
        color: 'white',
        textAlign: 'center',
        fontSize: 15,
        fontFamily: GLOBALS.font.Poppins,
        fontWeight: '400',
    },
    button: {
        justifyContent: 'center',
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.44,
        shadowRadius: 1.27,
        elevation: 7,
        marginTop: GLOBALS.hp('5%'),
    }
})

