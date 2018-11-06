import React, { Component } from 'react'
import { View, TouchableOpacity, StyleSheet, Alert, Clipboard, Platform } from 'react-native';
import GLOBALS from '../../helper/variables';
import Dialog from "react-native-dialog";
import { getPrivateKey } from '../../services/auth.service'
import {
    Container,
    Header,
    Title,
    Content,
    Text,
    Button,
    Left,
    Right,
    Body,
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import { from } from 'rxjs';
import Language from '../../i18n/i18n'
import CustomToast from '../../components/toast';

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
        await getPrivateKey(this.state.passcode)
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
            <Container style={{ backgroundColor: "#fff" }}>
                <Header style={{ backgroundColor: GLOBALS.Color.primary }}>
                    <Left>
                        <Button
                            transparent
                            onPress={() => this.props.navigation.openDrawer()}
                        >
                            <Icon name="bars" color='#fff' size={25}></Icon>
                        </Button>
                    </Left>
                    <Body style={Platform.OS == 'ios' ? { flex: 3 } : {}}>
                        <Title style={{ color: '#fff' }}>{Language.t('PrivateKey.Title')}</Title>
                    </Body>
                    <Right />
                </Header>

                <View style={{ flex: 1, alignItems: 'center' }}>
                    {
                        this.state.getsuccess ?
                            <View>
                                <Text style={{ textAlign: 'center', marginTop: GLOBALS.HEIGHT / 20, marginBottom: GLOBALS.HEIGHT / 20 }}>{Language.t('PrivateKey.Title')}</Text>
                                <Text style={{ textAlign: 'center', marginBottom: GLOBALS.HEIGHT / 20 }}>{this.state.privatekey}</Text>
                                <View style={style.FormRouter}>
                                    <TouchableOpacity style={style.button} onPress={this.Copy.bind(this)}>
                                        {
                                            !this.state.isCopy ?
                                                <Text style={style.TextButton}>{Language.t('PrivateKey.GetSuccess.TitleButton')}</Text>
                                                :
                                                <Text style={style.TextButton}>{Language.t('PrivateKey.GetSuccess.TitleCopied')}</Text>
                                        }
                                    </TouchableOpacity>
                                </View>
                            </View>
                            :
                            <View>
                                <Text style={{ textAlign: 'center', marginTop: GLOBALS.HEIGHT / 20, marginBottom: GLOBALS.HEIGHT / 20, fontFamily: GLOBALS.font.Poppins }}>{Language.t('PrivateKey.InitForm.Content')}</Text>
                                <View style={style.FormRouter}>
                                    <TouchableOpacity style={style.button} onPress={this.showDialog.bind(this)}>
                                        <Text style={style.TextButton}>{Language.t('PrivateKey.InitForm.TitleButton')}</Text>
                                    </TouchableOpacity>
                                </View>
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
                    <CustomToast ref="defaultToastBottom" position="bottom" />
                </View>
            </Container >
        )
    }
}
const style = StyleSheet.create({

    FormRouter: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    TextButton: {
        color: 'white',
        textAlign: 'center',
        fontSize: 15,
        fontFamily: GLOBALS.font.Poppins
    },
    button: {
        backgroundColor: GLOBALS.Color.secondary,
        marginBottom: GLOBALS.HEIGHT / 40,
        height: GLOBALS.HEIGHT / 17,
        justifyContent: 'center',
        width: GLOBALS.WIDTH / 1.6,
        shadowOffset: { width: 3, height: 3, },
        shadowColor: 'black',
        shadowOpacity: 0.2,
    },
})