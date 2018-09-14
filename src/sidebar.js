import React, { Component } from 'react';
import { Image, StyleSheet, Platform } from "react-native";
import GLOBALS from './helper/variables';
import { logout } from './services/auth.service'

import {
    Content,
    Text,
    List,
    ListItem,
    Container,
    Left,
    Right,
    Badge,
    Footer,
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";

const datas = [

    {
        name: 'Redeem',
        route: 'Redeem',
        icon: 'gift',
    },
    {
        name: 'Private key',
        route: 'Privatekey',
        icon: 'key',
    },
    {
        name: 'Add token',
        route: 'Addtoken',
        icon: 'plus-circle',
    },
    {
        name: 'History',
        route: 'History',
        icon: 'history',
    },
    {
        name: 'Settings',
        route: 'Setting',
        icon: 'cog',
    },
    {
        name: 'About',
        route: 'About',
        icon: 'info-circle',
    },
    {
        name: 'Logout',
        route: 'Unlogin',
        icon: 'sign-out',
    },
]


export default class sidebar extends Component {


    constructor(props) {
        super(props);
        this.state = {
            shadowOffsetWidth: 1,
            shadowRadius: 4,
        };
    }

    navigationPage(route) {
        if (route == 'Unlogin') {
            logout().then(() => {
                this.props.navigation.navigate(route);
            })
        } else {
            this.props.navigation.navigate(route);
        }
    }

    render() {
        return (
            <Container >
                <Content
                    bounces={false}
                    style={{ flex: 1, backgroundColor: GLOBALS.Color.primary, paddingTop: 20 }}
                >
                    <List>
                        <ListItem
                            button
                            noBorder
                            onPress={() => this.props.navigation.navigate('TabNavigator')}
                        >
                            <Left>
                                <Image source={require('../src/images/logo-without-text.png')} resizeMode="contain" style={{ height: 30, width: 30, marginRight: 10 }} />
                                <Text style={{ color: '#fff', fontFamily: GLOBALS.font.Poppins }}>
                                    Nexty wallet
                                </Text>
                            </Left>
                            <Right>
                                <Icon name="angle-right"
                                    style={{ color: "#fff", fontSize: 26 }}
                                />
                            </Right>
                        </ListItem>
                    </List>

                    <List
                        dataArray={datas}
                        renderRow={data =>
                            <ListItem
                                button
                                noBorder
                                onPress={() => this.navigationPage(data.route)
                                    //     this.props.navigation.addListener(
                                    //     'willFocus',
                                    //     payload => {
                                    //         this.forceUpdate();
                                    //         this.props.navigation.navigate(data.route)
                                    //     }
                                    // )
                                }
                            >
                                <Left>
                                    <Icon
                                        active
                                        name={data.icon}
                                        style={{ color: "#fff", fontSize: 26, width: 30, marginRight: 10 }}
                                    />
                                    <Text style={{ color: '#fff', fontFamily: GLOBALS.font.Poppins }}>
                                        {data.name}
                                    </Text>
                                </Left>
                                {/* {data.types &&
                                    <Right style={{ flex: 1 }}>
                                        <Badge
                                            style={{
                                                borderRadius: 3,
                                                height: 25,
                                                width: 72,
                                                backgroundColor: data.bg
                                            }}
                                        >
                                        </Badge>
                                    </Right>} */}
                                <Right>
                                    <Icon name="angle-right"
                                        style={{ color: "#fff", fontSize: 26 }}
                                    />
                                </Right>
                            </ListItem>}
                    />
                </Content>
                <Text style={{ color: '#fff', backgroundColor: '#093a84' }}>Version 0.0.1</Text>
            </Container>
        )
    }
}
const styles = StyleSheet.create({
    text: {
        fontWeight: Platform.OS === "ios" ? "500" : "400",
        fontSize: 16,
        marginLeft: 20
    },
    badgeText: {
        fontSize: Platform.OS === "ios" ? 13 : 11,
        fontWeight: "400",
        textAlign: "center",
        marginTop: Platform.OS === "android" ? -3 : undefined
    }
})