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
    ImageBackground
} from 'react-native';
import { createTabNavigator, TabBarBottom, NavigationActions } from 'react-navigation';
import Dashboard from './pages/dashboard/dashboard';
import Request from './pages/request/request';
import Send from './pages/send/send';
import GLOBALS from './helper/variables'
import Iccon from "react-native-vector-icons/FontAwesome";
import { Container, Header, Left, Body, Title, Right, Button, Icon, Input, Item } from 'native-base'
import { exchangeRate } from '../src/services/rate.service';
import Language from './i18n/i18n';
const IconSend = require('./images/iconTabBar/send.png');
const IconHome = require('./images/iconTabBar/home.png');
const IconRequest = require('./images/iconTabBar/Qrcode.png');
const IconSendActive = require('./images/iconTabBar/activeSend.png');
const IconHomeActive = require('./images/iconTabBar/activeHome.png');
const IconRequestActive = require('./images/iconTabBar/activeQrcode.png');
class SendSceen extends React.Component {

    static navigationOptions = {
        // tabBarLabel: Language.t("Send.Title"),
        // Note: By default the icon is only shown on iOS. Search the showIcon option below.
        // tabBarIcon: ({ tintColor }) => (
        //     <Iccon
        //         color={tintColor}
        //         type="FontAwesome"
        //         name="arrow-up"
        //         size={25}
        //     />
        // ),
    };

    render() {
        return (
            <Container>
                <Header style={{ backgroundColor: '#fafafa', borderBottomWidth: 0 }}>
                    <Left>
                        <Button
                            transparent
                            onPress={() => { this.props.navigation.openDrawer(); Keyboard.dismiss() }}
                        >
                            <Icon type="FontAwesome" name="align-left" style={{ color: GLOBALS.Color.primary, fontSize: 25 }} />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={{ color: GLOBALS.Color.primary, fontFamily: GLOBALS.font.Poppins }}>{Language.t("Send.Title")}</Title>
                    </Body>
                    <Right />
                </Header>
                <Send {...this.props} />
            </Container>
        );
    }
}

class DashboardScreen extends React.Component {

    // static navigationOptions = {
    //     tabBarLabel: Language.t("Dashboard.Title"),
    //     tabBarIcon: ({ tintColor }) => (
    //         <Iccon
    //             type="FontAwesome"
    //             name="home"
    //             color={tintColor}
    //             size={25}
    //         />
    //     ),
    // };

    render() {
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
                <Container style={{ backgroundColor: 'transpatent' }}>
                    <Header style={{ borderBottomWidth: 0, backgroundColor: 'transparent' }}>
                        <Left style={{ flex: 0 }}>
                            <Button
                                transparent
                                onPress={() => { this.props.navigation.openDrawer(); Keyboard.dismiss() }}
                            >
                                <Icon type="FontAwesome" name="align-left" style={{ color: '#fff', fontSize: 25 }} />
                            </Button>
                        </Left>
                        <Body style={{ flex: 10, alignItems: 'center', backgroundColor: 'tranparent' }}>
                            <Title style={{ color: '#fff', textAlign: 'center', fontFamily: GLOBALS.font.Poppins }}>1 NTY = {exchangeRate.toFixed(6)} USD</Title>
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

    // static navigationOptions = {
    //     tabBarLabel: Language.t("Request.Title"),
    //     tabBarIcon: ({ tintColor }) => (
    //         <Iccon
    //             type="FontAwesome"
    //             name="arrow-down"
    //             color={tintColor}
    //             size={25}
    //         />
    //     ),
    // };

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
                            <Icon type="FontAwesome" name="align-left" style={{ color: GLOBALS.Color.primary, fontSize: 25 }} />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={{ color: GLOBALS.Color.primary, fontFamily: GLOBALS.font.Poppins }}>{Language.t("Request.Title")}</Title>
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
    }

    componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.backButtonClick);
    }

    backButtonClick() {
        console.log('props: ', this.props.navigation)
        const { dispatch } = this.props.navigation;
        if (this.props.navigation.isFocused() == true) {
            BackHandler.exitApp()
            return false;
        } else {
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
                this.setState({ routerLinking: true })
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
                    // navigationOptions: {
                    //     tabBarLabel: Language.t("Send.Title"),
                    //     tabBarIcon: (icon) => {
                    //         console.log(icon)
                    //         if (icon.focused) {
                    //             return (
                    //                 <Image style={{ height: GLOBALS.wp('10%'), width: GLOBALS.wp('10%') }} source={require('./images/icon/activesend.png')} />
                    //             )
                    //         } else {
                    //             return (
                    //                 <Image style={{ height: GLOBALS.wp('10%'), width: GLOBALS.wp('10%') }} source={require('./images/icon/send.png')} />
                    //             )
                    //         }
                    //     }
                    // }
                },
                Dashboard: {
                    screen: props => <DashboardScreen {...this.props} />,
                    // navigationOptions: {
                    //     tabBarLabel: Language.t("Dashboard.Title"),
                    //     tabBarIcon: (icon) => {
                    //         console.log(icon)
                    //         if (icon.focused) {
                    //             return (
                    //                 <Image style={{ height: GLOBALS.wp('10%'), width: GLOBALS.wp('10%') }} source={require('./images/icon/activehome.png')} />
                    //             )
                    //         } else {
                    //             return (
                    //                 <Image style={{ height: GLOBALS.wp('10%'), width: GLOBALS.wp('10%') }} source={require('./images/icon/home.png')} />
                    //             )
                    //         }
                    //     }
                    // }
                },
                Request: {
                    screen: props => <RequestSceen {...this.props} />,
                    // navigationOptions: {
                    //     tabBarLabel: Language.t("Request.Title"),
                    //     tabBarIcon: (icon) => {
                    //         console.log(icon)
                    //         if (icon.focused) {
                    //             return (
                    //                 <Image style={{ height: GLOBALS.wp('10%'), width: GLOBALS.wp('10%') }} source={require('./images/icon/activeQrcode.png')} />
                    //             )
                    //         } else {
                    //             return (
                    //                 <Image style={{ height: GLOBALS.wp('10%'), width: GLOBALS.wp('10%') }} source={require('./images/icon/Qrcode.png')} />
                    //             )
                    //         }
                    //     },

                    // }
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
                        borderRadius: 1000
                    },
                    tabStyle: {
                        borderRadius: 100
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
                                    <Image source={IconSendActive} style={{ height: GLOBALS.wp('8%'), width: GLOBALS.wp('8%') }} resizeMode="center" />
                                    :
                                    <Image source={IconSend} style={{ height: GLOBALS.wp('8%'), width: GLOBALS.wp('8%') }} resizeMode="center" />
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
                                    <View style={{ paddingVertical: GLOBALS.wp('2%'), paddingHorizontal: GLOBALS.wp('2%') }}>
                                        <Image source={IconHome} style={{ height: GLOBALS.wp('8%'), width: GLOBALS.wp('8%') }} resizeMode="center" />
                                    </View>
                            }
                        </View>
                    }
                    {
                        route.routeName == 'Request' &&
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            {
                                focused ?
                                    <Image source={IconRequestActive} style={{ height: GLOBALS.wp('8%'), width: GLOBALS.wp('8%') }} resizeMode="center" />
                                    :
                                    <Image source={IconRequest} style={{ height: GLOBALS.wp('8%'), width: GLOBALS.wp('8%') }} resizeMode="center" />
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

        console.log(this.props)
        return (
            <View style={[this.props.style, { flexDirection: 'row', padding: GLOBALS.wp('2%'), justifyContent: 'center', alignItems: 'center' }]
            }>
                {routes && routes.map(this.renderItem)}
            </View >
        );
    }
}