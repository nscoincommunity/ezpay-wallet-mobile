import React, { Component } from 'react'
import {
    View,
    TouchableOpacity,
    TouchableWithoutFeedback,
    StyleSheet,
    BackHandler,
    Platform,
    Text,
    Image,
    Modal,
    ActivityIndicator,
    StatusBar
} from 'react-native';
import GLOBALS from '../../helper/variables';
import { POSTAPI } from '../../helper/utils'
import Icon from "react-native-vector-icons/FontAwesome";
import Language from '../../i18n/i18n'
import IconFeather from "react-native-vector-icons/Feather"
import { HandleCoupon } from './redeem.service';
import Gradient from 'react-native-linear-gradient';
import Header from '../../components/header';

export default class Redeem extends Component {

    mounted: boolean = true;

    initState = {
        error: false,
        amount: '',
        loadding: true,
        RedeemStatus: '',
        activity: false,
    }

    constructor(props) {
        super(props)
        this.state = this.initState;
    };


    setFalse() {
        this.setState({
            error: false,
        })
    }

    onSelect = data => {
        console.log(data)
        this.setState({ activity: false })
        if (data['result'] == 'cancelScan') {
            this.setState({ RedeemStatus: 'ER01', error: true })
            return;
        }
        if (data['result'] != null) {
            try {
                var dataCoupon = JSON.parse("{" + data['result'] + "}");
                if (!dataCoupon['appName'] || dataCoupon['appName'] != 'nexty-wallet' || dataCoupon['privateKey'] == '' || dataCoupon['privateKey'].length != 64) {
                    this.setState({ RedeemStatus: 'ER01', error: true })
                    console.log('ko phai QR')
                } else {
                    HandleCoupon(dataCoupon['privateKey']).then(async (res) => {
                        await this.setState({ RedeemStatus: 'SS01', amount: res, error: false })
                        console.log('redeem success: ', res)
                        return;
                    }).catch(err => {
                        this.setState({ RedeemStatus: err, error: true })
                        console.log('catch promise ', err)
                        return;
                    })
                }
            } catch (error) {
                console.log('err cacth', error)
                this.setState({ RedeemStatus: 'ER01', error: true })
            }
        }
    };


    navigateToOFO() {
        const { navigate } = this.props.navigation;
        navigate('QRscan', { onSelect: this.onSelect });
        this.setState({ loadding: false, activity: true })
    }

    componentWillMount() {
        this.mounted && setTimeout(() => {
            this.navigateToOFO();
        }, Platform.OS == 'android' ? 2000 : 1000);
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    render() {
        return (
            <Gradient
                colors={['#F0F3F5', '#E8E8E8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.container}>
                <StatusBar
                    backgroundColor={'transparent'}
                    translucent
                    barStyle="dark-content"
                />
                <Header
                    backgroundColor="transparent"
                    colorIconLeft="#328FFC"
                    colorTitle="#328FFC"
                    nameIconLeft="align-left"
                    title={Language.t('Redeem.Title')}
                    style={{ marginTop: 23 }}
                    pressIconLeft={() => { this.props.navigation.openDrawer(); }}
                />

                <View style={[styles.container, { flexDirection: 'row', padding: GLOBALS.hp('2%'), }]}>
                    <View style={styles.boxRedeem}>
                        <View style={styles.firstView} />
                        {
                            this.state.loadding &&
                            <Modal
                                animationType='fade'
                                transparent={true}
                                visible={true}>
                                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,.6)' }}>
                                    <ActivityIndicator size='large' color="#30C7D3" style={{ flex: 1 }} />
                                </View>
                            </Modal>
                        }
                        {
                            this.state.activity &&
                            <View style={styles.centerView}>
                                <ActivityIndicator size='large' color="#30C7D3" style={{ flex: 1 }} />
                            </View>
                        }
                        {this.state.error == false && this.state.RedeemStatus == "SS01" &&
                            <View style={styles.centerView}>
                                <Image source={require('../../images/like.png')} resizeMode="contain" style={{ width: GLOBALS.wp('30%'), height: GLOBALS.wp('30%'), margin: GLOBALS.wp('7%') }} />
                                <Text style={styles.Titlebox}>{Language.t('Redeem.Congratulation.Title')}!</Text>
                                <Text style={{ fontFamily: GLOBALS.font.Poppins, textAlign: 'center' }}>
                                    {Language.t('Redeem.Congratulation.Content')}
                                    <Text style={{ fontFamily: GLOBALS.font.Poppins, color: GLOBALS.Color.primary, fontSize: GLOBALS.wp('7%'), fontWeight: '400' }}> {this.state.amount}</Text> NTY</Text>
                            </View>
                        }
                        {this.state.error == false && this.state.RedeemStatus == "SS01" &&
                            <View style={styles.lastView}>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => this.props.navigation.navigate('TabNavigator')}>
                                    <Gradient
                                        colors={['#0C449A', '#082B5F']}
                                        start={{ x: 1, y: 0.7 }}
                                        end={{ x: 0, y: 3 }}
                                        style={{ paddingVertical: GLOBALS.hp('2%'), borderRadius: 5, }}
                                    >
                                        <Text style={styles.TextButton}>{Language.t('Redeem.Congratulation.TitleButton')}</Text>
                                    </Gradient>
                                </TouchableOpacity>
                            </View>
                        }

                        {this.state.error &&
                            <View style={styles.centerView}>
                                <Image source={require('../../images/error.png')} resizeMode="contain" style={{ width: GLOBALS.wp('30%'), height: GLOBALS.wp('30%'), margin: GLOBALS.wp('7%') }} />
                                <Text style={styles.Titlebox}>{Language.t('Redeem.Error.Title')}</Text>
                                {
                                    this.state.RedeemStatus == 'ER02' &&
                                    <Text style={{ fontFamily: GLOBALS.font.Poppins, fontSize: GLOBALS.wp('5%'), textAlign: 'center' }}>{Language.t('Redeem.Error.Content.Used')}</Text>
                                }
                                {
                                    this.state.RedeemStatus == 'ER01' &&
                                    <Text style={{ fontFamily: GLOBALS.font.Poppins, fontSize: GLOBALS.wp('5%'), textAlign: 'center' }}>{Language.t('Redeem.Error.Content.NotFound')}</Text>
                                }

                            </View>
                        }
                        {this.state.error &&
                            <View style={styles.lastView}>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={this.navigateToOFO.bind(this)}>
                                    <Gradient
                                        colors={['#0C449A', '#082B5F']}
                                        start={{ x: 1, y: 0.7 }}
                                        end={{ x: 0, y: 3 }}
                                        style={{ paddingVertical: GLOBALS.hp('2%'), borderRadius: 5, }}
                                    >
                                        <Text style={styles.TextButton}>{Language.t('Redeem.Error.TitleButton')}</Text>
                                    </Gradient>
                                </TouchableOpacity>
                            </View>
                        }
                    </View>
                </View>
            </Gradient >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    boxRedeem: {
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
        justifyContent: 'space-around',
    },
    Titlebox: {
        fontSize: GLOBALS.wp('8%'),
        fontWeight: 'bold',
        fontFamily: GLOBALS.font.Poppins
    },
    firstView: {
        flex: 1,
    },
    centerView: {
        flex: 7,
        alignItems: 'center',
        justifyContent: 'center'
    },
    lastView: {
        flex: 2,
        justifyContent: 'flex-end',
    },
    TextButton: {
        color: 'white',
        textAlign: 'center',
        fontSize: GLOBALS.wp('5%'),
        fontFamily: GLOBALS.font.Poppins,
        fontWeight: 'bold'
    },
    button: {
        shadowOffset: { width: 3, height: 3, },
        shadowColor: 'black',
        shadowOpacity: 0.2,
        marginVertical: GLOBALS.hp('3%'),
    },
})
