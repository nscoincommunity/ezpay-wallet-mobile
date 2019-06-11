import React, { Component } from 'react'
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Platform,
    Image,
    TextInput,
    ScrollView,
    Clipboard,
    Alert
} from 'react-native'
import ImageApp from '../../../../../helpers/constant/image';
import Color from '../../../../../helpers/constant/color';
import Gradient from 'react-native-linear-gradient';
import Header from '../../../../components/header';
import CONSTANT from '../../../../../helpers/constant';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Func_import_account } from './import.service';
import ButtonBottom from '../../../../components/buttonBottom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Func_Add_Account } from '../actions'
import { StackActions, NavigationActions } from 'react-navigation';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import { Import_account_of_token } from '../../token/actions'


class Import extends Component {
    state = {
        textInput: '',
        disableButton: true,
        error: ''
    }
    ObjToken = {}

    ChangeText = async (val) => {

        const { token, type } = this.props.navigation.getParam('payload')
        await this.setState({ textInput: val })

        switch (type) {
            case 'privatekey':
                const regex = /[a-zA-Z0-9]{60,}/;
                var OK = regex.test(val);
                if (!OK) {
                    this.setState({ disableButton: true, error: 'Invalid private key' })
                    return;
                }
                this.import_by_privatekey(val, type, token)
                break;
            case 'mnemoric':
                this.import_by_mnemonic(val, type, token)
            default:
                break;
        }
    }

    import_by_privatekey = (val, type, token) => {
        Func_import_account(val, type, token.network).then(address => {
            this.setState({ disableButton: false, error: '' });
            var ID = Math.floor(Date.now() / 1000);
            this.ObjToken = {
                id: ID,
                name: token.name,
                symbol: token.symbol,
                network: token.network,
                address: token.address,
                price: 0,
                percent_change: 0,
                icon: '',
                decimals: token.decimals,
                total_balance: 0,
                id_market: token.id_market,
                account: [{
                    id: ID,
                    name: 'Account 1',
                    token_type: token.network,
                    address: address,
                    private_key: val,
                    balance: 0,
                    time: new Date()
                }]
            }
        }).catch(e => {
            console.log('error', e)
            this.setState({ disableButton: true, error: e })
        })
    }

    import_by_mnemonic = (val, type, token) => {
        Func_import_account(val, type, token.network).then(account => {
            this.setState({ disableButton: false, error: '' });
            var ID = Math.floor(Date.now() / 1000);
            this.ObjToken = {
                id: ID,
                name: token.name,
                symbol: token.symbol,
                network: token.network,
                address: token.address,
                price: 0,
                percent_change: 0,
                icon: '',
                decimals: token.decimals,
                total_balance: 0,
                id_market: token.id_market,
                account: [{
                    id: ID,
                    name: 'Account 1',
                    token_type: token.network,
                    address: account.address,
                    private_key: account.privateKey,
                    balance: 0,
                    time: new Date()
                }]
            }
        }).catch(e => {
            this.setState({ disableButton: true, error: e })
        })
    }

    onSelect = data => {
        if (data['result'] !== 'cancelScan') {
            console.log(data)
            var result = data['result']
            this.ChangeText(result)
        }
    }

    clear_text_input = () => {
        this.setState({ textInput: '' })
    }

    Paste_input = async () => {
        let val = await Clipboard.getString()
        await this.ChangeText(val)
    }

    ImportAccount = async () => {
        const { typeAdd, token } = this.props.navigation.getParam('payload');
        if (typeAdd == 'token') {
            await this.props.Func_Add_Account(this.ObjToken);
            await this.props.navigation.dispatch(StackActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({
                        routeName: 'Dashboard',
                    }),
                ],
            }))
        } else {
            const { loadData } = this.props.navigation.getParam('payload')
            await Import_account_of_token(token.id, this.ObjToken.account[0]).then(ss => {
                if (ss) {
                    loadData();
                    this.props.navigation.pop(2)
                }
            }).catch(e => {
                console.log('sss', e);
            })
        }

    }

    selectFile = () => {
        // iPhone/Android
        DocumentPicker.show({
            filetype: [DocumentPickerUtil.allFiles()],
        }, (error, res) => {
            if (res != null) {
                // Android
                console.log(
                    res.uri,
                    '\n- ' + res.type, // mime type
                    '\n- ' + res.fileName,
                    '\n- ' + res.fileSize
                );

                if ((res.fileName).substring((res.fileName).lastIndexOf('.') + 1, (res.fileName).length) == 'txt') {
                    RNFS.readFile(res.uri).then(data => {
                        console.log(data)
                        this.ChangeText(data)
                    }).catch(err => {
                        console.log(err)
                    })
                } else {
                    Alert.alert(
                        'Warning',
                        'Please select a valid backup file',
                        [{ text: 'Ok', onPress: () => { }, style: 'cancel' }]
                    )
                }

            }
        });
    }

    render() {
        const { token, type } = this.props.navigation.getParam('payload')
        console.log('token', token)
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
                    Title={type}
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
                                onPress={() => this.selectFile()}
                            >
                                <Gradient
                                    colors={Color.Gradient_master_card}
                                    style={styles.styleButton}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                >
                                    <View style={{ justifyContent: 'center', marginRight: 5 }}>
                                        <Text style={{ color: '#fff' }}>Select file</Text>
                                    </View>
                                    <Icon name="folder-key" size={20} style={{ color: '#fff', textAlign: 'center' }} />
                                </Gradient>
                            </TouchableOpacity>
                        </View>

                    </ScrollView>
                    <ButtonBottom
                        text="Import"
                        onPress={this.ImportAccount}
                        disable={this.state.disableButton}
                    />
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

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ Func_Add_Account }, dispatch)
}
export default connect(null, mapDispatchToProps)(Import)