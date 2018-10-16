import React, { Component } from 'react'
import { View, StyleSheet, Text, ScrollView, KeyboardAvoidingView, TouchableOpacity, Alert, Keyboard } from 'react-native';
import GLOBALS from '../../helper/variables';
import { GetInfoToken } from '../../services/wallet.service';
import { setData, getData, rmData } from '../../services/data.service'
import Language from '../../i18n/i18n'
import {
    Container,
    Header,
    Title,
    Content,
    Button,
    Left,
    Right,
    Body,
    Form,
    Item,
    Input,
    Label
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";


export default class Addtoken extends Component {

    render() {
        return (
            <Container style={{ backgroundColor: "#fff" }}>
                <Header style={{ backgroundColor: GLOBALS.Color.primary }}>
                    <Left>
                        <Button
                            transparent
                            onPress={() => { this.props.navigation.openDrawer(); Keyboard.dismiss() }}
                        >
                            <Icon name="bars" color='#fff' size={25}></Icon>
                        </Button>
                    </Left>
                    <Body>
                        <Title style={{ color: '#fff' }}>{Language.t("AddToken.Title")}</Title>
                    </Body>
                    <Right />
                </Header>

                <Body padder>
                    <ScrollView>
                        <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={65} enabled>
                            <FormAddToken />
                        </KeyboardAvoidingView>
                    </ScrollView>
                </Body>
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
        ABI: [],
        balance: ''
    }
    constructor(props) {
        super(props)

        this.state = this.initState
    };

    async setValue(val: string) {
        this.setState({ addressTK: val });
        if (val.length > 0) {
            GetInfoToken(val).then(async data => {
                if (data.symbol != null) {
                    await this.setState({ symbol: data.symbol, decimals: data.decimals, ABI: data.ABI, balance: data.balance, ValidToken: false, txtErr: '' }, () => {
                        this.disableButton()
                    })
                }
                else {
                    await this.setState({ ValidToken: true, txtErr: Language.t('AddToken.ValidToken') }, () => {
                        this.disableButton()
                    })
                }
            }).catch(async err => {
                console.log(err);
                await this.setState({ ValidToken: true, txtErr: Language.t('AddToken.ValidToken') }, () => {
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

    addToken() {
        getData('ListToken').then(async data => {
            if (data != null) {
                this.ListToken = JSON.parse(data);
                if (this.ListToken.findIndex(x => x['tokenAddress'] == this.state.addressTK) > -1) {
                    this.setState({ ExistToken: true });
                    Alert.alert(
                        Language.t('AddToken.AlerError.Title'),
                        Language.t('AddToken.AlerError.Content'),
                        [{ text: Language.t('AddToken.AlerError.TitleButton'), onPress: () => this.setState(this.initState), style: 'cancel' }]
                    )
                } else {
                    try {
                        await this.ListToken.push({
                            "tokenAddress": this.state.addressTK,
                            "balance": this.state.balance,
                            "symbol": this.state.symbol,
                            "decimals": this.state.decimals,
                            "ABI": this.state.ABI
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
            } else {
                try {
                    await this.ListToken.push({
                        'tokenAddress': this.state.addressTK,
                        'balance': this.state.balance,
                        'symbol': this.state.symbol,
                        'decimals': this.state.decimals,
                        'ABI': this.state.ABI
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
            <View>
                <View style={styles.FormLogin}>
                    <Item floatingLabel error={this.state.ValidToken}>
                        <Label style={{ fontFamily: GLOBALS.font.Poppins }}>{Language.t("AddToken.FormAdd.PlaceholderToken")}</Label>
                        <Input onChangeText={(value) => { this.setValue(value) }} value={this.state.addressTK} />
                    </Item>
                    <Item style={{ borderBottomWidth: 0 }} >
                        <Text style={{ color: GLOBALS.Color.danger }}>{this.state.txtErr}</Text>
                    </Item>
                    <Item floatingLabel disabled={true}>
                        <Label style={{ fontFamily: GLOBALS.font.Poppins }} >{Language.t("AddToken.FormAdd.PlaceholderSymbol")}</Label>
                        <Input disabled={true} value={this.state.symbol} />
                    </Item>
                </View>
                <View style={styles.AreaButton}>
                    <TouchableOpacity style={typeButton(GLOBALS.Color.secondary, this.state.typeButton).button} onPress={this.addToken.bind(this)} disabled={this.state.typeButton}>
                        <Text style={styles.TextButton}>{Language.t("AddToken.FormAdd.TitleButton")}</Text>
                    </TouchableOpacity>
                </View>
                {/* <View>
                    <TouchableOpacity onPress={() => { rmData('ListToken') }}>
                        <Text>Remove token</Text>
                    </TouchableOpacity>
                </View> */}
            </View>
        )
    }
}


var typeButton = (color, type) => StyleSheet.create({
    button: {
        backgroundColor: type == true ? '#cccccc' : color,
        marginBottom: GLOBALS.HEIGHT / 40,
        height: GLOBALS.HEIGHT / 17,
        justifyContent: 'center',
        width: GLOBALS.WIDTH / 1.6,
        shadowOffset: { width: 3, height: 3, },
        shadowColor: 'black',
        shadowOpacity: 0.2,
    }
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    TextButton: {
        color: 'white',
        textAlign: 'center',
        fontSize: 15,
        fontFamily: GLOBALS.font.Poppins
    },
    AreaButton: {
        alignItems: 'center',
    },
    FormLogin: {
        width: GLOBALS.WIDTH,
        marginBottom: GLOBALS.HEIGHT / 50,
        paddingLeft: GLOBALS.WIDTH / 20,
        paddingRight: GLOBALS.WIDTH / 20,
        marginTop: GLOBALS.HEIGHT / 25,
    }
})

