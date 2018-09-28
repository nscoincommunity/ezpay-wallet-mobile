import React, { Component } from 'react'
import { View, TouchableOpacity, StyleSheet, Alert, Clipboard } from 'react-native';
import GLOBALS from '../../helper/variables';
import Dialog from "react-native-dialog";
import { getPrivateKey } from '../../services/auth.service'
import { showToastBottom } from '../../services/loading.service'
import {
    Container,
    Header,
    Title,
    Content,
    Text,
    Button,
    Footer,
    FooterTab,
    Left,
    Right,
    Body,
    Tabs,
    Tab,
    Root
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import { from } from 'rxjs';


export default class privateKey extends Component {
    constructor(props) {
        super(props)

        this.state = {
            dialogVisible: false,
            privatekey: '',
            passcode: '',
            getsuccess: false,
        };
    };


    showDialog() {
        this.setState({ dialogVisible: true });
    }

    async handleGet() {
        if (this.state.passcode == '') {
            Alert.alert(
                'Get private key failed',
                'Invalid local passcode',
                [
                    { text: 'Cancel', onPress: () => { this.setState({ dialogVisible: false, privatekey: '' }) }, style: 'cancel' },
                    { text: 'Try again', onPress: () => this.setState({ dialogVisible: true, passcode: '' }) }
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
                        'Get private key failed',
                        'Invalid local passcode',
                        [
                            { text: 'Cancel', onPress: () => { this.setState({ dialogVisible: false, privatekey: '', passcode: '' }) }, style: 'cancel' },
                            { text: 'Try again', onPress: () => this.setState({ dialogVisible: true, passcode: '' }) }
                        ]
                    )
                }
            }).catch(err => {
                Alert.alert(
                    'Get private key failed',
                    'Invalid local passcode',
                    [
                        { text: 'Cancel', onPress: () => { this.setState({ dialogVisible: false, privatekey: '', passcode: '' }) }, style: 'cancel' },
                        { text: 'Try again', onPress: () => this.setState({ dialogVisible: true, passcode: '' }) }
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
        showToastBottom('Copied to clipboard');
    }

    render() {
        return (
            <Root>
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
                        <Body>
                            <Title style={{ color: '#fff', fontFamily: GLOBALS.font.Poppins }}>Private key</Title>
                        </Body>
                        <Right />
                    </Header>

                    <Content >
                        {
                            !this.state.getsuccess ?
                                <View>
                                    <Text style={{ textAlign: 'center', marginTop: GLOBALS.HEIGHT / 20, marginBottom: GLOBALS.HEIGHT / 20, fontFamily: GLOBALS.font.Poppins }}>Click below button to get private key</Text>
                                    <View style={style.FormRouter}>
                                        <TouchableOpacity style={style.button} onPress={this.showDialog.bind(this)}>
                                            <Text style={style.TextButton}>Continue</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                : null
                        }
                        {
                            this.state.getsuccess ?
                                <View>
                                    <Text style={{ textAlign: 'center', marginTop: GLOBALS.HEIGHT / 20, marginBottom: GLOBALS.HEIGHT / 20 }}>Private key</Text>
                                    <Text style={{ textAlign: 'center', marginBottom: GLOBALS.HEIGHT / 20 }}>{this.state.privatekey}</Text>
                                    <View style={style.FormRouter}>
                                        <TouchableOpacity style={style.button} onPress={this.Copy.bind(this)}>
                                            <Text style={style.TextButton}>Copy private key</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                : null
                        }


                        <Dialog.Container visible={this.state.dialogVisible}>
                            <Dialog.Title style={{ fontFamily: GLOBALS.font.Poppins }}>Retrieve your private key</Dialog.Title>
                            <Dialog.Description style={{ fontFamily: GLOBALS.font.Poppins }}>
                                Enter you local passcode to process
                        </Dialog.Description>
                            <Dialog.Input placeholder="Local passcode" onChangeText={(val) => this.setState({ passcode: val })} secureTextEntry={true} value={this.state.passcode} autoFocus={true}></Dialog.Input>
                            <Dialog.Button label="Cancel" onPress={this.handleCancel.bind(this)} />
                            <Dialog.Button label="Get" onPress={this.handleGet.bind(this)} />
                        </Dialog.Container>

                    </Content>
                </Container >
            </Root>
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