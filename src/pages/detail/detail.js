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

export default class DetailHis extends Component {

    render() {
        var data = this.props.navigation.getParam('data');
        console.log("data: ", JSON.stringify(data));

        return (
            <Container style={{ backgroundColor: "#fff" }}>
                <Content padder>

                    <ListItem icon>
                        <Body>
                            <Text style={styleText}>Txhash</Text>
                            <Text style={styleText} note numberOfLines={1}>{data.tx}</Text>
                        </Body>
                    </ListItem>

                    {
                        data.type == 'arrow-up' &&
                        <ListItem icon>
                            <Body>
                                <Text style={styleText}>To</Text>
                                <Text style={styleText} note numberOfLines={1}>{data.data.to}</Text>
                            </Body>
                        </ListItem>
                    }

                    {
                        data.type == 'arrow-down' &&
                        <ListItem icon>
                            <Body>
                                <Text style={styleText}>From</Text>
                                <Text style={styleText} note numberOfLines={1}>{data.data.from}</Text>
                            </Body>
                        </ListItem>
                    }

                    <ListItem icon>
                        <Body>
                            <Text style={styleText}>Amount</Text>
                            <Text style={styleText} note numberOfLines={1}>{data.quantity}</Text>
                        </Body>
                    </ListItem>

                    <ListItem icon>
                        <Body>
                            <Text style={styleText}>Date</Text>
                            <Text note numberOfLines={1} style={styleText}>{data.datetime}</Text>
                        </Body>
                    </ListItem>

                    <ListItem icon >
                        <Body>
                            <Text style={styleText}>Status</Text>
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
                            <Text style={{ color: '#fff', textAlign: 'center', fontFamily: GLOBALS.font.Poppins }}>EXPLORER</Text>
                        </TouchableOpacity>
                    </View>
                </Content>
            </Container>
        )
    }
}
const styleText = {
    fontFamily: GLOBALS.font.Poppins
}