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

export default class Redeem extends Component {

    initState = {
        expired: false,
        show: false,
        getValue: false,
        notExist: false,
        statusQR: false,
        error: false,
        used: false,
        amount: '',
        QRcode: '',
        dataReturn: null,
        QRNotFound: false,
        loadding: true,
    }

    constructor(props) {
        super(props)
        this.state = this.initState;
    };


    setFalse() {

    }

    onSelect = data => {
        if (data['result'] == 'cancelScan') {
            this.setState({ error: true, QRNotFound: true, dataReturn: 'null' })
            return;
        }

        try {
            this.setState({ dataReturn: data['result'] });
        } catch (error) {
            console.log(error)
        }
        if (this.state.dataReturn != null) {
            try {
                fetch('https://coupon.nexty.io/api/Coupon/info?couponcode=' + this.state.dataReturn)
                    .then(QR => {
                        if (QR == null || QR == '') {
                            this.setState({ notExist: true, error: true })
                        } else {
                            this.setFalse()
                            switch (QR['statusCode']) {
                                case 0:
                                    this.setState({ getValue: true, amount: QR['amount'], QRcode: QR['couponCode'] })
                                    break;
                                case 1:
                                    this.setState({ error: true, used: true })
                                    break;
                                default:
                                    this.setState({ error: true, expired: true })
                                    break;
                            }
                        }
                    })
                    .catch(err => { console.log(err) })
            } catch (error) {

            }
        }
    };


    navigateToOFO() {
        console.log("click click")
        const { navigate } = this.props.navigation;
        navigate('QRscan', { onSelect: this.onSelect });
    }

    componentDidMount() {
        this.props.navigation.setParams({
            onBackPress: this._handleBackPress
        });

        if (Platform.OS == "android") {
            BackHandler.addEventListener('hardwareBackPress', () => {
                this.setState({ error: true, QRNotFound: true, dataReturn: 'null' })
            })
        }
        setTimeout(() => {
            this.navigateToOFO();
            this.setState({ loadding: false })
        }, 1000);
    }

    componentWillMount() {

    }

    _handleBackPress = () => {
    }

    componentWillUnmount() {
        if (Platform.OS == "android") {
            BackHandler.removeEventListener('hardwareBackPress')
        }
    }

    redeem() {
        try {
            let body = JSON.stringify({ couponCode: this.state.QRcode, nextyWallet: Address })
            fetch('https://coupon.nexty.io/api/Coupon/redeem', body, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                .subscribe(res => {
                    console.log('Status get: ' + res['statusCode']);
                    this.setFalse();
                    this.setState({ statusQR: true })
                }), (err: HttpErrorResponse) => {
                    console.log(err.error);
                    console.log(err.name);
                    console.log(err.message);
                    console.log(err.status);
                }
        } catch (error) {
        }
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
                            <Icon name="bars" color='#fff' size={25}></Icon>
                        </Button>
                    </Left>
                    <Body>
                        <Title style={{ color: '#fff', fontFamily: GLOBALS.font.Poppins }}>{Language.t('Redeem.Title')}</Title>
                    </Body>
                    <Right />
                </Header>

                <Content padder contentContainerStyle={styles.container}>
                    {
                        this.state.loadding &&
                        <View style={{ position: 'absolute', flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(155, 155, 155, 0.63)', height: GLOBALS.HEIGHT, width: GLOBALS.WIDTH }} >
                            <View style={{ backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderRadius: 10, padding: 7 }}>
                                <Spinner color={GLOBALS.Color.primary} />
                                <Text>{Language.t('Redeem.OpenCam')}</Text>
                            </View>
                        </View>
                    }


                    {this.state.dataReturn != null && this.state.getValue &&
                        < View style={styles.form}>
                            <Text style={styles.Titlebox}>{Language.t('Redeem.InfoQR.Title')}</Text>
                            <Text style={{ marginBottom: 10, marginTop: 10, fontFamily: GLOBALS.font.Poppins }}>{Language.t('Redeem.InfoQR.Content')}</Text><Text>{this.state.QRcode}</Text>
                            <Text style={{ marginBottom: 10, marginTop: 10, fontFamily: GLOBALS.font.Poppins }}>NTY:</Text><Text>{this.state.amount}</Text>
                            <TouchableOpacity onPress={this.redeem.bind(this)} style={styleButton(GLOBALS.Color.primary).button}>
                                <Text style={styles.TextButton}>{Language.t('Redeem.InfoQR.TitleButton')}</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    {this.state.dataReturn != null && this.state.statusQR &&
                        <View style={styles.form}>
                            <Text style={styles.Titlebox}>{Language.t('Redeem.Congratulation.Title')}</Text>
                            <Text style={{ marginBottom: 10, marginTop: 10, fontFamily: GLOBALS.font.Poppins }}>{Language.t('Redeem.Congratulation.Content')} {this.state.amount} NTY</Text>
                            <TouchableOpacity style={styleButton(GLOBALS.Color.primary).button} onPress={() => this.props.navigation.navigate('TabNavigator')}>
                                <Text style={styles.TextButton}>{Language.t('Redeem.Congratulation.TitleButton')}</Text>
                            </TouchableOpacity>
                        </View>

                    }
                    {this.state.dataReturn != null && this.state.error &&
                        <View style={styles.form}>
                            <Text style={styles.Titlebox}>{Language.t('Redeem.Error.Title')}</Text>
                            {this.state.used &&
                                <Text style={{ marginBottom: 10, marginTop: 10, fontFamily: GLOBALS.font.Poppins }}>{Language.t('Redeem.Error.Content.Used')}</Text>
                            }
                            {this.state.expired &&
                                <Text style={{ marginBottom: 10, marginTop: 10, fontFamily: GLOBALS.font.Poppins }}>{Language.t('Redeem.Error.Content.expired')}</Text>
                            }
                            {this.state.QRNotFound &&
                                <Text style={{ marginBottom: 10, marginTop: 10, fontFamily: GLOBALS.font.Poppins }}>{Language.t('Redeem.Error.Content.NotFound')}</Text>
                            }
                            <TouchableOpacity onPress={this.navigateToOFO.bind(this)} style={styleButton(GLOBALS.Color.secondary).button}>
                                <Text style={styles.TextButton}>{Language.t('Redeem.Error.TitleButton')}</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </Content>
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
