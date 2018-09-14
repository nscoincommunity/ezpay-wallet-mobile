import React, { Component } from 'react'
import { View, Image, StyleSheet } from 'react-native';
import GLOBALS from '../../helper/variables';
// import Icon from "react-native-vector-icons/FontAwesome";
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
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";


export default class About extends Component {

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
                        <Title style={{ color: '#fff' }}>About</Title>
                    </Body>
                    <Right />
                </Header>

                <Content padder>
                    <View style={style.container}>
                        <Image style={style.logo} source={require('../../images/logo-with-text.png')} resizeMode="contain" />
                        <Text style={{ textAlign: 'center', marginTop: GLOBALS.HEIGHT / 40, fontFamily: GLOBALS.font.Poppins }}>Nexty is a Fintech ecosystem which helps e-commerce and technology startups to raise funds from community</Text>
                    </View>
                </Content>
            </Container>
        )
    }
}
const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    logo: {
        height: GLOBALS.HEIGHT / 3,
        width: GLOBALS.WIDTH / 1.6,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: GLOBALS.HEIGHT / 15
    },
})
