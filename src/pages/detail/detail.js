import React, { Component } from 'react'
import { View, TouchableOpacity, Linking } from 'react-native';
import GLOBALS from '../../helper/variables';
import CONSTANTS from '../../helper/constants'
// import Icon from "react-native-vector-icons/FontAwesome";
import {
    Container,
    Content,
    Text,
    Left,
    Right,
    ListItem,
    Button,
    Body,
    List
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import Language from '../../i18n/i18n';

export default class DetailHis extends Component {
    static navigationOptions = () => ({
        title: Language.t('DetailHistory.Title'),
        headerStyle: {
            backgroundColor: GLOBALS.Color.primary,
        },
        headerTitleStyle: {
            color: 'white',
            width: GLOBALS.WIDTH
        },
        headerBackTitleStyle: {
            color: 'white',
        },
        headerTintColor: 'white',
    });

    render() {
        var data = this.props.navigation.getParam('data');
        console.log("data: ", JSON.stringify(data));

        return (
            <Container style={{ backgroundColor: "#fff" }}>
                <View >

                    <ListItem icon style={{ marginTop: 5, marginBottom: 5 }} >
                        <Body>
                            <Text style={styleText}>{Language.t('DetailHistory.Txhash')}</Text>
                            <Text style={styleText} note numberOfLines={1}>{data.tx}</Text>
                        </Body>
                    </ListItem>

                    {
                        data.type == 'arrow-up' &&
                        <ListItem icon style={{ marginTop: 5, marginBottom: 5 }}>
                            <Body>
                                <Text style={styleText}>{Language.t('DetailHistory.To')}</Text>
                                <Text style={styleText} note numberOfLines={1}>{data.data.to}</Text>
                            </Body>
                        </ListItem>
                    }

                    {
                        data.type == 'arrow-down' &&
                        <ListItem icon style={{ marginTop: 5, marginBottom: 5 }}>
                            <Body>
                                <Text style={styleText}>{Language.t('DetailHistory.From')}</Text>
                                <Text style={styleText} note numberOfLines={1}>{data.data.from}</Text>
                            </Body>
                        </ListItem>
                    }

                    <ListItem icon style={{ marginTop: 5, marginBottom: 5 }}>
                        <Body>
                            <Text style={styleText}>{Language.t('DetailHistory.Amount')}</Text>
                            <Text style={styleText} note numberOfLines={1}>{data.quantity}</Text>
                        </Body>
                    </ListItem>

                    <ListItem icon style={{ marginTop: 5, marginBottom: 5 }}>
                        <Body>
                            <Text style={styleText}>{Language.t('DetailHistory.Date')}</Text>
                            <Text note numberOfLines={1} style={styleText}>{data.datetime}</Text>
                        </Body>
                    </ListItem>

                    <ListItem icon style={{ marginTop: 5, marginBottom: 5 }}>
                        <Body>
                            <Text style={styleText}>{Language.t('DetailHistory.Status')}</Text>
                            <Text style={{ color: "green", fontFamily: GLOBALS.font.Poppins }} note numberOfLines={1} >COMPLETE</Text>
                        </Body>
                    </ListItem>

                    <View style={{ alignItems: 'center', marginTop: GLOBALS.HEIGHT / 15 }}>
                        <TouchableOpacity
                            onPress={() => Linking.openURL(CONSTANTS.EXPLORER_API + '/#/tx/' + data.tx)}
                            style={{
                                backgroundColor: GLOBALS.Color.primary,
                                marginBottom: GLOBALS.HEIGHT / 40,
                                height: GLOBALS.HEIGHT / 17,
                                justifyContent: 'center',
                                width: GLOBALS.WIDTH / 1.6
                            }}>
                            <Text style={{ color: '#fff', textAlign: 'center', fontFamily: GLOBALS.font.Poppins }}>{Language.t('DetailHistory.TitleButton')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Container>
        )
    }
}
const styleText = {
    fontFamily: GLOBALS.font.Poppins
}