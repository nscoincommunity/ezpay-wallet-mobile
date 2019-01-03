import React, { Component } from 'react'
import { View, Image, StyleSheet, Platform } from 'react-native';
import GLOBALS from '../../helper/variables';
import Language from '../../i18n/i18n'
// import Icon from "react-native-vector-icons/FontAwesome";
import IconFeather from "react-native-vector-icons/Feather"

import {
    Container,
    Header,
    Title,
    Content,
    Text,
    Button,
    Left,
    Right,
    Body,
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";


export default class About extends Component {

    render() {
        return (
            <Container style={{ backgroundColor: "#fafafa" }}>
                <Header style={{ backgroundColor: '#fafafa', borderBottomWidth: 0 }}>
                    <Left>
                        <Button
                            transparent
                            onPress={() => this.props.navigation.openDrawer()}
                        >
                            <IconFeather name="align-left" color={GLOBALS.Color.primary} size={25} />
                        </Button>
                    </Left>
                    <Body style={Platform.OS == 'ios' ? { flex: 3 } : {}}>
                        <Title style={{ color: GLOBALS.Color.primary }}>{Language.t('About.Title')}</Title>
                    </Body>
                    <Right />
                </Header>

                <View style={style.container}>
                    <View style={style.MainForm}>
                        <Image style={style.logo} source={require('../../images/logo-with-text.png')} resizeMode="contain" />
                        <Text style={{ textAlign: 'center', marginTop: GLOBALS.HEIGHT / 40, fontFamily: GLOBALS.font.Poppins }}>{Language.t("About.Content")}</Text>
                    </View>
                </View>
            </Container>
        )
    }
}
const style = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center',
        padding: GLOBALS.hp('2%'),
    },
    MainForm: {
        flex: 1,
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: {
            width: -1,
            height: 3,
        },
        shadowOpacity: 0.24,
        shadowRadius: 2.27,
        elevation: 2,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        padding: GLOBALS.wp('2%')
    },
    logo: {
        height: GLOBALS.HEIGHT / 3,
        width: GLOBALS.WIDTH / 1.6,
        // justifyContent: 'center',
        // alignItems: 'center',
        // marginTop: GLOBALS.HEIGHT / 15
    },
})
