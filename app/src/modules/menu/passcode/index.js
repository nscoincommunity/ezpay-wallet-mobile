import React, { Component } from 'react'
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Alert } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Header from '../../../components/header';
import ImageApp from '../../../../helpers/constant/image';
import Color from '../../../../helpers/constant/color';
import Gradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { widthPercentageToDP as wp, heightPercentageToDP as hp, responsiveFontSize as font_size } from '../../../../helpers/constant/responsive'
import { setStorage, getStorage } from '../../../../helpers/storages'
import RBSheet from '../../../../lib/bottom-sheet'
import { Fumi } from '../../../components/text-input-effect'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Func_Settings } from '../../../../redux/rootActions/easyMode'
import Settings from '../../../../settings/initApp'
import { Encrypt_password, Encrypt } from '../../../../services/index.account'

class Passcode_settings extends Component {
    state = {
        type_open_RBsheet: true,
        value_switch: this.props.SETTINGS.ez_turn_on_passcode
    }

    changeSwitch = (value) => {
        if (value) {
            getStorage('password').then(async password => {
                console.log(password)
                if (password) {
                    Settings.ez_turn_on_passcode = await true;
                    await setStorage('setting', JSON.stringify(Settings))
                    this.props.Func_Settings(Settings);
                    this.setState({ value_switch: true })
                } else {
                    this.setState({ type_open_RBsheet: true }, () => {
                        this.RBSheet.open()
                    })
                }
            }).catch(err => console.log(err))
        } else {
            this.props.navigation.navigate('FormPassword', {
                payload: {
                    canBack: true,
                    isAuth: this.isAuth
                }
            })

        }
    }

    isAuth = async () => {
        Settings.ez_turn_on_passcode = await false;
        Settings.ez_turn_on_fingerprint = await false;
        this.setState({ value_switch: false })
        await setStorage('setting', JSON.stringify(Settings))
        await this.props.Func_Settings(Settings);
    }

    componentWillReceiveProps() {
        console.log('aaa')
    }

    Func_button_change = () => {
        this.setState({ type_open_RBsheet: false }, () => {
            this.RBSheet.open()
        })
    }

    closeRBS = () => {
        this.RBSheet.close()
    }

    render() {
        // console.log('state on render', this.props.SETTINGS.ez_turn_on_passcode)
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
                    Title="Favorite"
                    styleTitle={{ color: Color.Tomato }}
                />
                <View style={styles.container}>

                    <View style={styles.form_switch}>
                        <View style={styles.title_form}>
                            <Text>Enable password</Text>
                        </View>
                        <View style={styles.button_switch}>
                            <Switch value={this.state.value_switch} onValueChange={(value) => this.changeSwitch(value)} />
                        </View>
                    </View>

                    {
                        this.state.value_switch &&
                        <View style={styles.formChangePasscode}>
                            <TouchableOpacity
                                onPress={() => this.Func_button_change()}
                            >
                                <Gradient
                                    colors={Color.Gradient_button_tomato}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.styleButton}
                                >
                                    <View style={{ justifyContent: 'center' }}>
                                        <Text style={{ color: '#fff', fontSize: font_size('2.5') }}>Change password</Text>
                                    </View>
                                    <View style={{ justifyContent: 'center' }}>
                                        <Icon name="arrow-right" size={font_size(3.5)} color="#fff" />
                                    </View>
                                </Gradient>
                            </TouchableOpacity>
                        </View>
                    }
                </View>

                <RBSheet
                    ref={ref => {
                        this.RBSheet = ref;
                    }}
                    closeOnDragDown={true}
                    height={hp('100')}
                    duration={250}
                >
                    <Formpassword
                        type={this.state.type_open_RBsheet}
                        closeRBS={this.closeRBS}
                        {...this.props}
                    />
                </RBSheet>
            </Gradient>
        )
    }
}


class Formpassword extends Component {
    constructor(props) {
        super(props)

    }
    state = {
        txt_password: '',
        err_password: false,
        txt_confirm_password: '',
        err_confirm_password: false,
        disable_button: true,
        txt_password_old: '',
        err_password_old: false
    }

    change_txt_password_old = (value) => {
        this.setState({ txt_password_old: value })
    }

    change_txt_password = async (value) => {
        this.setState({ txt_password: value })
        if (value.length > 5) {
            await this.setState({ err_password: false, disable_button: true })
        } else {
            await this.setState({ err_password: true, disable_button: false })
        }

        if (this.state.txt_confirm_password == '' || this.state.txt_confirm_password == value) {
            await this.setState({ err_confirm_password: false })
        } else {
            await this.setState({ err_confirm_password: true })
        }
        if (this.state.txt_password == '' || this.state.txt_confirm_password == '' || this.state.err_password == true || this.state.err_confirm_password == true) {
            await this.setState({ disable_button: true })
        } else {
            await this.setState({ disable_button: false })
        }
    }

    change_txt_confirm_password = (value) => {
        this.setState({ txt_confirm_password: value })
        if (this.state.txt_password && this.state.txt_password == value) {
            this.setState({ err_confirm_password: false, disable_button: false })
        } else {
            this.setState({ err_confirm_password: true, disable_button: true })
        }
        // if (this.state.err_confirm_password) {
        //     this.setState({ disable_button: true })
        // }
    }

    Func_button_create_password = () => {
        Settings.ez_turn_on_passcode = true;
        setStorage('setting', JSON.stringify(Settings)).then(() => {
            Encrypt_password(this.state.txt_password).then(pwd_en => {
                setStorage('password', pwd_en);
                this.props.Func_Settings(Settings);
                this.props.closeRBS()
            }).catch(e => console.log(e))
        })
    }

    Func_button_update_password = () => {
        Encrypt_password(this.state.txt_password_old).then(pwd_old => {
            getStorage('password').then(async pwd => {
                if (pwd == pwd_old) {
                    setStorage('password', await Encrypt(this.state.txt_password)).then(ss => {
                        Alert.alert(
                            'Success',
                            'Change password success',
                            [{ text: 'Ok', style: 'default', onPress: () => this.props.closeRBS() }]
                        )
                    })
                } else {
                    Alert.alert(
                        'Error',
                        'Incorrect old password',
                        [{ text: 'Ok', style: 'default' }]
                    )
                }
            }).catch(err => console.log(err))
        })

    }

    render() {
        return (
            <Gradient
                colors={Color.Gradient_backgound_page}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ flex: 1 }}
            >
                <Header
                    IconLeft="arrow-back"
                    onPressLeft={this.props.closeRBS}
                    Title={this.props.type ? "Create password" : "Update password"}
                    styleTitle={{ color: Color.Tomato }}
                />
                <View style={styles.container}>
                    <ScrollView keyboardShouldPersistTaps='handled'>
                        {
                            !this.props.type &&
                            <View style={stylePassword.formInput}>
                                <Fumi
                                    ref={(r) => { this.name = r; }}
                                    label={'Password old'}
                                    iconClass={FontAwesomeIcon}
                                    iconName={'lock'}
                                    iconColor={'#f95a25'}
                                    iconSize={25}
                                    iconWidth={40}
                                    inputPadding={16}
                                    onChangeText={(value) => { this.change_txt_password_old(value) }}
                                    value={this.state.txt_password_old}
                                    onSubmitEditing={() => { this.password.focus() }}
                                    returnKeyType="next"
                                    numberOfLines={1}
                                    secureTextEntry={true}
                                />
                            </View>
                        }

                        <View style={stylePassword.formInput}>
                            <Fumi
                                ref={(r) => { this.password = r; }}
                                label={this.props.type ? 'Password' : 'Password new'}
                                iconClass={FontAwesomeIcon}
                                iconName={'lock'}
                                iconColor={'#f95a25'}
                                iconSize={25}
                                iconWidth={40}
                                inputPadding={16}
                                onChangeText={(value) => { this.change_txt_password(value) }}
                                value={this.state.txt_password}
                                onSubmitEditing={() => { this.confirmpwd.focus() }}
                                returnKeyType="next"
                                numberOfLines={1}
                                secureTextEntry={true}
                            />
                        </View>
                        {
                            this.state.err_password &&
                            <Text style={{ color: Color.Danger }}>Password needs at least 6 characters</Text>
                        }

                        <View style={stylePassword.formInput}>
                            <Fumi
                                ref={(r) => { this.confirmpwd = r; }}
                                label={this.props.type ? 'Confirm password' : 'Confirm password new'}
                                iconClass={FontAwesomeIcon}
                                iconName={'lock'}
                                iconColor={'#f95a25'}
                                iconSize={25}
                                iconWidth={40}
                                inputPadding={16}
                                onChangeText={(value) => { this.change_txt_confirm_password(value) }}
                                value={this.state.txt_confirm_password}
                                onSubmitEditing={() => this.props.type ? this.Func_button_create_password() : this.Func_button_update_password()}
                                returnKeyType="done"
                                numberOfLines={1}
                                secureTextEntry={true}
                            />
                        </View>
                        {
                            this.state.err_confirm_password &&
                            <Text style={{ color: Color.Danger }}>Password do not match</Text>
                        }

                        <View style={styles.formChangePasscode}>
                            <TouchableOpacity
                                onPress={() => this.props.type ? this.Func_button_create_password() : this.Func_button_update_password()}
                            >
                                <Gradient
                                    colors={this.state.disable_button ? Color.Gradient_gray_switch : Color.Gradient_button_tomato}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.styleButton}
                                >
                                    <View style={{ justifyContent: 'center' }}>
                                        <Text style={{ color: '#fff', fontSize: font_size('2.5') }}>Create password</Text>
                                    </View>
                                    <View style={{ justifyContent: 'center' }}>
                                        <Icon name="arrow-right" size={font_size(3.5)} color="#fff" />
                                    </View>
                                </Gradient>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </Gradient>
        )
    }
}

const stylePassword = StyleSheet.create({
    formInput: {
        backgroundColor: '#fff',
        borderRadius: 5,
        marginTop: hp('3')
    }
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: hp('1'),
    },
    form_switch: {
        flexDirection: 'row',
        padding: hp('1'),
        backgroundColor: '#fff',
        borderRadius: 5,
    },
    title_form: {
        flex: 8,
        justifyContent: 'center'
    },
    button_switch: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    formChangePasscode: {
        padding: wp('15'),
    },
    styleButton: {
        paddingHorizontal: wp('2%'),
        paddingVertical: hp('1.3%'),
        borderRadius: hp('1.3'),
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
})

const mapStateToProps = state => {
    // console.log('state func mapStateToProps', state.Settings.ez_turn_on_passcode)
    return {
        SETTINGS: state.Settings
    }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ Func_Settings }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Passcode_settings)
