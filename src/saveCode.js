import React, { Component } from 'react'
import {
    Text,
    View,
    StyleSheet,
    FlatList,
    Platform,
    TouchableHighlight,
    TextInput,
    KeyboardAvoidingView,
    ScrollView,
    Image,
    TouchableOpacity,
    Keyboard
} from 'react-native';
import { getData } from './services/data.service';
import GLOBALS from './helper/variables';
import Icon from "react-native-vector-icons/FontAwesome";
import Gradient from 'react-native-linear-gradient'
import Language from './i18n/i18n';
import Dialog from "react-native-dialog";
import PopupDialog, {
    ScaleAnimation, DialogTitle, DialogButton
} from "react-native-popup-dialog";
import DiaLog from "./components/Modal"


const scaleAnimation = new ScaleAnimation();

export default class componentName extends Component {
    state = {
        ListToken: [],
        selected: 'NTY',
        dialogSend: false
    }
    componentDidMount() {
        getData('ListToken')
            .then(data => {
                if (data != null) {
                    var tempArray = []
                    JSON.parse(data).forEach(element => {
                        tempArray.push({
                            value: JSON.stringify(element),
                            label: element.symbol
                        })
                    });
                }
                this.setState({ ListToken: tempArray })
            })
    }
    showScaleAnimationDialog = () => {
        this.scaleAnimationDialog.show();
        this.refs.TouchID.openModal('success', 'Confirm', 'sdsdsds')
    }

    render() {
        return (
            <ScrollView
            // contentContainerStyle={{ flex: 1, flexGrow: 1 }}
            >
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={'position'}
                    // contentContainerStyle={{ flex: 1, flexGrow: 1 }}
                    enabled
                    keyboardVerticalOffset={Platform.OS == 'ios' ? GLOBALS.hp('-1') : GLOBALS.hp('-5%')}
                >
                    <View style={Styles.container}>
                        {
                            this.state.ListToken.length > 0 &&
                            <FlatList
                                style={{ paddingVertical: GLOBALS.hp('3%') }}
                                horizontal={true}
                                data={this.state.ListToken}
                                renderItem={({ item, index }) => {
                                    return (
                                        <TouchableHighlight
                                            onPress={() => this.Selected(item)}
                                            style={
                                                selectedBtn(this.state.selected === item.label).selected
                                            }
                                        >
                                            <Text style={[selectedBtn(this.state.selected === item.label).text]}>{item.label}</Text>
                                        </TouchableHighlight>
                                    )
                                }}
                                keyExtractor={(item, index) => item.value}
                            />
                        }
                        <View style={[Styles.Form, { height: GLOBALS.hp('11%') }]}>
                            <View style={{ flexDirection: 'row' }}>
                                <TextInput placeholder="Address wallet" style={{ flex: 9 }} underlineColorAndroid='transparent' />
                                <Image source={require('./images/icon/dollar.png')} />
                            </View>
                        </View>

                        <View style={[Styles.Form, { height: GLOBALS.hp('50%') },]}>
                            <View style={{ flexDirection: 'row', }}>
                                <TextInput placeholder="Address wallet" style={{ flex: 100 }} underlineColorAndroid='transparent' />
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <TextInput placeholder="Address wallet" style={{ flex: 9 }} underlineColorAndroid='transparent' />
                                <Image source={require('./images/icon/dollar.png')} />
                            </View>
                            <TouchableOpacity style={Styles.button} onPress={() => { this.showScaleAnimationDialog(); Keyboard.dismiss() }}>
                                <Gradient
                                    colors={this.state.VisibaleButton ? ['#cccccc', '#cccccc'] : ['#0C449A', '#082B5F']}
                                    style={{ borderRadius: 5, paddingVertical: GLOBALS.hp('2%') }}
                                    start={{ x: 0.7, y: 0.0 }}
                                    end={{ x: 0.0, y: 0.0 }}
                                >
                                    <Text style={Styles.TextButton}>{Language.t('Send.SendForm.TitleButton')}</Text>
                                </Gradient>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1 }} />
                    </View>

                    <Dialog.Container visible={this.state.dialogSend} >
                        <Dialog.Title>{Language.t('Send.ConfirmSend.Title')}</Dialog.Title>
                        <Dialog.Description>
                            {Language.t('Send.ConfirmSend.Content')}
                        </Dialog.Description>
                        <Dialog.Input placeholder={Language.t('Send.ConfirmSend.Placeholder')} onChangeText={(val) => this.setState({ Password: val })} secureTextEntry={true} autoFocus={true}></Dialog.Input>
                        <Dialog.Button label={Language.t('Send.ConfirmSend.TitleButtonCancel')} onPress={() => { this.setState({ dialogSend: false }) }} />
                        <Dialog.Button label={Language.t('Send.SendForm.TitleButton')} onPress={() => { this.showScaleAnimationDialog() }} />
                    </Dialog.Container>

                    <PopupDialog
                        dialogStyle={{ width: GLOBALS.WIDTH / 1.2, height: 'auto' }}
                        ref={(popupDialog) => {
                            this.scaleAnimationDialog = popupDialog;
                        }}
                        dialogAnimation={scaleAnimation}
                        dialogTitle={<DialogTitle title={this.state.titleDialog} />}
                        actions={[
                            <DialogButton
                                text={Language.t('Send.Ok')}
                                onPress={() => {
                                    this.scaleAnimationDialog.dismiss();
                                }}
                                key="button-1"
                            />,
                        ]}
                    >
                        <View style={{ justifyContent: 'center' }}>
                            <Text style={{ textAlign: 'center', marginTop: 10 }}>{this.state.contentDialog}</Text>
                        </View>
                    </PopupDialog>
                    <DiaLog ref="TouchID" />


                </KeyboardAvoidingView>
            </ScrollView >
        )
    }
}

/* style button */
const selectedBtn = (type) => StyleSheet.create({
    selected: {
        backgroundColor: type ? '#EDA420' : '#fafafa',
        borderRadius: 20,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 15,
        paddingRight: 15,
        margin: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: type ? 0.34 : 0,
        shadowRadius: 2.27,
        elevation: type ? 5 : 0,
    },
    text: {
        fontWeight: type ? 'bold' : 'normal',
        color: type ? '#FFFFFF' : "#000",
        fontFamily: GLOBALS.font.Poppins
    }
})

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: GLOBALS.hp('2%'),
        backgroundColor: '#fafafa',
        // flexDirection: 'column'
    },
    Form: {
        padding: GLOBALS.hp('2.5%'),
        borderRadius: 7,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.24,
        shadowRadius: 1.27,
        elevation: 2,
        backgroundColor: '#fff',
        marginVertical: GLOBALS.hp('0.5%'),
        justifyContent: 'space-around'
    },
    button: {
        borderRadius: 5,
        justifyContent: 'center',
        borderWidth: 1,
    },
    TextButton: {
        color: 'white',
        textAlign: 'center',
        fontSize: 17,
        fontFamily: GLOBALS.font.Poppins
    }
})