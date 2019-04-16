import React, { Component } from 'react';
import { Text, View, StyleSheet, StatusBar, FlatList, TouchableOpacity, Image, PixelRatio } from 'react-native';
import Header from '../../../components/header';
import GLOBALS from '../../../helper/variables';
import { connect } from 'react-redux';
import { CountNetworkofWallet } from '../../../../realm/walletSchema';
import { fetchAllWallet } from '../../../../redux/actions/slideWalletAction';
import { AddNetwork } from '../insertWallet';
import { StackActions, NavigationActions } from 'react-navigation';
import Dialog from "react-native-dialog";
import { bindActionCreators } from 'redux';
import Gradient from 'react-native-linear-gradient';
import Language from '../../../i18n/i18n'

const px = PixelRatio.getFontScale()

class SelectNetwork extends Component {

    state = {
        SListNetwork: this.ListNetwork,
        dialogVisible: false,
        passcode: '',
        NetworkSL: '',
        old_network: ''
    }

    ListNetwork = [
        {
            name: 'nexty',
            uri: '2714',
            type: true,
            icon: require('../../../images/AddWallet/network/nty.png')
        },
        {
            name: 'ethereum',
            uri: '1027',
            type: true,
            icon: require('../../../images/AddWallet/network/eth.png')

        },
        {
            name: 'tron',
            uri: '1958',
            type: true,
            icon: require('../../../images/AddWallet/network/tron.png')

        }
    ];

    handleCancel() {
        this.setState({ dialogVisible: false, passcode: '' })
    }

    async handleAdd() {
        const payload = this.props.navigation.getParam('payload').data;

        AddNetwork(
            this.state.passcode,
            payload.name,
            payload.pk_en,
            this.state.NetworkSL,
            payload.address,
            payload.typeBackup,
            this.state.old_network
        )
            .then(async (ss) => {
                await this.props.fetchAllWallet();
                await this.props.navigation.dispatch(StackActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({
                            routeName: 'Drawer',
                        }),
                    ],
                }))
            }
            )
            .catch(e => alert(e))
    }

    selectNetwork(network, type) {
        const { navigate } = this.props.navigation;
        switch (type) {
            case 'New':
                navigate('NameWallet', {
                    payload: {
                        type: type,
                        network: network
                    }
                })
                break;
            case 'changeNetwork':
                this.setState({ dialogVisible: true, NetworkSL: network })
                break;
            case 'restore':
                navigate('restore', {
                    payload: {
                        type: type,
                        network: network
                    }
                })
                break;
            default:
                navigate('importWL', {
                    payload: {
                        type: type,
                        network: network
                    }
                })
                break;
        }

    }


    _disableBtn = (pk_en) => {
        CountNetworkofWallet(pk_en).then(data => {
            for (let x = 0; x < data.length; x++) {
                var index_ListNetwork = this.ListNetwork.findIndex(a => a.name == data[x].network.name);
                this.ListNetwork[index_ListNetwork].type = false;
                this.setState({ SListNetwork: this.ListNetwork })
            }

        }).catch(e => console.log(e))
    }

    componentWillMount() {
        switch (this.props.navigation.getParam('payload').type) {
            case 'changeNetwork':
                this.setState({ old_network: this.props.navigation.getParam('payload').old_network })
                this._disableBtn(this.props.navigation.getParam('payload').data.pk_en)
                break;
            case 'New':
                this.setState({ SListNetwork: this.ListNetwork })
                break;
            default:
                this.setState({ SListNetwork: this.ListNetwork })
                break;
        }
    }

    render() {
        const payload = this.props.navigation.getParam('payload');
        return (
            <Gradient
                colors={['#F0F3F5', '#E8E8E8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.container}>
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
                    title={Language.t('SelectNetwork.Title')}
                    style={{ marginTop: 23 }}
                    pressIconLeft={() => { this.props.navigation.goBack(); }}
                />
                <View style={{ flex: 1, padding: GLOBALS.hp('2%') }}>
                    <FlatList
                        data={this.state.SListNetwork}
                        keyExtractor={(item, index) => index.toString()}
                        numColumns={2}
                        renderItem={network => {
                            return (
                                <TouchableOpacity
                                    style={StyleBtn(network.item.type).button}
                                    onPress={() => this.selectNetwork(network.item.name, payload.type)}
                                    disabled={!network.item.type}
                                >
                                    <Image
                                        resizeMode="contain"
                                        source={network.item.icon}
                                        style={{ height: 80, width: 80 }}
                                    />
                                    <Text style={{
                                        fontSize: px * 20,
                                        textAlign: 'center',
                                        color: "#535353",
                                        fontFamily: GLOBALS.font.Poppins
                                    }}>{network.item.name}</Text>
                                </TouchableOpacity>
                            )
                        }}
                    />
                </View>
                <Dialog.Container visible={this.state.dialogVisible} >
                    <Dialog.Title
                        style={{ fontFamily: GLOBALS.font.Poppins }}
                    >
                        {Language.t("NameWallet.AlertConfirm.title")}
                    </Dialog.Title>
                    <Dialog.Description style={{ fontFamily: GLOBALS.font.Poppins }}>
                        {Language.t("NameWallet.AlertConfirm.content")}
                    </Dialog.Description>
                    <Dialog.Input
                        placeholder={Language.t("NameWallet.AlertConfirm.placeholderInput")}
                        onChangeText={(val) => this.setState({ passcode: val })}
                        secureTextEntry={true} value={this.state.passcode}
                        autoFocus={true}
                    />
                    <Dialog.Button
                        label={Language.t("NameWallet.AlertConfirm.cancel")}
                        onPress={this.handleCancel.bind(this)}
                    />
                    <Dialog.Button
                        label={Language.t("NameWallet.AlertConfirm.ok")}
                        onPress={this.handleAdd.bind(this)}
                    />
                </Dialog.Container>
            </Gradient>
        )
    }
}

const StyleBtn = (type) => StyleSheet.create({
    button: {
        backgroundColor: type ? "#F8F9F9" : "transparent",
        width: (GLOBALS.wp('100%') - (GLOBALS.hp('4%') + GLOBALS.wp('8%'))) / 2,
        height: (GLOBALS.wp('100%') - (GLOBALS.hp('4%') + GLOBALS.wp('8%'))) / 2,
        padding: GLOBALS.wp('2%'),
        marginVertical: GLOBALS.wp('2%'),
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: type ? -1 : 0,
            height: type ? 3 : 0,
        },
        shadowOpacity: type ? 0.24 : 0,
        shadowRadius: type ? 2.27 : 0,
        elevation: type ? 2 : 0,
        margin: GLOBALS.wp('2%'),
        justifyContent: 'center',
        alignItems: 'center',
    }
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

})

const mapStateToProps = state => {
    return state.ActionDB
}
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ fetchAllWallet }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectNetwork)