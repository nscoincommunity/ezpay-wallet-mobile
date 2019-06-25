import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated, Easing, Alert } from 'react-native';
import Gradient from 'react-native-linear-gradient';
import Color from '../../../../helpers/constant/color';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../../components/header';
import { utils } from 'ethers';
import { heightPercentageToDP as hp, widthPercentageToDP as wp, responsiveFontSize as font_size } from '../../../../helpers/constant/responsive';
import Settings from '../../../../settings/initApp'
import { signMessageDapps } from '../dapp.service'
import FormPassword from './confirm-password'

export default class signMessage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dialogVisible: false,
            passcode: ''
        }
        this.params = this.props.navigation.state.params
    }

    onSignPersonalMessage = () => {
        if (Settings.ez_turn_on_passcode) {
            this.modalConfirm.openModal(this.params)
        } else {
            this.handleSign()
        }
    }

    handleSign() {
        const { params } = this.props.navigation.state;
        console.log('sss', this.props)
        signMessageDapps(utils.toUtf8String(params.object.data), this.state.passcode, params.pk_en)
            .then(tx => {
                console.log('tx', tx)
                params.callBack(params.id, tx);
                this.props.navigation.goBack()
            }).catch(e => {
                setTimeout(() => {
                    Alert.alert(
                        'Error',
                        e,
                        [{ text: 'Ok', style: 'cancel' }]
                    )
                }, 350)
            })
    }

    render() {
        const { params } = this.props.navigation.state
        const info = utils.toUtf8String(params.object.data)
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
                    Title='Sign message'
                    styleTitle={{ color: Color.Tomato }}
                />
                <View style={[styles.container, { flexDirection: 'column' }]}>
                    <View style={{ flex: 7 }}>
                        <Text style={[styles.standardText, { marginTop: 15, alignSelf: 'center' }]}>
                            Only authorize signature from sources that
                    </Text>
                        <Text style={[styles.standardText, { alignSelf: 'center' }]}>
                            you trust.
                    </Text>
                        <View style={[styles.item, { marginTop: 30 }]}>
                            <Text style={styles.key}>
                                Requester
                        </Text>
                            <Text style={[styles.standardText, { marginTop: 10 }]}>
                                {params.url}
                            </Text>
                        </View>
                        <View style={styles.line} />
                        <View style={[styles.item, { marginTop: 20 }]}>
                            <Text style={styles.key}>
                                Message
                        </Text>
                            <Text style={[styles.standardText, { marginTop: 10 }]}>
                                {info}
                            </Text>
                        </View>
                    </View>
                    <View style={{ flex: 3, justifyContent: 'center', paddingHorizontal: wp('20%') }}>
                        <TouchableOpacity
                            onPress={() => this.onSignPersonalMessage()}
                            disabled={this.state.disable_btn_send}
                        >
                            <Gradient
                                colors={Color.Gradient_button_tomato}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.buttonSign}
                            >
                                <View style={{ justifyContent: 'center' }}>
                                    <Text style={{ color: '#fff', fontSize: font_size('2.5') }}>Sign</Text>
                                </View>
                                <View style={{ justifyContent: 'center' }}>
                                    <Icon name="arrow-right" size={font_size(3.5)} color="#fff" />
                                </View>
                            </Gradient>
                        </TouchableOpacity>
                    </View>
                    <FormPassword
                        ref={r => this.modalConfirm = r}
                        isAuth={this.handleSign}
                        canBack={true}
                        type='sign_message'
                        {...this.props}
                        gasPrice={0}
                    />
                </View>
            </Gradient>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: hp('1'),
    },
    standardText: {
        fontSize: font_size(1.8),
    },
    item: {
        paddingLeft: 20,
        paddingRight: 20
    },
    line: {
        height: 1,
        backgroundColor: '#14192D',
        marginLeft: 20,
        marginRight: 20,
        marginTop: 15
    },
    key: {
        fontSize: font_size(2.3),
        marginTop: 15,
        fontWeight: 'bold',
    },
    buttonSign: {
        paddingHorizontal: wp('3%'),
        paddingVertical: hp('1.5%'),
        borderRadius: 7,
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
})

