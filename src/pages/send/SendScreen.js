import React, { Component } from 'react'
import {
    Text,
    View,
    ScrollView,
    KeyboardAvoidingView,
    StatusBar,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TextInput,
    Keyboard,
    Image,
    Platform
} from 'react-native'
import GLOBALS from '../../helper/variables';
import Header from '../../components/header';
import { getBottomSpace, getStatusBarHeight } from 'react-native-iphone-x-helper'
import { connect } from 'react-redux';
import Gradient from 'react-native-linear-gradient';
import { KeyboardAwareScrollView } from '../../../libs/keyboard-aware-scroll-view'

class SendScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedTK: 'nexty',
            height: 0,
            typeKeyboard: false,
        }
    }

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            this.keyboardDidShow,
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            this.keyboardDidHide,
        );
    }

    keyboardDidShow = e => this.setState({ height: e.endCoordinates.height, typeKeyboard: true })

    keyboardDidHide = () => this.setState({ height: 0, typeKeyboard: false })

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    render() {
        // let ListToken = [{ name: this.props.navigation.getParam('payload').network }];

        // let ListToken = this.props.navigation.getParam('payload').ListToken;
        // if (ListToken[0].name != this.props.navigation.getParam('payload').network) {
        //     ListToken.unshift({ name: this.props.navigation.getParam('payload').network })
        // }
        // console.log(ListToken)

        const { ListToken, network } = this.props.DataToken;
        if (ListToken[0].name != network) {
            var ArrayToken = [{ name: network }].concat(ListToken)
        }

        return (
            <View style={styles.container}>
                <Header
                    backgroundColor="transparent"
                    colorIconLeft="#328FFC"
                    colorTitle="#328FFC"
                    nameIconLeft="times"
                    title="Send"
                    style={{ paddingTop: getStatusBarHeight() }}
                    pressIconLeft={() => { this.props.navigation.goBack(); }}
                />
                <View style={{ flex: 1 }}>
                    <KeyboardAwareScrollView
                        contentContainerStyle={{ flex: 1 }}
                        keyboardDismissMode="interactive"
                        keyboardShouldPersistTaps="always"
                        getTextInputRefs={() => {
                            return [this._firstNameTI, this._lastNameTI, this._countryTI, this._stateTI, this._addrTI, this._emailTI, this._msgTI, this._notesTI];
                        }}
                    >
                        {/* <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flex: 1 }}>
                        <KeyboardAvoidingView
                            style={{ flex: 1 }}
                            behavior={Platform.OS == 'ios' ? 'padding' : 'position'}
                            enabled
                            keyboardVerticalOffset={Platform.OS == 'ios' ? this.state.height : GLOBALS.hp('-50%')}
                            contentContainerStyle={{ flex: 1, }}
                        > */}
                        <View style={{ flex: 1, paddingHorizontal: GLOBALS.hp('2%') }}>
                            <View style={{ flex: 1, backgroundColor: '#F2F2F2' }}>
                                <FlatList
                                    contentContainerStyle={{ alignItems: 'center' }}
                                    horizontal={true}
                                    data={ArrayToken}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <TouchableOpacity
                                                onPress={() => this.Selected(item)}
                                                style={
                                                    selectedBtn(this.state.selectedTK === item.name).selected
                                                }
                                            >
                                                <Text style={[selectedBtn(this.state.selectedTK === item.name).text]}>{item.name}</Text>
                                            </TouchableOpacity>
                                        )
                                    }}
                                    keyExtractor={(item, index) => item.name}
                                />
                            </View>
                            <View style={[styles.Form, { flex: 1, justifyContent: 'center', paddingHorizontal: GLOBALS.wp('2%') }]}>
                                <InputComponent
                                    value="abc"
                                    editable={true}
                                    placeholder="ahihi"
                                    onchange={() => { alert('ahihi') }}
                                    returnKeyType={"next"}
                                    blurOnsubmit={false}
                                    onSubmitEditing={() => alert('submit')}
                                    icon_button={'../../images/icon/qr-code.png'}
                                />
                            </View>
                            <View style={[styles.Form, { flex: 7, paddingHorizontal: GLOBALS.wp('2') }]}>
                                <InputComponent
                                    value="abc"
                                    editable={true}
                                    placeholder="ahihi"
                                    onchange={() => { alert('ahihi') }}
                                    returnKeyType={"next"}
                                    blurOnsubmit={false}
                                    onSubmitEditing={() => alert('submit')}
                                    icon_button={'../../images/icon/qr-code.png'}
                                />
                                <InputComponent
                                    value="abc"
                                    editable={true}
                                    placeholder="ahihi"
                                    onchange={() => { alert('ahihi') }}
                                    returnKeyType={"next"}
                                    blurOnsubmit={false}
                                    onSubmitEditing={() => alert('submit')}
                                    icon_button={'../../images/icon/qr-code.png'}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <TouchableOpacity style={styles.buttonShare}>
                                    <Gradient
                                        style={{ paddingVertical: 15, borderRadius: 5 }}
                                        colors={['#08AEEA', '#328FFC']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                    >
                                        <Text style={{ textAlign: 'center', color: '#fff' }}>Share</Text>
                                    </Gradient>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </KeyboardAwareScrollView>
                    {/* </KeyboardAvoidingView>
                    </ScrollView> */}
                    {/* {
                        this.state.typeKeyboard &&
                        <View style={{ flex: 1, width: GLOBALS.wp('100%'), position: 'absolute', zIndex: 10, backgroundColor: 'pink', bottom: this.state.height }}>
                            <TouchableOpacity style={styles.buttonSend}>
                                <Gradient
                                    style={{ paddingVertical: 15, borderRadius: 5 }}
                                    colors={['#08AEEA', '#328FFC']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                >
                                    <Text style={{ textAlign: 'center', color: '#fff' }}>Share</Text>
                                </Gradient>
                            </TouchableOpacity>
                        </View>
                    } */}
                </View>
            </View>
        )
    }
}



class InputComponent extends Component {
    render() {
        const {
            value,
            editable,
            style,
            placeholder,
            onchange,
            returnKeyType,
            blurOnsubmit,
            onSubmitEditing,
            onpressButton,
            icon_button,
            keyboardType
        } = this.props
        return (
            <View style={{ flexDirection: 'row' }}>
                <TextInput
                    value={value}
                    editable={editable}
                    style={[styles.StyleInput, style]}
                    placeholder={placeholder}
                    onChangeText={onchange}
                    returnKeyType={returnKeyType}
                    blurOnSubmit={blurOnsubmit}
                    onSubmitEditing={onSubmitEditing}
                    keyboardType={keyboardType}
                    underlineColorAndroid="transparent"
                />
                <TouchableOpacity

                    style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}
                >
                    <Image source={require('../../images/icon/qr-code.png')} />
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F2'
    },
    StyleInput: {
        fontSize: GLOBALS.fontsize(3),
        flex: 9,
        fontFamily: GLOBALS.font.Poppins,
        paddingBottom: Platform.OS == 'ios' ? 'auto' : 0
    },
    Form: {
        // padding: GLOBALS.hp('2%'),
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
    buttonSend: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2.27,
        elevation: 7,
    }
})
const selectedBtn = (type) => StyleSheet.create({
    selected: {
        backgroundColor: type ? '#EDA420' : '#F2F2F2',
        borderRadius: 20,
        justifyContent: 'center',
        alignContent: 'center',
        shadowColor: "#000",
        paddingVertical: GLOBALS.hp('1%'),
        paddingHorizontal: GLOBALS.wp('3%'),
        marginHorizontal: GLOBALS.wp('2%'),
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
    },

})

const mapStateToProps = state => {
    return {
        DataToken: state.getListToken,
    }
}
export default connect(mapStateToProps, null)(SendScreen)