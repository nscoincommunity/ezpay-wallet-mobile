import React, { Component } from 'react';
import { StyleSheet, Platform, Text, View, Image, TouchableOpacity, KeyboardAvoidingView, ScrollView, Linking, Modal } from 'react-native';
import { Form, Item, Input, Label } from 'native-base'
import GLOBALS from '../../helper/variables';
import { checkIOS, Register } from '../../services/auth.service';


class ScreenRegister extends Component {
    constructor(props) {
        super(props)

        this.state = {
            password: '',
            confirmpassword: '',
            submit: false,
            TexterrorPw: '',
            TexterrorCPw: '',
            errorPw: false,
            errorCPw: false,
            typeButton: true,
            // visibaleMd: false
        };
    };


    async  register() {
        // this.setState({ visibaleMd: true })
        Register(this.state.password)
        const { navigate } = this.props.data.navigation;
        navigate('TabNavigator');
        // if (Platform.OS == 'ios') {
        // var timer = setInterval(() => {
        //     switch (checkIOS) {
        //         case 0:
        //             console.log(checkIOS);
        //             console.log(this.state.visibaleMd);
        //             break;
        //         case 1:
        //             clearInterval(timer);
        //             console.log(checkIOS);
        //             this.setState({ visibaleMd: false });
        //             alert('please save keystore to continue');
        //             console.log(this.state.visibaleMd)
        //             break
        //         case 2:
        //             clearInterval(timer);
        //             console.log(checkIOS);
        //             this.setState({ visibaleMd: false });
        //             const { navigate } = this.props.data.navigation;
        //             navigate('TabNavigator');
        //             console.log(this.state.visibaleMd)

        //             break
        //         default:
        //             console.log(checkIOS);
        //             clearInterval(timer);
        //             this.setState({ visibaleMd: false });
        //             alert('Error');
        //             console.log(this.state.visibaleMd)

        //             break;
        //     }
        // }, 1000)
        // } else {
        //     const { navigate } = this.props.data.navigation;
        //     navigate('TabNavigator');
        // }
    }
    async validatePass(value) {
        this.setState({ password: value })
        if (value.length > 5) {
            await this.setState({ TexterrorPw: '', errorPw: false, typeButton: false });
        } else {
            await this.setState({ TexterrorPw: 'Wallet local passcode needs at least 6 character', errorPw: true, typeButton: true })
        }

        if (this.state.confirmpassword == '' || this.state.confirmpassword == value) {
            await this.setState({ TexterrorCPw: '', errorCPw: false });
        } else {
            await this.setState({ TexterrorCPw: 'Wallet local passcode not match', errorCPw: true })
        }
        if (this.state.password == '' || this.state.confirmpassword == '' || this.state.errorCPw == true || this.state.errorPw == true) {
            await this.setState({ typeButton: true })
        } else {
            await this.setState({ typeButton: false })
        }

    }
    validateConfirmPass(value) {
        this.setState({ confirmpassword: value })
        if (this.state.password && this.state.password == value) {
            this.setState({ TexterrorCPw: '', errorCPw: false, typeButton: false });
        } else {
            this.setState({ TexterrorCPw: 'Wallet local passcode not match', errorCPw: true, typeButton: true })
        }
        if (this.state.errorPw == true) {
            this.setState({ typeButton: true })
        }
    }
    render() {
        return (
            <View style={style.container}>
                {/* <ModalLoading visibleModal={this.state.visibaleMd} /> */}
                <Image style={style.logo} source={require('../../images/logo-with-text.png')} resizeMode="contain" />
                <Form style={style.FormLogin}
                >
                    <Item floatingLabel error={this.state.errorPw}>
                        <Label style={{ fontFamily: GLOBALS.font.Poppins }}>Wallet local passcode</Label>
                        <Input secureTextEntry={true}
                            onChangeText={(value) => { this.validatePass(value) }}
                        />
                    </Item>
                    <Item style={{ borderBottomWidth: 0 }}>
                        <Text style={{ color: GLOBALS.Color.danger }}>{this.state.TexterrorPw}</Text>
                    </Item>
                    <Item floatingLabel error={this.state.errorCPw}>
                        <Label style={{ fontFamily: GLOBALS.font.Poppins }}>Comfirm wallet local passcode</Label>
                        <Input secureTextEntry={true}
                            onChangeText={(value) => { this.validateConfirmPass(value) }}
                        />
                    </Item>
                    <Item style={{ borderBottomWidth: 0 }}>
                        <Text style={{ color: GLOBALS.Color.danger }}>{this.state.TexterrorCPw}</Text>
                    </Item>
                </Form>
                <Text style={{ fontFamily: GLOBALS.font.Poppins }}>By creating a new wallet you agree to the </Text>
                <Text style={{ color: GLOBALS.Color.primary, marginBottom: GLOBALS.HEIGHT / 20, fontFamily: GLOBALS.font.Poppins }} onPress={() => { Linking.openURL('https://nexty.io/privacy-policy.html') }}> Term of Service</Text>

                <View style={style.FormRouter}>
                    <TouchableOpacity style={typeButton(GLOBALS.Color.secondary, this.state.typeButton).button} onPress={this.register.bind(this)} disabled={this.state.typeButton}>
                        <Text style={style.TextButton}>Create wallet</Text>
                    </TouchableOpacity>
                </View>
            </View>

        )
    }

}
export default class register extends Component {

    render() {
        return (
            <ScrollView >
                <KeyboardAvoidingView style={style.container} behavior="position" keyboardVerticalOffset={65} enabled>
                    <ScreenRegister data={this.props}></ScreenRegister>
                </KeyboardAvoidingView>
            </ScrollView>
        );
    }
}

// class ModalLoading extends Component {
//     render() {
//         console.log(this.props.visibleModal)
//         return (
//             <Modal visible={this.props.visibleModal} >
//                 <View style={StyleModal(false).ConfigModal}>

//                     <Image style={{ height: GLOBALS.HEIGHT / 3, width: GLOBALS.WIDTH / 3 }} source={require('../../images/loading.gif')} resizeMode="contain" />
//                 </View>
//             </Modal>
//         )
//     }
// }


var typeButton = (color, type) => StyleSheet.create({
    button: {
        backgroundColor: type == true ? '#cccccc' : color,
        marginBottom: GLOBALS.HEIGHT / 40,
        height: GLOBALS.HEIGHT / 17,
        justifyContent: 'center',
        width: GLOBALS.WIDTH / 1.6
    }
})

// var StyleModal = (visibale) => StyleSheet.create({
//     ConfigModal: {
//         position: 'absolute',
//         top: 0,
//         bottom: 0,
//         left: 0,
//         right: 0,
//         zIndex: 1,
//         backgroundColor: 'rgba(255,255,255,0.5)',
//         justifyContent: 'center',
//         alignItems: 'center',
//         height: GLOBALS.HEIGHT
//     }
// })

const style = StyleSheet.create({
    container: {
        flex: 1,
        // marginTop: Platform.OS === 'ios' ? 25 : 0,
        alignItems: 'center',
    },
    logo: {
        height: GLOBALS.HEIGHT / 3,
        width: GLOBALS.WIDTH / 1.6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    FormRouter: {
        paddingLeft: GLOBALS.WIDTH / 5,
        paddingRight: GLOBALS.WIDTH / 5
    },
    TextButton: {
        color: 'white',
        textAlign: 'center',
        fontSize: 15,
        fontFamily: GLOBALS.font.Poppins
    },
    FormLogin: {
        width: GLOBALS.WIDTH,
        marginBottom: GLOBALS.HEIGHT / 50,
    }
})