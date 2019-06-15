import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Clipboard } from 'react-native';
import Header from '../../../components/header';
import ImageApp from '../../../../helpers/constant/image';
import Color from '../../../../helpers/constant/color';
import Gradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { widthPercentageToDP as wp, heightPercentageToDP as hp, responsiveFontSize as font_size } from '../../../../helpers/constant/responsive'
import { insert_favorite, name_favorite } from '../../../../db'
import { Sae, Fumi } from '../../../components/text-input-effect'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { getBottomSpace } from 'react-native-iphone-x-helper'

export default class AddFavorite extends Component {
    constructor(props) {
        super(props);
        this.state = {
            txt_Address: '',
            txt_name: '',
            disable_btn_add: true
        };
    }

    enable_Button_Add = () => {
        if (this.state.txt_Address.length < 1 || this.state.txt_name.length < 1) {
            this.setState({ disable_btn_add: true })
        } else {
            this.setState({ disable_btn_add: false })
        }
    }

    change_txt_name = (value) => {
        this.setState({
            txt_name: value
        }, () => this.enable_Button_Add())
    }

    change_txt_address = (value) => {
        this.setState({
            txt_Address: value
        }, () => this.enable_Button_Add())
    }
    navigateToScan() {
        this.props.navigation.navigate('QRscan', { onSelect: this.onSelect });
    }

    onSelect = async data => {
        if (data['result'] == 'cancelScan') return;
        var data_qr = await data['result'];
        this.change_txt_address(data_qr)
    }

    Paste_address = async () => {
        var address = await Clipboard.getString();
        this.change_txt_address(address)
    }

    Func_Add = () => {
        console.log('aaaaa')
        const { reloadData } = this.props.navigation.getParam('payload');
        console.log(this.props.navigation.getParam('payload'))
        var object_favorite = {
            id: Math.floor(Date.now() / 1000),
            name: this.state.txt_name,
            address: this.state.txt_Address
        }
        insert_favorite(object_favorite).then(ss => {
            reloadData();
            this.props.navigation.goBack()
        }).catch(err => console.log(err))
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
                    Title="Add favorite"
                    styleTitle={{ color: Color.Tomato }}
                />
                <View style={{ flex: 1, padding: hp('1') }}>
                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={{ backgroundColor: '#fff', borderRadius: 5, marginTop: hp('3') }}>
                            <Fumi
                                ref={(r) => { this.name = r; }}
                                label={'Enter name'}
                                iconClass={FontAwesomeIcon}
                                iconName={'address-book'}
                                iconColor={'#f95a25'}
                                iconSize={20}
                                iconWidth={40}
                                inputPadding={16}
                                onChangeText={(value) => { this.change_txt_name(value) }}
                                value={this.state.txt_name}
                                onSubmitEditing={() => { this.address.focus() }}
                                returnKeyType="next"
                                numberOfLines={1}
                            />
                        </View>


                        <View style={{ backgroundColor: '#fff', borderRadius: 5, marginVertical: hp('2') }}>
                            <Fumi
                                ref={(r) => { this.address = r; }}
                                label={'Enter address'}
                                iconClass={FontAwesomeIcon}
                                iconName={'pencil'}
                                iconColor={'#f95a25'}
                                iconSize={20}
                                iconWidth={40}
                                inputPadding={16}
                                onChangeText={(value) => { this.change_txt_address(value) }}
                                value={this.state.txt_Address}
                                onSubmitEditing={() => { this.address.focus() }}
                                returnKeyType="done"
                                numberOfLines={1}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', paddingVertical: hp('1%') }}>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: Color.Cadet_blue,
                                    flex: 5,
                                    paddingVertical: hp('1%'),
                                    justifyContent: 'space-evenly',
                                    alignItems: 'center',
                                    borderRadius: 20,
                                    marginHorizontal: wp('2%'),
                                    flexDirection: 'row',
                                }}
                                onPress={() => this.Paste_address()}
                            >
                                <Text style={{ color: '#fff', fontSize: font_size(1.8) }}>Paste</Text>
                                <Icon name="content-paste" size={font_size(3)} color="#fff" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => this.navigateToScan()}
                                style={{
                                    backgroundColor: Color.Medium_turquoise,
                                    flex: 5,
                                    paddingVertical: 7,
                                    justifyContent: 'space-evenly',
                                    alignItems: 'center',
                                    borderRadius: 20,
                                    marginHorizontal: wp('2%'),
                                    flexDirection: 'row'
                                }}
                            >
                                <Text style={{ fontSize: font_size(1.8) }}>Scan QR</Text>
                                <Icon name="qrcode-scan" size={font_size(2.7)} />
                            </TouchableOpacity>
                        </View>
                        <View style={{
                            paddingHorizontal: wp('20'),
                            paddingVertical: hp('10')
                        }}>
                            <TouchableOpacity
                                onPress={() => this.Func_Add()}
                                disabled={this.state.disable_btn_add}
                            >
                                <Gradient
                                    colors={this.state.disable_btn_add ? Color.Gradient_gray_switch : Color.Gradient_button_tomato}
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
                                        <Text style={{ color: '#fff', fontSize: font_size('2.5') }}>Add</Text>
                                    </View>
                                    <View style={{ justifyContent: 'center' }}>
                                        <Icon name="arrow-right" size={font_size(3.5)} color="#fff" />
                                    </View>
                                </Gradient>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </Gradient>
        );
    }
}
