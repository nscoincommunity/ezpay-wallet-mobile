import React from 'react';
import { Button, Text, View, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import dashboard from './pages/dashboard/dashboard';
import request from './pages/request/request';
import send from './pages/send/send';
import GLOBALS from './helper/variables'
import Icon from "react-native-vector-icons/FontAwesome";
import { exchangeRate } from '../src/services/rate.service';


const DashboardScreen = createStackNavigator(
    {
        dashboard: dashboard
    },
    {
        navigationOptions: ({ navigation }) => ({
            headerLeft: (
                <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => navigation.openDrawer()}>
                    <Icon name="bars" color='#fff' size={25}></Icon>
                </TouchableOpacity>
            ),
            title: '1 NTY = ' + exchangeRate.toFixed(6) + ' USD'

        })
    }
);

const RequestSceen = createStackNavigator(
    {
        request: request,
    },
    {
        navigationOptions: ({ navigation }) => ({
            headerLeft: (
                <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => navigation.openDrawer()}>
                    <Icon name="bars" color='#fff' size={25}></Icon>
                </TouchableOpacity>
            ),
        })
    }
);
const SendSceen = createStackNavigator(
    {
        send: send,
    },
    {
        navigationOptions: ({ navigation }) => ({
            headerLeft: (
                <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => navigation.openDrawer()}>
                    <Icon name="bars" color='#fff' size={25}></Icon>
                </TouchableOpacity>
            ),
        })
    }
);

export default createBottomTabNavigator(
    {
        SEND: {
            screen: SendSceen,
            navigationOptions: () => ({
                tabBarIcon: ({ tintColor }) => (
                    <Icon
                        color={tintColor}
                        type="FontAwesome"
                        name="arrow-up"
                        size={25}
                    />
                )
            })
        },
        DASHBOARD: {
            screen: DashboardScreen,
            navigationOptions: () => ({
                tabBarIcon: ({ tintColor }) => (
                    <Icon
                        color={tintColor}
                        type="FontAwesome"
                        name="home"
                        size={25}
                    />
                )
            })
        },
        REQUEST: {
            screen: RequestSceen,
            navigationOptions: () => ({
                showLabel: false, // hide labels
                activeTintColor: '#F8F8F8', // active icon color
                inactiveTintColor: '#586589',  // inactive icon color
                tabBarIcon: ({ tintColor }) => (
                    <Icon
                        type="FontAwesome"
                        name="arrow-down"
                        color={tintColor}
                        size={25}
                    />
                )
            })
        },
    },
    {
        initialRouteName: 'DASHBOARD',
        /* Other configuration remains unchanged */
        tabBarOptions: {
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
    }
);