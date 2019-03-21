import React, { Component } from 'react'
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Clipboard,
    Platform,
    Image,
    StatusBar,
    Text
} from 'react-native';
import GLOBALS from '../../helper/variables';
import Dialog from "react-native-dialog";
import { getPrivateKey } from '../../services/auth.service'
// import {
//     Container,
//     Header,
//     Title,
//     Content,
//     Text,
//     Button,
//     Left,
//     Right,
//     Body,
// } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import Language from '../../i18n/i18n'
import CustomToast from '../../components/toast';
import Gradient from 'react-native-linear-gradient';
import IconFeather from "react-native-vector-icons/Feather"
import Header from '../../components/header';


export default class privateKey extends Component {

    Default_Toast_Bottom = (message) => {

        this.refs.defaultToastBottom.ShowToastFunction(message);

    }
    constructor(props) {
        super(props)

        this.state = {
            dialogVisible: false,
            privatekey: '',
            passcode: '',
            getsuccess: false,
            isCopy: false
        };
        this.styleHeaderIOS = this.styleHeaderIOS.bind(this)
    };


    showDialog() {
        this.setState({ dialogVisible: true });
    }

    async handleGet() {
        if (this.state.passcode == '') {
            Alert.alert(
                Language.t('PrivateKey.Aler.Title'),
                Language.t('PrivateKey.Aler.Content'),
                [
                    { text: Language.t('PrivateKey.Aler.TitleButtonCancel'), onPress: () => { this.setState({ dialogVisible: false, privatekey: '' }) }, style: 'cancel' },
                    { text: Language.t('PrivateKey.Aler.TitleButtonTry'), onPress: () => this.setState({ dialogVisible: true, passcode: '' }) }
                ]
            )
            return
        }
        await getPrivateKey(this.state.passcode, this.props.navigation.getParam('payload').pk_en)
            .then(pk => {
                if (pk.length > 0) {
                    this.setState({ privatekey: pk, dialogVisible: false, getsuccess: true })
                } else {
                    Alert.alert(
                        Language.t('PrivateKey.Aler.Title'),
                        Language.t('PrivateKey.Aler.Content'),
                        [
                            { text: Language.t('PrivateKey.Aler.TitleButtonCancel'), onPress: () => { this.setState({ dialogVisible: false, privatekey: '', passcode: '' }) }, style: 'cancel' },
                            { text: Language.t('PrivateKey.Aler.TitleButtonTry'), onPress: () => this.setState({ dialogVisible: true, passcode: '' }) }
                        ]
                    )
                }
            }).catch(err => {
                Alert.alert(
                    Language.t('PrivateKey.Aler.Title'),
                    Language.t('PrivateKey.Aler.Content'),
                    [
                        { text: Language.t('PrivateKey.Aler.TitleButtonCancel'), onPress: () => { this.setState({ dialogVisible: false, privatekey: '', passcode: '' }) }, style: 'cancel' },
                        { text: Language.t('PrivateKey.Aler.TitleButtonTry'), onPress: () => this.setState({ dialogVisible: true, passcode: '' }) }
                    ]
                )
                console.log(err)
            })
    }

    handleCancel() {
        this.setState({ dialogVisible: false, passcode: '' })
    }
    Copy() {
        Clipboard.setString(this.state.privatekey);
        this.Default_Toast_Bottom(Language.t('PrivateKey.Toast'));
        this.setState({ isCopy: true })
    }
    styleHeaderIOS() {
        if (Platform.OS == 'ios') {
            return {
                flex: 10,
                backgroundColor: 'red'
            }
        } else {
            return {}
        }
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "#fafafa" }}>
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
                    title={Language.t('PrivateKey.Title')}
                    style={{ marginTop: 23 }}
                    pressIconLeft={() => this.props.navigation.goBack()}
                />

                <View style={style.container}>
                    {
                        this.state.getsuccess ?
                            <View style={style.MainForm}>
                                <Text style={{
                                    textAlign: 'center',
                                    fontFamily: GLOBALS.font.Poppins,
                                    fontSize: GLOBALS.wp('5%'),
                                    fontWeight: '400',
                                }}>{Language.t('PrivateKey.Title')}</Text>
                                <View style={{ alignItems: 'center' }}>
                                    <Image
                                        source={require('../../images/privatekey.png')}
                                        resizeMode="contain"
                                        style={{
                                            height: GLOBALS.hp('40%'),
                                            width: GLOBALS.wp('40%'),
                                            marginLeft: GLOBALS.wp('5%')
                                        }}
                                    />
                                </View>
                                <Text style={{
                                    textAlign: 'center',
                                    fontFamily: GLOBALS.font.Poppins,
                                    fontSize: GLOBALS.wp('4%'),
                                }}>{this.state.privatekey}</Text>
                                <TouchableOpacity style={style.button} onPress={this.Copy.bind(this)}>
                                    <Gradient
                                        colors={['#0C449A', '#082B5F']}
                                        start={{ x: 1, y: 0.7 }}
                                        end={{ x: 0, y: 3 }}
                                        style={{ paddingVertical: GLOBALS.hp('2%'), borderRadius: 5 }}
                                    >
                                        {
                                            !this.state.isCopy ?
                                                <Text style={style.TextButton}>{Language.t('PrivateKey.GetSuccess.TitleButton')}</Text>
                                                :
                                                <Text style={style.TextButton}>{Language.t('PrivateKey.GetSuccess.TitleCopied')}</Text>
                                        }
                                    </Gradient>
                                </TouchableOpacity>
                            </View>
                            :
                            <View style={style.MainForm}>
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        fontFamily: GLOBALS.font.Poppins,
                                        fontSize: GLOBALS.wp('5%'),
                                        fontWeight: '400'
                                    }}>
                                    {Language.t('PrivateKey.InitForm.Content')}
                                </Text>
                                <View style={{ alignItems: 'center' }}>
                                    <Image
                                        source={require('../../images/privatekey.png')}
                                        resizeMode="contain"
                                        style={{ height: GLOBALS.hp('40%'), width: GLOBALS.wp('40%'), marginLeft: GLOBALS.wp('5%') }}
                                    />
                                </View>
                                <TouchableOpacity style={style.button} onPress={this.showDialog.bind(this)}>
                                    <Gradient
                                        colors={['#0C449A', '#082B5F']}
                                        start={{ x: 1, y: 0.7 }}
                                        end={{ x: 0, y: 3 }}
                                        style={{ paddingVertical: GLOBALS.hp('2%'), borderRadius: 5 }}
                                    >
                                        <Text style={style.TextButton}>{Language.t('PrivateKey.InitForm.TitleButton')}</Text>
                                    </Gradient>
                                </TouchableOpacity>
                            </View>
                    }


                    <Dialog.Container visible={this.state.dialogVisible}>
                        <Dialog.Title style={{ fontFamily: GLOBALS.font.Poppins }}>{Language.t('PrivateKey.DialogConfirm.Title')}</Dialog.Title>
                        <Dialog.Description style={{ fontFamily: GLOBALS.font.Poppins }}>
                            {Language.t('PrivateKey.DialogConfirm.Content')}
                        </Dialog.Description>
                        <Dialog.Input placeholder={Language.t('PrivateKey.DialogConfirm.Placeholder')} onChangeText={(val) => this.setState({ passcode: val })} secureTextEntry={true} value={this.state.passcode} autoFocus={true}></Dialog.Input>
                        <Dialog.Button label={Language.t('PrivateKey.DialogConfirm.TitleButtonCancel')} onPress={this.handleCancel.bind(this)} />
                        <Dialog.Button label={Language.t('PrivateKey.DialogConfirm.TitleButtonGet')} onPress={this.handleGet.bind(this)} />
                    </Dialog.Container>
                    <View
                        style={{
                            position: 'absolute',
                            bottom: GLOBALS.hp('10%'),
                            width: GLOBALS.wp('100%'),
                            elevation: 999,
                            alignItems: 'center',
                        }}
                    >
                        <CustomToast ref="defaultToastBottom" position="bottom" />
                    </View>
                </View>
            </View >
        )
    }
}
const style = StyleSheet.create({
    container: {
        flex: 1,
        padding: GLOBALS.hp('2%'),
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
        flexDirection: 'column',
        justifyContent: 'space-around'
    },
    TextButton: {
        color: 'white',
        textAlign: 'center',
        fontSize: GLOBALS.wp('4%'),
        fontFamily: GLOBALS.font.Poppins
    },
    button: {
        justifyContent: 'center',
        shadowOffset: { width: 3, height: 3, },
        shadowColor: 'black',
        shadowOpacity: 0.2,
    },
})