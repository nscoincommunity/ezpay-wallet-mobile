import React, { Component } from 'react'
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Header from '../../components/header';
import ImageApp from '../../../helpers/constant/image';
import Color from '../../../helpers/constant/color';
import Gradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { widthPercentageToDP as wp, heightPercentageToDP as hp, responsiveFontSize as font_size } from '../../../helpers/constant/responsive';
import { getStatusBarHeight } from 'react-native-iphone-x-helper'
import { bindActionCreators } from 'redux';
import { Func_Settings } from '../../../redux/rootActions/easyMode'
import TouchID from 'react-native-touch-id'
import Settings from '../../../settings/initApp'
import { setStorage } from '../../../helpers/storages'


export class Menu extends Component {


    changeTouchID = (value) => {
        console.log(value)
        let optionalConfig = {
            unifiedErrors: false,
            passcodeFallback: true
        }
        TouchID.isSupported(optionalConfig).then(isSupporter => {
            console.log('supported', isSupporter)
            if (isSupporter) {
                let options = {
                    title: "Ez Pay", // Android
                    sensorDescription: 'Touch sensor', // Android
                    sensorErrorDescription: 'Failed', // Android
                    cancelText: 'Cancel', // Android
                    fallbackLabel: "", // iOS (if empty, then label is hidden)
                }
                TouchID.authenticate('Scan ' + isSupporter + ' to process').then((auth, error) => {
                    if (error) {
                        console.log('errrrr', error)
                        Alert.alert(
                            'Error',
                            error,
                            [{ text: 'Ok', style: 'default' }]
                        )
                    } else {
                        console.log('Touch id', auth)
                        Settings.ez_turn_on_fingerprint = value;
                        setStorage('setting', JSON.stringify(Settings)).then(() => {
                            this.props.Func_Settings(Settings);
                        })

                    }
                }).catch(err => {
                    console.log('err', err)
                })
            } else {
                Alert.alert(
                    'Error',
                    'Your device not support ' + isSupporter,
                    [{ text: 'Ok', style: 'default' }]
                )
            }
        })
    }

    render() {
        let SETTINGS = this.props.settings

        return (
            <Gradient
                colors={Color.Gradient_backgound_page}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ flex: 1 }}
            >
                <Header
                    Title="Menu settings"
                    styleTitle={{ color: Color.Tomato }}
                />
                <View style={{ flex: 1, padding: hp('1') }}>
                    <ScrollView>

                        {/********* Card favorite **********/}
                        <Text style={styles.textHeader}>Favorite</Text>
                        <View style={styles.containerMenu}>
                            <TouchableOpacity
                                style={{ paddingVertical: 5 }}
                                onPress={() => this.props.navigation.navigate('Favorite')}
                            >
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flex: 1, justifyContent: 'center' }}>
                                        <Icon name="contacts" size={font_size(3)} />
                                    </View>
                                    <View style={{ flex: 8, justifyContent: 'center' }}>
                                        <Text>Manage Favorite</Text>
                                    </View>
                                    <View style={{ flex: 1, justifyContent: 'center' }}>
                                        <Icon name="chevron-right" size={font_size(3)} />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/*********  Card Secure  ********/}
                        <Text style={styles.textHeader}>Secure</Text>
                        <View style={styles.containerMenu}>
                            <View
                                style={{ paddingVertical: 5 }}
                            >
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flex: 1, justifyContent: 'center' }}>
                                        <Icon name="fingerprint" size={font_size(3)} />
                                    </View>
                                    <View style={{ flex: 8, justifyContent: 'center' }}>
                                        <Text>Use Touch ID</Text>
                                    </View>
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <Switch value={SETTINGS.ez_turn_on_fingerprint} onValueChange={(value) => this.changeTouchID(value)} />
                                    </View>
                                </View>
                            </View>

                            <TouchableOpacity
                                style={{ paddingVertical: 5 }}
                                onPress={() => this.props.navigation.navigate('Passcode_settings')}
                            >
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flex: 1, justifyContent: 'center' }}>
                                        <Icon name="textbox-password" size={font_size(3)} />
                                    </View>
                                    <View style={{ flex: 8, justifyContent: 'center' }}>
                                        <Text>Use Password</Text>
                                    </View>
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <Icon name="chevron-right" size={font_size(3)} />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>


                        {/********* Card Community **********/}

                        <Text style={styles.textHeader}>Community</Text>
                        <View style={styles.containerMenu}>
                            <TouchableOpacity
                                style={{ paddingVertical: 5 }}
                            >
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flex: 1, justifyContent: 'center' }}>
                                        <Icon name="telegram" size={font_size(3)} color="#0088cc" />
                                    </View>
                                    <View style={{ flex: 8, justifyContent: 'center' }}>
                                        <Text>Telegram</Text>
                                    </View>
                                    <View style={{ flex: 1, justifyContent: 'center' }}>
                                        <Icon name="chevron-right" size={font_size(3)} />
                                    </View>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{ paddingVertical: 5 }}
                            >
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flex: 1, justifyContent: 'center' }}>
                                        <Icon name="twitter" size={font_size(3)} color="#38A1F3" />
                                    </View>
                                    <View style={{ flex: 8, justifyContent: 'center' }}>
                                        <Text>Twitter</Text>
                                    </View>
                                    <View style={{ flex: 1, justifyContent: 'center' }}>
                                        <Icon name="chevron-right" size={font_size(3)} />
                                    </View>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{ paddingVertical: 5 }}
                            >
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flex: 1, justifyContent: 'center' }}>
                                        <Icon name="facebook" size={font_size(3)} color="#4267b2" />
                                    </View>
                                    <View style={{ flex: 8, justifyContent: 'center' }}>
                                        <Text>Facebook</Text>
                                    </View>
                                    <View style={{ flex: 1, justifyContent: 'center' }}>
                                        <Icon name="chevron-right" size={font_size(3)} />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/********* Card About us **********/}


                        <Text style={styles.textHeader}>About us</Text>
                        <View style={styles.containerMenu}>
                            <TouchableOpacity
                                style={{ paddingVertical: 5 }}
                            >
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flex: 1, justifyContent: 'center' }}>
                                        <Icon name="google-play" size={font_size(3)} color={Color.Medium_turquoise} />
                                    </View>
                                    <View style={{ flex: 8, justifyContent: 'center' }}>
                                        <Text>Rate EZ on Google Play</Text>
                                    </View>
                                    <View style={{ flex: 1, justifyContent: 'center' }}>
                                        <Icon name="chevron-right" size={font_size(3)} />
                                    </View>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{ paddingVertical: 5 }}
                            >
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flex: 1, justifyContent: 'center' }}>
                                        <Icon name="briefcase" size={font_size(3)} color="#61473D" />
                                    </View>
                                    <View style={{ flex: 8, justifyContent: 'center' }}>
                                        <Text>Privacy & terms</Text>
                                    </View>
                                    <View style={{ flex: 1, justifyContent: 'center' }}>
                                        <Icon name="chevron-right" size={font_size(3)} />
                                    </View>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{ paddingVertical: 5 }}
                            >
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flex: 1, justifyContent: 'center' }}>
                                        <Icon name="information" size={font_size(3)} color="#FFB818" />
                                    </View>
                                    <View style={{ flex: 8, justifyContent: 'center' }}>
                                        <Text>About</Text>
                                    </View>
                                    <View style={{ flex: 1, justifyContent: 'center' }}>
                                        <Icon name="chevron-right" size={font_size(3)} />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>


                        {/********* Card Advanced settings **********/}
                        <Text style={styles.textHeader}>Advanced</Text>
                        <View style={styles.containerMenu}>
                            <TouchableOpacity
                                style={{ paddingVertical: 5 }}
                            >
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flex: 1, justifyContent: 'center' }}>
                                        <Icon name="settings" size={font_size(3)} />
                                    </View>
                                    <View style={{ flex: 8, justifyContent: 'center' }}>
                                        <Text>Advanced settings</Text>
                                    </View>
                                    <View style={{ flex: 1, justifyContent: 'center' }}>
                                        <Icon name="chevron-right" size={font_size(3)} />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>




                        <View style={styles.version}>
                            <Text style={{ color: Color.Tomato, textAlign: 'center' }}>Ez Pay - V0.1.1</Text>
                        </View>
                    </ScrollView>
                </View>

            </Gradient>
        )
    }
}

const styles = StyleSheet.create({
    containerMenu: {
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: hp('2')
    },
    textHeader: {
        fontSize: font_size('2.5'),
        fontWeight: 'bold',
        marginVertical: 10,
    },
    version: {
        paddingVertical: 10
    }
})

const mapStateToProps = (state) => {
    return {
        settings: state.Settings
    }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ Func_Settings }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu)
