import React, { Component } from 'react'
import { View, FlatList, TouchableOpacity, Text, StyleSheet, ToastAndroid, Platform, Alert } from 'react-native';
import GLOBALS from '../../helper/variables';
import { setData } from '../../services/data.service'
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
import CustomToast from '../../components/toast';
import Language from '../../i18n/i18n';
import IconFeather from "react-native-vector-icons/Feather";
import Dialog from "react-native-dialog";
import { EnableTouchID } from "../../services/auth.service"
import AlertModal from "../../components/Modal"
import TouchID from "react-native-touch-id"
export default class Setting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dialogVisible: false,
            passcode: ''
        }
    }



    Default_Toast_Bottom = () => {
        if (Platform.OS == 'ios') {
            this.refs.defaultToastBottom.ShowToastFunction(Language.t('Settings.Toast'));
        } else {
            ToastAndroid.show(Language.t('Settings.Toast'), ToastAndroid.SHORT)
        }
    }

    handleCancel() {
        this.setState({ dialogVisible: false, passcode: '' })
    }

    async handleGet() {
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

        await EnableTouchID(this.state.passcode).then((passcode) => {
            this.setState({ dialogVisible: false, passcode: '' }, () => {
                setTimeout(() => {
                    // Success code
                    console.log(passcode)
                    setData('TouchID', passcode);
                    Alert.alert(
                        Language.t('AddToken.AlerSuccess.Title'),
                        Language.t('Settings.Success'),
                        [
                            { text: "OK", style: 'cancel' },
                        ]
                    )
                }, 350);
            })
        }).catch(() => {
            Alert.alert(
                Language.t('Send.AlerError.Error'),
                Language.t('PrivateKey.Aler.Content'),
                [
                    { text: Language.t('PrivateKey.Aler.TitleButtonCancel'), onPress: () => { this.setState({ dialogVisible: false, privatekey: '', passcode: '' }) }, style: 'cancel' },
                    { text: Language.t('PrivateKey.Aler.TitleButtonTry'), onPress: () => this.setState({ dialogVisible: true, passcode: '' }) }
                ]
            )
        })
    }


    pushToPage(Status: boolean, Router) {
        if (Router == "TouchID") {
            TouchID.isSupported().then(() => {
                console.log('aa')
                this.setState({ dialogVisible: true });
            }).catch((error) => {
                Alert.alert(
                    Language.t('TouchID.Error.Title'),
                    Language.t('TouchID.Error.Content'),
                    [
                        { text: Language.t('Restore.Ok'), style: 'cancel' },
                    ]
                )
            })
            return;
        }
        if (Status == true) {
            this.props.navigation.navigate(Router)
        }
    }
    render() {
        const datas = [
            {
                route: "Backup",
                text: Language.t('Settings.Backup'),
                status: true
            },
            {
                route: 'Language',
                text: Language.t('Settings.Languages'),
                status: true
            },
            {
                route: "ChangePIN",
                text: Language.t('ChangePIN.Title'),
                status: true
            },
            {
                route: "TouchID",
                text: Language.t('Settings.TouchID'),
                status: false
            }
        ];
        return (
            <Container style={{ backgroundColor: "#fafafa" }}>
                <Header style={{ backgroundColor: '#fafafa', borderBottomWidth: 0 }}>
                    <Left>
                        <Button
                            transparent
                            onPress={() => {
                                this.props.navigation.openDrawer();
                            }}
                        >
                            <IconFeather type="FontAwesome" name="align-left" style={{ color: GLOBALS.Color.primary, fontSize: 25 }} />
                        </Button>
                    </Left>
                    <Body style={Platform.OS == 'ios' ? { flex: 3 } : {}}>
                        <Title style={{ color: GLOBALS.Color.primary }}>{Language.t('Settings.Title')}</Title>
                    </Body>
                    <Right />
                </Header>

                <View style={styles.container}>
                    <FlatList
                        style={{ padding: GLOBALS.hp('2%') }}
                        data={datas}
                        extraData={this.state}
                        renderItem={({ item }) => {
                            return (
                                <TouchableOpacity
                                    onPress={() => this.pushToPage(item.status, item.route)}
                                    style={styles.row}>
                                    <Text style={{
                                        flex: 9,
                                        fontFamily: GLOBALS.font.Poppins,
                                        fontSize: GLOBALS.wp('4%')
                                    }}>{item.text}</Text>
                                    <Icon
                                        name="angle-right"
                                        style={{ flex: 1, textAlign: 'right' }}
                                        size={GLOBALS.wp('6%')}
                                        color="#AAA"
                                    />
                                </TouchableOpacity>
                            )
                        }}
                        keyExtractor={(item) => item.text}
                    />
                    <CustomToast ref="defaultToastBottom" position="bottom" />

                    <Dialog.Container visible={this.state.dialogVisible} >
                        <Dialog.Title
                            style={{ fontFamily: GLOBALS.font.Poppins }}
                        >
                            {Language.t('Settings.EnableTouchID')}
                        </Dialog.Title>
                        <Dialog.Description style={{ fontFamily: GLOBALS.font.Poppins }}>
                            {Language.t('PrivateKey.DialogConfirm.Content')}
                        </Dialog.Description>
                        <Dialog.Input
                            placeholder={Language.t('PrivateKey.DialogConfirm.Placeholder')}
                            onChangeText={(val) => this.setState({ passcode: val })}
                            secureTextEntry={true} value={this.state.passcode}
                            autoFocus={true}
                        />
                        <Dialog.Button
                            label={Language.t('PrivateKey.DialogConfirm.TitleButtonCancel')}
                            onPress={this.handleCancel.bind(this)}
                        />
                        <Dialog.Button
                            label="OK"
                            onPress={this.handleGet.bind(this)}
                        />
                    </Dialog.Container>
                </View>
            </Container >
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    row: {
        borderLeftWidth: Platform.OS == 'ios' ? 0 : 0.2,
        borderRightWidth: Platform.OS == 'ios' ? 0 : 0.2,
        borderColor: '#c1bfbf',
        paddingVertical: GLOBALS.hp('3%'),
        paddingHorizontal: GLOBALS.hp('4%'),
        backgroundColor: '#fff',
        flexDirection: 'row',
        // flexWrap: 'wrap',
        marginVertical: GLOBALS.hp('1%'),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.14,
        shadowRadius: 2.27,
        elevation: 2,
        borderRadius: 10,
    }
})