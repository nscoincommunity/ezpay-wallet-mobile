import React, { Component } from 'react'
import { View } from 'react-native';
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


export default class Addtoken extends Component {

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
                        <Title style={{ color: '#fff' }}>Addtoken</Title>
                    </Body>
                    <Right />
                </Header>

                <Content padder>
                    <Text>Priva</Text>
                </Content>
            </Container>
        )
    }
}
