import React, { Component } from 'react'
import {
    Text,
    StyleSheet,
    View,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Clipboard,
    FlatList
} from 'react-native'
import Header from '../../../components/header';
import ImageApp from '../../../../helpers/constant/image';
import Color from '../../../../helpers/constant/color';
import Gradient from 'react-native-linear-gradient';
import ButtonBottom from '../../../components/buttonBottom';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RBSheet from '../../../../lib/bottom-sheet'
import { CheckIsAddress } from '../../../../services/index.account'

interface dataSend {
    from: string,
    to: string,
    token?: string,
    value: number,
    gas: number,
    chain: number,
    description: string
}

interface ObjectSend {
    network: string,
    symbol: string,
    address?: string,
    decimals: number,
    dataSend: dataSend
}

const ListAddress = [
    {
        name: 'ahihi',
        address: '0x371Fd45453fCe637E6035779eE0a9eeE53665Ae9'
    },
    {
        name: 'ahaha',
        address: '0x7c0c79776e463f1a7da96a0aff325743dd3d7082'
    },
    {
        name: 'dau',
        address: '0x5316c4ad1BB635978558188585D2Ed42DAf9faAA'
    }
]

export default class ToAddress extends Component {
    Obj_send: ObjectSend = {

    }

    constructor(props) {
        super(props)
        this.state = {
            textInput: '',
            disableButton: false,
            error: ''
        }
    }
    componentWillMount() {
        const { item, symbol, decimals, addressTK, network } = this.props.navigation.getParam('payload')
        this.Obj_send.symbol = symbol;
        this.Obj_send.decimals = decimals;
        this.Obj_send.address = addressTK;
        this.Obj_send.network = network
    }

    clear_text_input = () => {
        this.setState({ textInput: '' })
    }

    Paste_input = async () => {
        let val = await Clipboard.getString()
        await this.ChangeText(val)
    }


    ChangeText = async (val) => {
        this.setState({ textInput: val })
        var isWallet = await CheckIsAddress(val, this.Obj_send.network)
        if (isWallet) {
            this.setState({ disableButton: false, error: '' }, () => {
                this.Obj_send.dataSend.to = val;
            })
        } else {
            this.setState({ disableButton: true, error: 'Invalid address' })
        }
    }

    onSelect = () => {
        if (data['result'] !== 'cancelScan') {
            console.log(data)
            var result = data['result']
            this.ChangeText(result)
        }
    }

    addressbook = () => {
        this.RBSheet.open()
    }
    goToSend = () => {
        this.navigation.navigate()
    }

    chooseAddress = (address) => {
        this.RBSheet.close()
        this.ChangeText(address)
    }

    render() {
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
                    Title="Choose address"
                    styleTitle={{ color: Color.Tomato }}
                />
                <View style={styles.container}>
                    <ScrollView>
                        <View style={{ backgroundColor: '#fff', borderRadius: 5, padding: 10, paddingVertical: 20, flexDirection: 'row' }}>
                            <TextInput
                                style={{ color: Color.DARKBLUE, flex: 8 }}
                                numberOfLines={5}
                                multiline={true}
                                onChangeText={(val) => this.ChangeText(val)}
                                value={this.state.textInput}
                            />
                            {
                                this.state.textInput.length > 0 ?
                                    <TouchableOpacity
                                        style={{ flex: 1, justifyContent: 'center' }}
                                        onPress={() => this.clear_text_input()}
                                    >
                                        <Icon name="close-circle" size={25} />
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity
                                        onPress={() => this.Paste_input()}
                                        style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}
                                    >
                                        <Text style={{ color: Color.DARKBLUE }}>Paste</Text>
                                    </TouchableOpacity>
                            }

                        </View>
                        {
                            this.state.disableButton == true && this.state.error != '' &&
                            <Text style={{ color: 'red' }}>{this.state.error}</Text>
                        }
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 20, flexDirection: 'row' }}>
                            <TouchableOpacity
                                style={{ flex: 5 }}
                                onPress={() => this.props.navigation.navigate('QRscan', { onSelect: this.onSelect })}
                            >
                                <Gradient
                                    colors={Color.Gradient_clear_sky}
                                    style={styles.styleButton}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                >
                                    <View style={{ justifyContent: 'center', marginRight: 5 }}>
                                        <Text style={{ color: '#fff', }}>Scan QR code</Text>
                                    </View>
                                    <Icon name="qrcode-scan" size={20} style={{ color: '#fff', textAlign: 'center' }} />
                                </Gradient>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ flex: 5 }}
                                onPress={() => this.addressbook()}
                            >
                                <Gradient
                                    colors={Color.Gradient_master_card}
                                    style={styles.styleButton}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                >
                                    <View style={{ justifyContent: 'center', marginRight: 5 }}>
                                        <Text style={{ color: '#fff' }}>Address book</Text>
                                    </View>
                                    <Icon name="notebook" size={20} style={{ color: '#fff', textAlign: 'center' }} />
                                </Gradient>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                    <ButtonBottom
                        text="Confirm"
                        onPress={this.goToSend}
                        disable={this.state.disableButton}
                    />
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
                            }
                        }}
                    >
                        <View style={{ flexDirection: 'row', padding: 5 }}>
                            <View style={{ flex: 1 }}>
                                <Icon name="close-circle" size={30} color={Color.Danger} />
                            </View>
                            <View style={{ flex: 9, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'bold' }}>Address book</Text>
                            </View>
                        </View>
                        <View style={{ paddingHorizontal: 5 }}>
                            <FlatList
                                data={ListAddress}
                                extraData={(item, index) => index.toString()}
                                renderItem={({ item, index }) => {
                                    return (
                                        // <TouchableOpacity
                                        //     style={{
                                        //         paddingVertical: 10,
                                        //         borderBottomWidth: 1,
                                        //         borderBottomColor: Color.Light_gray
                                        //     }}
                                        //     onPress={() => this.chooseAddress(item.address)}
                                        // >
                                        //     <Text>{item.address}</Text>
                                        // </View>
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
                        </View>
                    </RBSheet>
                </View>
            </Gradient>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10
    },
    styleButton: {
        flexDirection: 'row',
        paddingHorizontal: 25,
        paddingVertical: 10,
        borderRadius: 20,
        justifyContent: 'center',
        marginHorizontal: 5
    }
})
