// import React from 'react';
// import { Button, Text, View, TouchableOpacity, Keyboard } from 'react-native';
// import { createBottomTabNavigator, createStackNavigator, createTabNavigator } from 'react-navigation';
// import dashboard from './pages/dashboard/dashboard';
// import request from './pages/request/request';
// import send from './pages/send/send';
// import GLOBALS from './helper/variables'
// import Icon from "react-native-vector-icons/FontAwesome";
// import { exchangeRate } from '../src/services/rate.service';

// Keyboard.dismiss()
// const DashboardScreen = createStackNavigator(
//     {
//         dashboard: dashboard
//     },
//     {
//         navigationOptions: ({ navigation }) => ({
//             headerLeft: (
//                 <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => navigation.openDrawer()}>
//                     <Icon name="bars" color='#fff' size={25}></Icon>
//                 </TouchableOpacity>
//             ),
//             title: '1 NTY = ' + exchangeRate.toFixed(6) + ' USD'

//         })
//     }
// );

// const RequestSceen = createStackNavigator(
//     {
//         request: request,
//     },
//     {
//         navigationOptions: ({ navigation }) => ({
//             headerLeft: (
//                 <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => navigation.openDrawer()}>
//                     <Icon name="bars" color='#fff' size={25}></Icon>
//                 </TouchableOpacity>
//             ),
//         })
//     }
// );
// const SendSceen = createStackNavigator(
//     {
//         send: send,
//     },
//     {
//         navigationOptions: ({ navigation }) => ({
//             headerLeft: (
//                 <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => { navigation.openDrawer(); Keyboard.dismiss() }}>
//                     <Icon name="bars" color='#fff' size={25}></Icon>
//                 </TouchableOpacity>
//             ),
//         })
//     }
// );

// export default createBottomTabNavigator(
//     {
//         SEND: {
//             screen: SendSceen,
//             navigationOptions: () => ({
//                 tabBarIcon: ({ tintColor }) => (
//                     <Icon
//                         color={tintColor}
//                         type="FontAwesome"
//                         name="arrow-up"
//                         size={25}
//                     />
//                 )
//             })
//         },
//         DASHBOARD: {
//             screen: DashboardScreen,
//             navigationOptions: () => ({
//                 tabBarIcon: ({ tintColor }) => (
//                     <Icon
//                         color={tintColor}
//                         type="FontAwesome"
//                         name="home"
//                         size={25}
//                     />
//                 )
//             })
//         },
//         REQUEST: {
//             screen: RequestSceen,
//             navigationOptions: () => ({
//                 showLabel: false, // hide labels
//                 activeTintColor: '#F8F8F8', // active icon color
//                 inactiveTintColor: '#586589',  // inactive icon color
//                 tabBarIcon: ({ tintColor }) => (
//                     <Icon
//                         type="FontAwesome"
//                         name="arrow-down"
//                         color={tintColor}
//                         size={25}
//                     />
//                 )
//             })
//         },
//     },
//     {
//         initialRouteName: 'DASHBOARD',
//         tabBarPosition: 'bottom',
//         /* Other configuration remains unchanged */
//         tabBarOptions: {
//             showLabel: true,
//             activeTintColor: '#F8F8F8',
//             inactiveTintColor: '#586589',
//             upperCaseLabel: true,

//             labelStyle: {
//                 fontSize: 15,
//                 fontFamily: GLOBALS.font.Poppins
//             },
//             style: {
//                 backgroundColor: GLOBALS.Color.primary,
//             },
//             tabStyle: {},
//         },

//     }
// );

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Keyboard } from 'react-native';
import { StackNavigator, TabNavigator, TabBarBottom } from 'react-navigation';
import Dashboard from './pages/dashboard/dashboard';
import Request from './pages/request/request';
import Send from './pages/send/send';
import GLOBALS from './helper/variables'
import Iccon from "react-native-vector-icons/FontAwesome";
import { Container, Header, Left, Body, Title, Right, Button, Icon, Input, Item } from 'native-base'
import { exchangeRate } from '../src/services/rate.service';

class SendSceen extends React.Component {

    static navigationOptions = {
        tabBarLabel: 'Send',
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
                        <Title style={{ color: '#fff', fontFamily: GLOBALS.font.Poppins }}>Send</Title>
                    </Body>
                    <Right />
                </Header>
                <Send />
            </Container>
        );
    }
}

class DashboardScreen extends React.Component {
    static navigationOptions = {
        tabBarLabel: 'Dashboard',
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
                <Dashboard navigator={this.props.navigation} />
            </Container>
        );
    }
}

class RequestSceen extends React.Component {
    static navigationOptions = {
        tabBarLabel: 'Request',
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
                        <Title style={{ color: '#fff', fontFamily: GLOBALS.font.Poppins }}>Request</Title>
                    </Body>
                    <Right />
                </Header>
                <Request />
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

const MyApp = TabNavigator(
    {
        Send: {
            screen: SendSceen,
        },
        Dashboard: {
            screen: DashboardScreen,
        },
        Request: {
            screen: RequestSceen,
        }
    },
    {
        tabBarComponent: TabBarBottom,
        initialRouteName: 'Dashboard',
        tabBarPosition: 'bottom',
        animationEnabled: true,
        tabBarOptions: {
            showIcon: true,
            showLabel: true,
            activeTintColor: '#F8F8F8',
            inactiveTintColor: '#586589',
            upperCaseLabel: true,
            labelStyle: {
                fontSize: 15,
                fontFamily: GLOBALS.font.Poppins
            },
            style: {
                backgroundColor: GLOBALS.Color.primary,
            },
            tabStyle: {},
        }
    });

export default MyApp;