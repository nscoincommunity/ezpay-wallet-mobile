import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Keyboard,
    Platform,
    BackHandler,
    Alert,
    Linking,
    TouchableWithoutFeedback,
    ImageBackground,
    ToastAndroid
} from 'react-native';
import { createTabNavigator, TabBarBottom, NavigationActions } from 'react-navigation';
import Dashboard from './pages/dashboard/dashboard';
import Request from './pages/request/request';
import Send from './pages/send/send';
// import Send from './saveCode';
import GLOBALS from './helper/variables'
import Iccon from "react-native-vector-icons/FontAwesome";
import { Container, Header, Left, Body, Title, Right, Button, Icon, Input, Item } from 'native-base'
import { exchangeRate } from '../src/services/rate.service';
import Language from './i18n/i18n';
import IconFeather from "react-native-vector-icons/Feather"

const IconSend = require('./images/iconTabBar/send.png');
const IconHome = require('./images/iconTabBar/home.png');
const IconRequest = require('./images/iconTabBar/Qrcode.png');
const IconSendActive = require('./images/iconTabBar/activeSend.png');
const IconHomeActive = require('./images/iconTabBar/activeHome.png');
const IconRequestActive = require('./images/iconTabBar/activeQrcode.png');

class SendSceen extends React.Component {

    render() {
        return (
            <Container>
                <Header style={{ backgroundColor: '#fafafa', borderBottomWidth: 0 }}>
                    <Left>
                        <Button
                            transparent
                            onPress={() => { this.props.navigation.openDrawer(); Keyboard.dismiss() }}
                        >
                            <IconFeather name="align-left" style={{ color: GLOBALS.Color.primary, fontSize: 25 }} />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={{ color: GLOBALS.Color.primary, fontFamily: GLOBALS.font.Poppins, fontWeight: '400' }}>{Language.t("Send.Title")}</Title>
                    </Body>
                    <Right />
                </Header>
                <Send {...this.props} />
            </Container>
        );
    }
}

class DashboardScreen extends React.Component {

    render() {
        var exchange = exchangeRate.toFixed(6);
        return (
            <ImageBackground
                source={require('./images/background.png')}
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                resizeMode="cover"
            >
                <Container style={{ backgroundColor: 'transparent' }}>
                    <Header style={{ borderBottomWidth: 0, backgroundColor: 'transparent', borderBottomColor: 'transparent' }}>
                        <Left style={{ flex: 0 }}>
                            <Button
                                transparent
                                onPress={() => { this.props.navigation.openDrawer(); Keyboard.dismiss() }}
                            >
                                <IconFeather name="align-left" style={{ color: '#fff', fontSize: 25 }} />
                            </Button>
                        </Left>
                        <Body style={{ flex: 10, alignItems: 'center', backgroundColor: 'transparent' }}>
                            <Title style={{ color: '#fff', textAlign: 'center', fontFamily: GLOBALS.font.Poppins, fontWeight: '400' }}>1 NTY = {exchange} USD</Title>
                        </Body>
                        <Right />
                    </Header>
                    <Dashboard {...this.props} />
                </Container>
            </ImageBackground>
        );
    }
}

class RequestSceen extends React.Component {

    render() {
        return (
            <Container>
                <Header style={{ backgroundColor: '#fafafa', borderBottomWidth: 0 }}>
                    <Left>
                        <Button
                            transparent
                            onPress={() => {
                                this.props.navigation.openDrawer();
                                Keyboard.dismiss()
                            }}
                        >
                            <IconFeather name="align-left" style={{ color: GLOBALS.Color.primary, fontSize: 25, fontWeight: '100', }} />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={{ color: GLOBALS.Color.primary, fontFamily: GLOBALS.font.Poppins, fontWeight: '400' }}>{Language.t("Request.Title")}</Title>
                    </Body>
                    <Right />
                </Header>
                <Request {...this.props} />
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    icon: {
        width: 26,
        height: 26,
    },
});


// export default MyApp

export default class TabFooder extends React.Component {
    state = { routerLinking: false }
    constructor(props) {
        super(props)
        this.backButtonClick = this.backButtonClick.bind(this)
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.backButtonClick);
        Linking.removeEventListener('url')
    }

    componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.backButtonClick);
        Linking.addEventListener('url', (url) => {
            if (!url || url == "" || url == null) {
                return;
            } else {
                console.log('url')
                // if (!this.props.navigation.isFocused()) {
                //     this.props.navigation.navigate('TabNavigator', { url: url });
                //     setTimeout(() => {
                //         this.setState({ routerLinking: true })
                //     }, 100);
                // } else {
                //     this.setState({ routerLinking: true })
                // }
                this.props.navigation.navigate('TempPage', { url: url })
            }
        })
    }

    backButtonClick() {
        console.log('props: ', this.props.navigation)
        const { dispatch } = this.props.navigation;
        const parent = this.props.navigation.dangerouslyGetParent();
        const isDrawerOpen = parent && parent.state && parent.state.isDrawerOpen;
        console.log(isDrawerOpen)
        if (this.props.navigation.isFocused() == true) {
            this.props.navigation.closeDrawer();
            if (isDrawerOpen == true) {
                this.props.navigation.closeDrawer();
                return true;
            } else {
                Alert.alert(
                    Language.t('ConfirmLogout.Title'),
                    Language.t('ConfirmLogout.exitapp'),
                    [
                        { text: Language.t('ConfirmLogout.ButtonCancel'), style: 'cancel', onPress: () => { return true } },
                        { text: Language.t('ConfirmLogout.ButtonAgree'), onPress: () => { BackHandler.exitApp(); return false } }
                    ]
                )
                return true
            }
        }
        else {
            dispatch(NavigationActions.back());
            this.props.navigation.goBack()
            return true;
        }
    }

    componentWillMount() {
        Linking.getInitialURL().then(url => {
            if (!url || url == "" || url == null) {
                return;
            } else {
                // this.setState({ routerLinking: true })
                this.props.navigation.navigate('TempPage', { url: url })
            }
            console.log(url)
        }).catch(err => {
            console.log(err)
        })
    }
    render() {
        const MyApp = createTabNavigator(
            {
                Send: {
                    screen: props => <SendSceen {...this.props} />,
                },
                Dashboard: {
                    screen: props => <DashboardScreen {...this.props} />,
                },
                Request: {
                    screen: props => <RequestSceen {...this.props} />,
                }
            },
            {
                // tabBarComponent: TabBarBottom,
                tabBarComponent: props => <CustomTab {...props} />,
                initialRouteName: this.state.routerLinking == true ? 'Send' : 'Dashboard',
                tabBarPosition: 'bottom',
                animationEnabled: true,
                tabBarOptions: {
                    showIcon: true,
                    showLabel: false,
                    activeTintColor: '#F8F8F8',
                    inactiveTintColor: '#586589',
                    activeBackgroundColor: 'transparent',
                    upperCaseLabel: true,
                    indicatorStyle: {
                        backgroundColor: 'transparent'
                    },
                    labelStyle: {
                        fontSize: 12,
                        fontFamily: GLOBALS.font.Poppins
                    },
                    style: {
                        backgroundColor: 'transparent',
                        borderTopWidth: 0,
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 0,
                    },
                }

            });
        return (
            <MyApp />
        )
    }
};


class CustomTab extends React.Component {

    renderItem = (route, index) => {
        const {
            navigation,
            jumpToIndex,
            activeTintColor,
            inactiveTintColor
        } = this.props;
        const focused = index === navigation.state.index;
        const color = focused ? activeTintColor : inactiveTintColor;

        return (
            <TouchableWithoutFeedback
                key={route.key}
                onPress={() => jumpToIndex(index)}
            >
                <View style={{ paddingHorizontal: GLOBALS.wp('7%') }}>
                    {/* <View >
                    <Text style={{ color }}>{route.routeName}</Text>
                </View> */}
                    {
                        route.routeName == 'Send' &&
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            {
                                focused ?
                                    <Image source={IconSendActive} style={{ height: GLOBALS.wp('5%'), width: GLOBALS.wp('5%') }} resizeMode="contain" />
                                    :
                                    <Image source={IconSend} style={{ height: GLOBALS.wp('5%'), width: GLOBALS.wp('5%') }} resizeMode="contain" />
                            }
                        </View>
                    }
                    {
                        route.routeName == 'Dashboard' &&
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            {
                                focused ?
                                    <View style={{
                                        borderRadius: 1000,
                                        shadowColor: "#000",
                                        shadowOffset: {
                                            width: 0,
                                            height: 0,
                                        },
                                        shadowOpacity: 0.54,
                                        shadowRadius: 5.27,
                                        elevation: 2,
                                    }}>
                                        <Image source={IconHomeActive} style={{ height: GLOBALS.wp('12%'), width: GLOBALS.wp('12%') }} resizeMode="contain" />
                                    </View>
                                    :
                                    <View style={{ paddingVertical: GLOBALS.wp('3.5%'), paddingHorizontal: GLOBALS.wp('3.3%') }}>
                                        <Image source={IconHome} style={{ height: GLOBALS.wp('5%'), width: GLOBALS.wp('5%') }} resizeMode="contain" />
                                    </View>
                            }
                        </View>
                    }
                    {
                        route.routeName == 'Request' &&
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            {
                                focused ?
                                    <Image source={IconRequestActive} style={{ height: GLOBALS.wp('5%'), width: GLOBALS.wp('5%') }} resizeMode="contain" />
                                    :
                                    <Image source={IconRequest} style={{ height: GLOBALS.wp('5%'), width: GLOBALS.wp('5%') }} resizeMode="contain" />
                            }
                        </View>
                    }
                </View>
            </TouchableWithoutFeedback>
        );
    }

    render() {
        const {
            navigation,
        } = this.props;

        const {
            routes,
        } = navigation.state;
        return (
            <View style={[this.props.style, { flexDirection: 'row', padding: GLOBALS.wp('2%'), justifyContent: 'center', alignItems: 'center', backgroundColor: Platform.OS == 'android' ? navigation.state.index == 0 ? '#fafafa' : 'transparent' : 'transparent' }]
            }>
                {routes && routes.map(this.renderItem)}
            </View >
        );
    }
}