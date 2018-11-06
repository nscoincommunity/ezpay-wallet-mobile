import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Keyboard, Platform, BackHandler, Alert, Linking } from 'react-native';
import { createTabNavigator, TabBarBottom, NavigationActions } from 'react-navigation';
import Dashboard from './pages/dashboard/dashboard';
import Request from './pages/request/request';
import Send from './pages/send/send';
import GLOBALS from './helper/variables'
import Iccon from "react-native-vector-icons/FontAwesome";
import { Container, Header, Left, Body, Title, Right, Button, Icon, Input, Item } from 'native-base'
import { exchangeRate } from '../src/services/rate.service';
import Language from './i18n/i18n';

class SendSceen extends React.Component {

    static navigationOptions = {
        // tabBarLabel: Language.t("Send.Title"),
        // Note: By default the icon is only shown on iOS. Search the showIcon option below.
        tabBarIcon: ({ tintColor }) => (
            <Iccon
                color={tintColor}
                type="FontAwesome"
                name="arrow-up"
                size={25}
            />
        ),
    };

    render() {
        return (
            <Container>
                <Header style={{ backgroundColor: GLOBALS.Color.primary }}>
                    <Left>
                        <Button
                            transparent
                            onPress={() => { this.props.navigation.openDrawer(); Keyboard.dismiss() }}
                        >
                            <Icon type="FontAwesome" name="bars" style={{ color: '#fff', fontSize: 25 }} />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={{ color: '#fff', fontFamily: GLOBALS.font.Poppins }}>{Language.t("Send.Title")}</Title>
                    </Body>
                    <Right />
                </Header>
                <Send {...this.props} />
            </Container>
        );
    }
}

class DashboardScreen extends React.Component {

    static navigationOptions = {
        tabBarLabel: Language.t("Dashboard.Title"),
        tabBarIcon: ({ tintColor }) => (
            <Iccon
                type="FontAwesome"
                name="home"
                color={tintColor}
                size={25}
            />
        ),
    };

    render() {
        return (
            <Container>
                <Header style={{ backgroundColor: GLOBALS.Color.primary }}>
                    <Left style={{ flex: 0 }}>
                        <Button
                            transparent
                            onPress={() => { this.props.navigation.openDrawer(); Keyboard.dismiss() }}
                        >
                            <Icon type="FontAwesome" name="bars" style={{ color: '#fff', fontSize: 25 }} />
                        </Button>
                    </Left>
                    <Body style={{ flex: 10, alignItems: 'center' }}>
                        <Title style={{ color: '#fff', textAlign: 'center', fontFamily: GLOBALS.font.Poppins }}>1 NTY = {exchangeRate.toFixed(6)} USD</Title>
                    </Body>
                    <Right />
                </Header>
                <Dashboard {...this.props} />
            </Container>
        );
    }
}

class RequestSceen extends React.Component {

    static navigationOptions = {
        tabBarLabel: Language.t("Request.Title"),
        tabBarIcon: ({ tintColor }) => (
            <Iccon
                type="FontAwesome"
                name="arrow-down"
                color={tintColor}
                size={25}
            />
        ),
    };

    render() {
        return (
            <Container>
                <Header style={{ backgroundColor: GLOBALS.Color.primary }}>
                    <Left>
                        <Button
                            transparent
                            onPress={() => { this.props.navigation.openDrawer(); Keyboard.dismiss() }}
                        >
                            <Icon type="FontAwesome" name="bars" style={{ color: '#fff', fontSize: 25 }} />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={{ color: '#fff', fontFamily: GLOBALS.font.Poppins }}>{Language.t("Request.Title")}</Title>
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
                    navigationOptions: {
                        tabBarLabel: Language.t("Send.Title"),
                        tabBarIcon: ({ tintColor }) => (
                            <Iccon
                                color={tintColor}
                                type="FontAwesome"
                                name="arrow-up"
                                size={25}
                            />
                        )
                    }
                },
                Dashboard: {
                    screen: props => <DashboardScreen {...this.props} />,
                    navigationOptions: {
                        tabBarLabel: Language.t("Dashboard.Title"),
                        tabBarIcon: ({ tintColor }) => (
                            <Iccon
                                type="FontAwesome"
                                name="home"
                                color={tintColor}
                                size={25}
                            />
                        )
                    }
                },
                Request: {
                    screen: props => <RequestSceen {...this.props} />,
                    navigationOptions: {
                        tabBarLabel: Language.t("Request.Title"),
                        tabBarIcon: ({ tintColor }) => (
                            <Iccon
                                type="FontAwesome"
                                name="arrow-down"
                                color={tintColor}
                                size={25}
                            />
                        )
                    }
                }
            },
            {
                tabBarComponent: TabBarBottom,
                initialRouteName: this.state.routerLinking == true ? 'Send' : 'Dashboard',
                tabBarPosition: 'bottom',
                animationEnabled: true,

                tabBarOptions: {
                    showIcon: true,
                    showLabel: true,
                    activeTintColor: '#F8F8F8',
                    inactiveTintColor: '#586589',
                    upperCaseLabel: true,
                    labelStyle: {
                        fontSize: 12,
                        fontFamily: GLOBALS.font.Poppins
                    },
                    style: {
                        backgroundColor: GLOBALS.Color.primary,
                    },
                    tabStyle: {},
                }
            });
        return (
            <MyApp />
        )
    }
};