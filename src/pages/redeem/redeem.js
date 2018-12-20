import React, { Component } from 'react'
import { View, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, BackHandler, Platform } from 'react-native';
import GLOBALS from '../../helper/variables';
import { POSTAPI } from '../../helper/utils'
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
    Spinner
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import { Address } from '../../services/auth.service';
import Language from '../../i18n/i18n'
import IconFeather from "react-native-vector-icons/Feather"
import { HandleCoupon } from './redeem.service'


export default class Redeem extends Component {

    initState = {
        error: false,
        amount: '',
        loadding: true,
        RedeemStatus: ''
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
        if (data['result'] == 'cancelScan') {
            this.setState({ RedeemStatus: 'ER01', error: true })
            return;
        }
        if (data['result'] != null) {
            try {
                var dataCoupon = JSON.parse("{" + data['result'] + "}");
                if (dataCoupon['appName'] || dataCoupon['appName'] == 'nexty-wallet' || dataCoupon['privateKey'] != '' || dataCoupon['privateKey'].length != 64) {
                    HandleCoupon(dataCoupon['privateKey']).then(res => {
                        this.setState({ RedeemStatus: 'SS01', amount: res, error: false })
                    }).catch(err => {
                        this.setState({ RedeemStatus: err, error: true })
                        return;
                    })
                } else {
                    this.setState({ RedeemStatus: 'ER01', error: true })
                }
            } catch (error) {
                this.setState({ RedeemStatus: 'ER01', error: true })
            }
        }
    };


    navigateToOFO() {
        const { navigate } = this.props.navigation;
        navigate('QRscan', { onSelect: this.onSelect });
    }

    componentWillMount() {
        setTimeout(() => {
            this.navigateToOFO();
            this.setState({ loadding: false })
        }, Platform.OS == 'android' ? 2000 : 1000);
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
                            <IconFeather name="align-left" color='#fff' size={25} />
                        </Button>
                    </Left>
                    <Body style={Platform.OS == 'ios' ? { flex: 3 } : {}}>
                        <Title style={{ color: '#fff' }}>{Language.t('Redeem.Title')}</Title>
                    </Body>
                    <Right />
                </Header>

                <View style={styles.container}>
                    {
                        this.state.loadding &&
                        <View style={{ position: 'absolute', flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(155, 155, 155, 0.63)', height: GLOBALS.HEIGHT, width: GLOBALS.WIDTH }} >
                            <View style={{ backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderRadius: 10, padding: 7 }}>
                                <Spinner color={GLOBALS.Color.primary} />
                                <Text>{Language.t('Redeem.OpenCam')}</Text>
                            </View>
                        </View>
                    }

                    {this.state.error == false && this.state.RedeemStatus == "SS01" &&
                        <View style={styles.form}>
                            <Text style={styles.Titlebox}>{Language.t('Redeem.Congratulation.Title')}</Text>
                            <Text style={{ marginBottom: 10, marginTop: 10, fontFamily: GLOBALS.font.Poppins }}>{Language.t('Redeem.Congratulation.Content')} {this.state.amount} NTY</Text>
                            <TouchableOpacity style={styleButton(GLOBALS.Color.primary).button} onPress={() => this.props.navigation.navigate('TabNavigator')}>
                                <Text style={styles.TextButton}>{Language.t('Redeem.Congratulation.TitleButton')}</Text>
                            </TouchableOpacity>
                        </View>
                    }

                    {this.state.error &&
                        <View style={styles.form}>
                            <Text style={styles.Titlebox}>{Language.t('Redeem.Error.Title')}</Text>
                            {
                                this.state.RedeemStatus == 'ER02' &&
                                <Text style={{ marginBottom: 10, marginTop: 10, fontFamily: GLOBALS.font.Poppins }}>{Language.t('Redeem.Error.Content.Used')}</Text>
                            }
                            {
                                this.state.RedeemStatus == 'ER01' &&
                                <Text style={{ marginBottom: 10, marginTop: 10, fontFamily: GLOBALS.font.Poppins }}>{Language.t('Redeem.Error.Content.NotFound')}</Text>
                            }
                            <TouchableOpacity onPress={this.navigateToOFO.bind(this)} style={styleButton(GLOBALS.Color.secondary).button}>
                                <Text style={styles.TextButton}>{Language.t('Redeem.Error.TitleButton')}</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
            </Container >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    boxRedeem: {
        width: GLOBALS.WIDTH / 10,
    },
    Titlebox: {
        fontSize: GLOBALS.WIDTH / 17,
        fontWeight: 'bold',
        fontFamily: GLOBALS.font.Poppins
    },
    form: {
        alignItems: 'center',
        // marginTop: -100,
    },
    TextButton: {
        color: 'white',
        textAlign: 'center',
        fontSize: 15,
        fontFamily: GLOBALS.font.Poppins,

    },
})
var styleButton = (color) => StyleSheet.create({
    button: {
        backgroundColor: color,
        marginBottom: GLOBALS.HEIGHT / 40,
        height: GLOBALS.HEIGHT / 17,
        justifyContent: 'center',
        width: GLOBALS.WIDTH / 1.6,
        shadowOffset: { width: 3, height: 3, },
        shadowColor: 'black',
        shadowOpacity: 0.2,
    }
})
