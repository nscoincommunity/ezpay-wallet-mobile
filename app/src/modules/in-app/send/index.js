import React, { Component } from 'react'
import {
    Text,
    StyleSheet,
    View,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Modal,
    TouchableHighlight,
    FlatList,
    KeyboardAvoidingView,
    Keyboard,
    Platform,
    Dimensions,
    Clipboard,
    Alert,
} from 'react-native'
import Header from '../../../components/header';
import ImageApp from '../../../../helpers/constant/image';
import Color from '../../../../helpers/constant/color';
import Gradient from 'react-native-linear-gradient';
import ButtonBottom from '../../../components/buttonBottom';
import { Sae } from '../../../components/text-input-effect'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { CheckBox } from 'native-base'
import { widthPercentageToDP as wp, heightPercentageToDP as hp, responsiveFontSize as font_size } from '../../../../helpers/constant/responsive'
import { isIphoneX } from 'react-native-iphone-x-helper'
import { KeyboardAwareScrollView } from '../../../components/Keyboard-Aware-Scroll'
import { CheckIsAddress, Check_fee_with_balance, Send_Token, Update_balance } from '../../../../services/index.account'
import RBSheet from '../../../../lib/bottom-sheet'
import { get_balance_wallet, insert_favorite, get_all_favorite, name_favorite } from '../../../../db'

const TransactionFee = [
    {
        title: 'Slow',
        fee: 0.00008,
        gasPrice: 4
    },
    {
        title: 'Average',
        fee: 0.00021,
        gasPrice: 10
    },
    {
        title: 'Fast',
        fee: 0.00042,
        gasPrice: 20
    }
]


export default class SendScreen extends Component {


    render() {
        const data = this.props.navigation.getParam('payload');
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
                    Title="Send"
                    styleTitle={{ color: Color.Tomato }}
                />
                <View style={{ flex: 1 }}>
                    <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={{ flex: 1, paddingHorizontal: wp('3%') }}
                        keyboardShouldPersistTaps="handled"
                    >
                        <FormSendIOS data={data} {...this.props} />
                    </ScrollView>
                </View>
            </Gradient>
        )
    }
}

const styleButton = (type) => StyleSheet.create({
    button: {
        flex: 3.3,
        // paddingHorizontal: 5,
        borderRadius: 20,
        backgroundColor: type ? Color.Vanilla_Ice : Color.Whisper,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        paddingVertical: 3,
        paddingHorizontal: 3
    },
    text: {
        color: type ? Color.Tomato : Color.Dark_gray,
        fontSize: font_size(1.5)
    }
})


const styles = StyleSheet.create({
    FormAddress: {
        flex: 3,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: hp('2%'),
        padding: hp('1%'),
        flexDirection: 'column'
    },
    FormAmount: {
        flex: 5,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: hp('1%'),
        flexDirection: 'column'
    }
})


const { height, width } = Dimensions.get('window')
let heightKeyboard = 0;
let locationInput = 0
class FormSendIOS extends Component {

    constructor(props) {
        super(props)

        this.state = {
            ...this.init_state,
            price_usd: this.props.data.price,
            paddingScroll: 0,
            selectFee: 'Average',
            gasPrice: this.props.data.network == 'ethereum' ? 10 : 0,
            checkbox: true,
            list_Favorite: []
        }
        console.log(this.props.data)
    }

    init_state = {
        txt_Address: '',
        err_Txt_Address: false,
        txt_Amount: '',
        err_Txt_Amount: false,
        txt_Desc: '',
        disable_btn_send: true
    }

    componentWillMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
            heightKeyboard = e.endCoordinates.height;
            if (locationInput + 50 > height - heightKeyboard) {
                this.setState({ paddingScroll: 50 })
            } else {
                this.setState({ paddingScroll: 0 })
            }
        });
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            this.setState({ paddingScroll: 0 })
        });

        get_all_favorite().then(data => {
            this.setState({ list_Favorite: data })
        })
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    onSelect = async data => {
        if (data['result'] == 'cancelScan') return;
        var data_qr = await data['result'];
        try {
            data_qr = await JSON.parse(data_qr);
            await this.change_txt_address(data_qr.to);
            await this.change_txt_amount(data_qr.value);
            if (data_qr.description != '') {
                await Alert.alert(
                    'Message',
                    data_qr.description,
                    [{ text: 'Ok', style: 'cancel' }]
                )
            }
        } catch (error) {
            this.change_txt_address(data_qr)
        }
    }

    navigateToScan() {
        this.props.navigation.navigate('QRscan', { onSelect: this.onSelect });
    }

    SelectFee = (title, fee, gasPrice) => {
        const { item, addressTK, network, decimals } = this.props.data
        this.setState({ selectFee: title })
        Check_fee_with_balance(fee, item.address, addressTK, network, decimals).then(ss => {
            if (!ss) {
                Alert.alert(
                    'Error',
                    'Insufficient balance.',
                    [{ text: 'Ok', style: 'cancel' }]
                )
            } else {
                this.setState({ gasPrice: gasPrice })
            }
        }).catch(e => console.log(e))
    }

    change_txt_address = async (value) => {
        const { network } = this.props.data;
        CheckIsAddress(value, network).then(async status => {
            if (status) {
                await this.setState({ txt_Address: value, err_Txt_Address: false })
            } else {
                await this.setState({ txt_Address: value, err_Txt_Address: true })
            }
        })
        await this.enable_Button_Send()
    }

    enable_Button_Send = () => {
        if (
            this.state.err_Txt_Address == true ||
            this.state.err_Txt_Amount == true ||
            this.state.txt_Address.length < 1 ||
            parseFloat(this.state.txt_Amount) <= 0 ||
            this.state.txt_Amount.length < 1
        ) {
            // console.log('if', this.state.err_Txt_Address,
            //     this.state.err_Txt_Amount,
            //     this.state.txt_Address,
            //     this.state.txt_Amount)
            this.setState({ disable_btn_send: true })
        } else {
            // console.log('else', this.state.err_Txt_Address,
            //     this.state.err_Txt_Amount,
            //     this.state.txt_Address,
            //     this.state.txt_Amount)
            this.setState({ disable_btn_send: false })
        }
    }

    setMaxBalance = () => {
        const data = this.props.data
        get_balance_wallet(data.item.id).then(balance => {
            this.change_txt_amount(balance)
        })
    }


    SendToken = () => {
        const { item, addressTK, network, decimals } = this.props.data
        Send_Token(
            item.address,
            this.state.txt_Address,
            this.state.txt_Amount,
            addressTK,
            item.private_key,
            network,
            decimals,
            this.state.gasPrice
        )
            .then(async TransactionHash => {
                console.log(TransactionHash)
                if (this.state.checkbox) {
                    var favorite_object = {
                        id: Math.floor(Date.now() / 1000),
                        name: `Favorite ${await name_favorite() + 1}`,
                        address: this.state.txt_Address
                    }
                    await insert_favorite(favorite_object).then(ss2 => {
                        console.log(ss2)
                    }).catch(err => console.log(err))
                }
                await Alert.alert(
                    'Send success',
                    TransactionHash,
                    [
                        { text: 'Ok', style: 'cancel' },
                        { text: 'Copy', onPress: () => { Clipboard.setString(TransactionHash) }, style: 'cancel' }
                    ]
                )
                await this.setState(this.init_state);
            }).catch(e => {
                Alert.alert(
                    'Error',
                    e,
                    [{ text: 'Ok', style: 'cancel' }]
                )
            })
    }

    change_txt_desc = (value) => {
        this.setState({ txt_Desc: value })
    }

    change_txt_amount = async (value) => {
        const data = this.props.data;
        if (value > 0) {
            get_balance_wallet(data.item.id).then(async balance => {
                if (parseFloat(value) <= parseFloat(balance)) {
                    await this.setState({
                        price_usd: parseFloat(value) * parseFloat(data.price),
                        txt_Amount: value,
                        err_Txt_Amount: false
                    }, () => {
                        this.enable_Button_Send()
                    })
                } else {
                    await this.setState({
                        price_usd: parseFloat(value) * parseFloat(data.price),
                        txt_Amount: value,
                        err_Txt_Amount: true
                    }, () => {
                        this.enable_Button_Send()
                    })
                }
            }).catch(console.log)
        } else {
            await this.setState({
                price_usd: data.price,
                txt_Amount: value,
                err_Txt_Amount: false
            }, () => {
                this.enable_Button_Send()
            })
        }
    }

    clear_txt_address = () => {
        this.change_txt_address('')
    }

    paste_txt_address = async () => {
        let val = await Clipboard.getString()
        await this.change_txt_address(val)
    }


    onTouch_Input = async (evt) => {
        locationInput = await evt.nativeEvent.pageY;
        if (heightKeyboard > 0) {
            if (locationInput + 50 > height - heightKeyboard) {
                this.setState({ paddingScroll: 50 })
            } else {
                this.setState({ paddingScroll: -50 })
            }
        }
    }

    chooseAddress = (address) => {
        this.RBSheet.close()
        this.change_txt_address(address)
    }

    focusTheField = (id) => {
        this.inputs[id].focus();
    }
    inputs = {};

    render() {
        const data = this.props.data
        return (
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                contentContainerStyle={{ flex: 1 }}
                behavior={'position'}
                enabled={this.state.paddingScroll > 0 ? true : false}
            // keyboardVerticalOffset={this.state.paddingScroll}
            // ref={(r)=>this.Avoiding = r}
            >
                <View style={styles.FormAddress}>
                    <View style={{
                        flex: 4.5,
                        flexDirection: 'row',
                        borderBottomWidth: 1,
                        borderBottomColor: this.state.err_Txt_Address ? Color.Scarlet : Color.SILVER
                    }}>
                        <View style={{ flex: this.state.txt_Address.length > 0 ? 9 : 8 }}>
                            <Sae
                                ref={(r) => { this.address = r; }}
                                label={'Enter Address'}
                                iconClass={Icon}
                                iconName={'pencil'}
                                iconColor={Color.Whisper}
                                labelStyle={{ color: Color.Whisper }}
                                inputStyle={{ color: Color.Tomato, paddingBottom: 0, }}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                onChangeText={(value) => { this.change_txt_address(value) }}
                                showBorderBottom={false}
                                style={{ flex: this.state.txt_Address.length > 0 ? 9 : 8 }}
                                value={this.state.txt_Address}
                                onTouchStart={e => this.onTouch_Input(e)}
                                onSubmitEditing={() => { this.amount.focus() }}
                                returnKeyType="next"
                                numberOfLines={1}
                            />

                        </View>
                        <View style={{ flex: this.state.txt_Address.length > 0 ? 1 : 2, justifyContent: 'center', alignItems: 'center', paddingTop: hp('3%') }}>
                            {
                                this.state.txt_Address.length > 0 ?
                                    <TouchableOpacity
                                        onPress={() => this.clear_txt_address()}
                                    >
                                        <Icon name="close-circle-outline" size={font_size(3)} color={Color.Scarlet} />
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity
                                        onPress={() => this.paste_txt_address()}
                                    >
                                        <Text style={{ color: Color.Tomato }}>Paste</Text>
                                    </TouchableOpacity>
                            }
                        </View>

                    </View>

                    <View style={{ flex: 2.5, flexDirection: 'row', paddingVertical: hp('1%') }}>
                        <TouchableOpacity
                            onPress={() => this.RBSheet.open()}
                            style={{
                                backgroundColor: Color.Whisper,
                                flex: 5,
                                paddingVertical: hp('1%'),
                                justifyContent: 'space-evenly',
                                alignItems: 'center',
                                borderRadius: 20,
                                marginHorizontal: wp('2%'),
                                flexDirection: 'row',
                            }}
                        >
                            <View>
                                <Text style={{ color: Color.Dark_gray, fontSize: font_size(1.8) }}>Favorite</Text>
                            </View>
                            <View>
                                <Icon name="account-box-outline" size={font_size(2.5)} />
                            </View>
                        </TouchableOpacity >
                        <TouchableOpacity
                            onPress={() => this.navigateToScan()}
                            style={{
                                backgroundColor: Color.Whisper,
                                flex: 5,
                                paddingVertical: 7,
                                justifyContent: 'space-evenly',
                                alignItems: 'center',
                                borderRadius: 20,
                                marginHorizontal: wp('2%'),
                                flexDirection: 'row'
                            }}
                        >
                            <View>
                                <Text style={{ color: Color.Dark_gray, fontSize: font_size(1.8) }}>Scan QR</Text>
                            </View>
                            <View>
                                <Icon name="qrcode-scan" size={font_size(2.5)} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 3, flexDirection: 'row', alignItems: 'center' }}>
                        <Text>Add contact to <Text style={{ fontWeight: 'bold' }}>favorite</Text></Text>
                        <CheckBox checked={this.state.checkbox} color={Color.Malachite} onPress={() => this.setState({ checkbox: !this.state.checkbox })} />
                    </View>
                </View>
                <View style={styles.FormAmount}>
                    {/************* Start input Amount *************/}
                    <View style={{ flex: 4, justifyContent: 'center' }}>
                        <View style={{
                            borderBottomWidth: 1,
                            flexDirection: 'row',
                            borderBottomColor: this.state.err_Txt_Amount ? Color.Scarlet : Color.SILVER
                        }}>
                            <Sae
                                ref={(r) => { this.amount = r; }}
                                label={data.symbol}
                                iconClass={Icon}
                                iconName={'pencil'}
                                iconColor={Color.Whisper}
                                // labelHeight={20}
                                labelStyle={{ color: Color.Whisper }}
                                inputStyle={{ color: Color.Tomato, borderBottomWidth: 0, fontSize: font_size(3.5), paddingBottom: 0, }}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                onChangeText={(value) => { this.change_txt_amount(value) }}
                                value={this.state.txt_Amount.toString()}
                                style={{ flex: 9 }}
                                keyboardType="numeric"
                                showBorderBottom={false}
                                onResponderEnd={e => this.onTouch_Input(e)}
                            />
                            <TouchableOpacity
                                onPress={this.setMaxBalance}
                                style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                }}>
                                <Text style={{ color: Color.Tomato }}>Max</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ flex: 9, fontSize: font_size(1.5) }}>~{this.state.price_usd}</Text>
                            <Text style={{ flex: 1, fontSize: font_size(1.5) }}>USD</Text>
                        </View>
                    </View>

                    {/************* End input Amount *************/}


                    {/************* Start input Description *************/}
                    <View style={{ flex: 3, }}>
                        <View style={{ borderBottomWidth: 1, flexDirection: 'row' }}>
                            <Sae
                                ref={(r) => { this.note = r; }}
                                label={'Description'}
                                iconClass={Icon}
                                iconName={'pencil'}
                                iconColor={Color.Whisper}
                                labelStyle={{ color: Color.Whisper }}
                                inputStyle={{ color: Color.Tomato, paddingBottom: 0, }}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                onChangeText={(value) => { this.change_txt_desc(value) }}
                                style={{ flex: 9 }}
                                showBorderBottom={false}
                                onResponderEnd={e => this.onTouch_Input(e)}
                                value={this.state.txt_Desc}
                            />
                        </View>
                    </View>
                    {/************* Start input Description *************/}

                    <View style={{ flex: 3, }}>
                        <Text style={{ textAlign: 'center', }}>Transaction Fee</Text>

                        <View style={{ flexDirection: 'row', paddingVertical: hp('1%') }}>
                            {
                                TransactionFee.map((item, index) => {
                                    let symbolFee;
                                    let itemFee;
                                    let itemGasPrice;
                                    switch (data.network) {
                                        case 'ethereum':
                                            symbolFee = 'ETH';
                                            itemFee = item.fee;
                                            itemGasPrice = item.gasPrice;
                                            break;
                                        case 'nexty':
                                            symbolFee = 'NTY';
                                            item.fee = 0;
                                            item.gasPrice = 0
                                            break;
                                        default:
                                            symbolFee = 'TRX';
                                            itemFee = 0;
                                            itemGasPrice = 0;
                                            break;
                                    }
                                    return (
                                        <TouchableOpacity
                                            key={index.toString()}
                                            style={[styleButton(this.state.selectFee === item.title).button]}
                                            onPress={() => this.SelectFee(item.title, itemFee, itemGasPrice)}
                                        >
                                            <Text style={[styleButton(this.state.selectFee === item.title).text]}>{item.title}</Text>
                                            <Text style={[styleButton(this.state.selectFee === item.title).text]}>{itemFee + ' ' + symbolFee}</Text>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </View>
                    </View>
                </View>
                <View style={{ flex: 2, justifyContent: 'center', paddingHorizontal: wp('20%') }}>
                    <TouchableOpacity
                        onPress={() => this.SendToken()}
                        disabled={this.state.disable_btn_send}
                    >
                        <Gradient
                            colors={this.state.disable_btn_send ? Color.Gradient_gray_switch : Color.Gradient_button_tomato}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{
                                paddingHorizontal: wp('3%'),
                                paddingVertical: hp('1.5%'),
                                borderRadius: 7,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}
                        >
                            <View style={{ justifyContent: 'center' }}>
                                <Text style={{ color: '#fff', fontSize: font_size('2.5') }}>Next</Text>
                            </View>
                            <View style={{ justifyContent: 'center' }}>
                                <Icon name="arrow-right" size={font_size(3.5)} color="#fff" />
                            </View>
                        </Gradient>
                    </TouchableOpacity>
                </View>
                <RBSheet
                    ref={ref => {
                        this.RBSheet = ref;
                    }}
                    closeOnDragDown={true}
                    height={500}
                    duration={250}
                    customStyles={{
                        container: {
                            // justifyContent: "center",
                            // alignItems: "center",
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
                        paddingHorizontal: 5,
                        backgroundColor: '#fff',
                        borderTopLeftRadius: 5,
                        borderTopRightRadius: 5,
                        flex: 1
                    }}>
                        <View style={{ padding: 5 }}>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'bold' }}>List favorite</Text>
                            </View>
                        </View>
                        {
                            this.state.list_Favorite.length > 0 ?
                                <FlatList
                                    data={this.state.list_Favorite}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <TouchableOpacity
                                                style={{
                                                    paddingVertical: 10,
                                                    borderBottomWidth: 1,
                                                    borderBottomColor: Color.Light_gray
                                                }}
                                                onPress={() => this.chooseAddress(item.address)}
                                            >
                                                <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                                                <Text numberOfLines={1} ellipsizeMode="middle" style={{ color: Color.Dark_gray }}>{item.address}</Text>
                                            </TouchableOpacity>
                                        )
                                    }}
                                />
                                :
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Icon name="select" size={font_size(25)} />
                                </View>
                        }

                    </View>
                </RBSheet>
            </KeyboardAvoidingView>
        )
    }
}

class FormSendAndroid extends Component {
    state = {
        disableButton: false,
        selectFee: 'Average',
        localtionInput: 0,
        checkbox: true,
    }
    SelectFee = (fee) => {
        this.setState({ selectFee: fee })
    }
    ChangeText = (value) => {

    }
    render() {
        return (
            <KeyboardAvoidingView style={{ flex: 1 }} contentContainerStyle={{ flex: 1 }}>
                <View style={{
                    height: hp('25%'),
                    backgroundColor: '#fff',
                    borderRadius: 8,
                    marginBottom: hp('2%'),
                    padding: hp('1%'),
                    flexDirection: 'column'
                }}>
                    <View style={{ flex: 4, }}>
                        <Sae
                            ref={(r) => { this.address = r; }}
                            label={'Enter Address'}
                            iconClass={Icon}
                            iconName={'pencil'}
                            iconColor={Color.Whisper}
                            labelStyle={{ color: Color.Whisper }}
                            inputStyle={{ color: Color.Tomato }}
                            // active border height
                            // TextInput props
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            onChangeText={(value) => { this.ChangeText(value) }}
                        // onResponderEnd={e => this.ResponderInput(e)}
                        // style={{ backgroundColor: 'red' }}
                        />
                    </View>

                    <View style={{ flex: 3, flexDirection: 'row', paddingVertical: hp('1%') }}>
                        <TouchableOpacity style={{
                            backgroundColor: Color.Whisper,
                            flex: 4.5,
                            paddingVertical: hp('1%'),
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 20
                        }}>
                            <Text style={{ color: Color.Dark_gray }}>Paste</Text>
                        </TouchableOpacity >
                        <TouchableOpacity style={{
                            backgroundColor: Color.Whisper,
                            flex: 4.5,
                            paddingVertical: 7,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 20,
                            marginHorizontal: 15
                        }}>
                            <Text style={{ color: Color.Dark_gray }}>Address book</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        >
                            <Icon name="qrcode" size={25} color={Color.Dark_gray} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 3, flexDirection: 'row', alignItems: 'center' }}>
                        <Text>Add contact to address book</Text>
                        <CheckBox checked={this.state.checkbox} color={Color.Malachite} onPress={() => this.setState({ checkbox: !this.state.checkbox })} />
                    </View>
                </View>
                <View style={{
                    height: hp('43%'),
                    backgroundColor: '#fff',
                    borderRadius: 8,
                    marginBottom: hp('2%'),
                    padding: hp('1%'),
                    flexDirection: 'column'
                }}>
                    {/************* Start input Amount *************/}
                    <View style={{ flex: 3, }}>
                        <View style={{ borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'center' }}>
                            <Sae
                                ref={(r) => { this.amount = r; }}
                                label={'Amount'}
                                iconClass={Icon}
                                iconName={'pencil'}
                                iconColor={Color.Whisper}
                                // labelHeight={20}
                                labelStyle={{ color: Color.Whisper }}
                                inputStyle={{ color: Color.Tomato, borderBottomWidth: 0, fontSize: 25, }}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                onChangeText={(value) => { this.ChangeText(value) }}
                                style={{ flex: 9 }}
                                keyboardType="numeric"
                                showBorderBottom={false}
                            // onResponderEnd={e => this.ResponderInput(e)}

                            />
                            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                                <Text>ETH</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ flex: 9, fontSize: font_size(1.5) }}>~2323875.000</Text>
                            <Text style={{ flex: 1, fontSize: font_size(1.5) }}>USD</Text>
                        </View>
                    </View>

                    {/************* End input Amount *************/}


                    {/************* Start input Description *************/}
                    <View style={{ flex: 3, }}>
                        <View style={{ borderBottomWidth: 1, flexDirection: 'row' }}>
                            <Sae
                                ref={(r) => { this.note = r; }}
                                label={'Description'}
                                iconClass={Icon}
                                iconName={'pencil'}
                                iconColor={Color.Whisper}
                                labelStyle={{ color: Color.Whisper }}
                                inputStyle={{ color: Color.Tomato, borderBottomWidth: 0, }}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                onChangeText={(value) => { this.ChangeText(value) }}
                                style={{ flex: 9 }}
                                showBorderBottom={false}
                            // onResponderEnd={e => this.ResponderInput(e)}
                            />
                        </View>
                    </View>
                    {/************* Start input Description *************/}

                    <View style={{ flex: 3, }}>
                        <Text style={{ textAlign: 'center', }}>Transaction Fee</Text>

                        <View style={{ flexDirection: 'row', paddingVertical: hp('1%') }}>
                            {
                                TransactionFee.map((item, index) => {
                                    return (
                                        <TouchableOpacity
                                            key={index.toString()}
                                            style={[styleButton(this.state.selectFee === item.title).button]}
                                            onPress={() => this.SelectFee(item.title)}
                                        >
                                            <Text style={[styleButton(this.state.selectFee === item.title).text]}>{item.title}</Text>
                                            <Text style={[styleButton(this.state.selectFee === item.title).text]}>{item.fee} ETH</Text>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </View>
                    </View>
                </View>
                <View style={{ height: hp('13%'), justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity
                        style={{
                            backgroundColor: 'orange',
                            borderRadius: 5
                        }}
                    >
                        <Gradient
                            colors={Color.Gradient_button_tomato}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{ paddingHorizontal: wp('25%'), paddingVertical: hp('2%'), borderRadius: 7 }}
                        >
                            <Text style={{ color: '#fff' }}>Next</Text>
                        </Gradient>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        )
    }
}
