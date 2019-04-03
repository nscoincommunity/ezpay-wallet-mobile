import React, { Component } from 'react';
import { View, Text, StatusBar, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { connect } from 'react-redux';
import { getStatusBarHeight } from 'react-native-iphone-x-helper'
import GLOBAL from '../../helper/variables'
import Header from '../../components/header';
import Gradient from 'react-native-linear-gradient';
import { RemoveWallet } from '../../services/auth.service'
import Dialog from "react-native-dialog";
import { SelectAllWallet, DeleteWallet } from '../../../realm/walletSchema'
import Language from '../../i18n/i18n';
import { bindActionCreators } from 'redux';
import { fetchAllWallet } from '../../../redux/actions/slideWalletAction'

interface item {
    bg_net: any,
    img_net: any,
    color_text_backup: string,
    name_token: string,
    color_gradient: Array
}


class PageDeleteWL extends Component {
    state = {
        listWallet: [],
        dialogVisible: false,
        passcode: '',
        id: ''
    }

    componentWillMount() {
        this.loadData()
    }

    loadData() {
        SelectAllWallet().then(data => {
            this.setState({ listWallet: data })
        })
    }

    DeleteWallet(id) {
        DeleteWallet(id).then(ss => {
            console.log(ss)
            this.loadData()
        }).catch(e => console.log(e))
    }
    async handleOK() {
        if (this.state.passcode == '') {
            Alert.alert(
                Language.t('Send.AlerError.Error'),
                Language.t('PrivateKey.Aler.Content'),
                [
                    { text: Language.t('PrivateKey.Aler.TitleButtonCancel'), onPress: () => { this.setState({ dialogVisible: false, privatekey: '' }) }, style: 'cancel' },
                    { text: Language.t('PrivateKey.Aler.TitleButtonTry'), onPress: () => this.setState({ dialogVisible: true, passcode: '' }) }
                ]
            )
            return;
        }
        await RemoveWallet(this.state.id, this.state.passcode)
            .then(ss => {
                this.setState({ dialogVisible: false, passcode: '' }, () => {
                    setTimeout(() => {
                        Alert.alert(
                            Language.t("ManageWallet.AlertSuccess.title"),
                            Language.t("ManageWallet.AlertSuccess.content"),
                            [{ text: 'Ok', onPress: () => { this.loadData(); this.props.fetchAllWallet() }, style: 'cancel' }]
                        )
                    }, 350)

                })

            }).catch((e) => {
                Alert.alert(
                    Language.t("Restore.Error"),
                    e,
                    [{ text: 'Ok', style: 'cancel' }]
                )
                console.log(e)
            })

    }

    handleCancel() {
        this.setState({ dialogVisible: false, passcode: '' })
    }

    render() {
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
                    nameIconLeft="align-left"
                    title={Language.t("ManageWallet.Title")}
                    style={{ paddingTop: getStatusBarHeight() }}
                    pressIconLeft={() => { this.props.navigation.openDrawer() }}
                />
                <View style={{ flex: 1, paddingHorizontal: GLOBAL.wp('2%') }}>
                    {
                        this.state.listWallet.length > 0 &&
                        <FlatList
                            data={this.state.listWallet}
                            // renderItem={this._renderItem}
                            renderItem={({ item, index }) => {
                                let StyleItem: item;
                                if (item.network.name) {
                                    switch (item.network.name) {
                                        case 'nexty':
                                            StyleItem = {
                                                bg_net: require('../../images/dasboard/bgEntry/nexty/bg_nty.png'),
                                                img_net: require('../../images/dasboard/bgEntry/nexty/img_nty.png'),
                                                name_token: 'NTY',
                                                color_gradient: ['#325EFC', '#2AA0F5']
                                            }
                                            break;
                                        case 'ethereum':
                                            StyleItem = {
                                                bg_net: require('../../images/dasboard/bgEntry/ethereum/bg_eth.png'),
                                                img_net: require('../../images/dasboard/bgEntry/ethereum/img_eth.png'),
                                                name_token: 'ETH',
                                                color_gradient: ['#C4C4C4', '#979797']
                                            }
                                            break;
                                        default:
                                            StyleItem = {
                                                bg_net: require('../../images/dasboard/bgEntry/tron/bg_trx.png'),
                                                img_net: require('../../images/dasboard/bgEntry/tron/img_trx.png'),
                                                name_token: 'TRX',
                                                color_gradient: ['#7D0202', '#F34C4C']
                                            }
                                            break;
                                    }
                                }

                                return (
                                    <View style={{ marginBottom: 5, flex: 1, flexDirection: 'row' }}>
                                        <Gradient
                                            colors={StyleItem.color_gradient}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                            style={{ padding: 20, flex: 8, borderTopStartRadius: 5, borderBottomStartRadius: 5, flexDirection: 'row' }}
                                        >
                                            <Image source={StyleItem.img_net} />
                                            <View style={{ paddingHorizontal: GLOBAL.wp('2%') }}>
                                                <Text style={{ color: '#fff', fontWeight: 'bold', fontFamily: GLOBAL.font.Poppins }}>{item.name}</Text>
                                                <Text style={{ color: '#fff', fontFamily: GLOBAL.font.Poppins }}>{item.balance}</Text>
                                            </View>
                                        </Gradient>
                                        <TouchableOpacity
                                            onPress={() => this.setState({ dialogVisible: true, id: item.id })}
                                            style={{ flex: 2, backgroundColor: '#fff', borderTopEndRadius: 5, borderBottomEndRadius: 5, justifyContent: 'center' }}>
                                            <Text style={{ color: '#000', textAlign: 'center' }}>Remove</Text>
                                        </TouchableOpacity>
                                    </View >

                                )
                            }}
                        />
                    }

                </View>

                <Dialog.Container visible={this.state.dialogVisible} >
                    <Dialog.Title
                        style={{ fontFamily: GLOBAL.font.Poppins }}
                    >
                        {Language.t("ManageWallet.AlertConfirm.Title")}
                    </Dialog.Title>
                    <Dialog.Description style={{ fontFamily: GLOBAL.font.Poppins }}>
                        {Language.t("ManageWallet.AlertConfirm.content")}
                    </Dialog.Description>
                    <Dialog.Input
                        placeholder={Language.t("ManageWallet.AlertConfirm.placeholderInput")}
                        onChangeText={(val) => this.setState({ passcode: val })}
                        secureTextEntry={true} value={this.state.passcode}
                        autoFocus={true}
                    />
                    <Dialog.Button
                        label={Language.t("ManageWallet.AlertConfirm.cancel")}
                        onPress={this.handleCancel.bind(this)}
                    />
                    <Dialog.Button
                        label={Language.t("ManageWallet.AlertConfirm.ok")}
                        onPress={this.handleOK.bind(this)}
                    />
                </Dialog.Container>
            </Gradient>
        )
    }
}


const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchAllWallet }, dispatch)
}

export default connect(null, mapDispatchToProps)(PageDeleteWL)
