import React, { Component } from 'react'
import { View, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import GLOBALS from '../../../helper/variables';


export default class HeaderBrowser extends Component {

    render() {
        const {
            navigation,
            onchangeUrl,
            opentURL,
            valueInput
        } = this.props

        return (
            <View style={{
                width: GLOBALS.WIDTH,
                justifyContent: 'center',
                flexDirection: 'row',
                paddingTop: getStatusBarHeight(),
                paddingBottom: 10,
            }}>
                <TouchableOpacity
                    style={{ flex: 1.5, justifyContent: 'center' }}
                    onPress={() => navigation.goBack()}
                >
                    <Icon
                        name="times"
                        style={{ textAlign: 'center', color: GLOBALS.Color.primary, fontWeight: 'bold' }}
                        size={25}
                    />
                </TouchableOpacity>
                <TextInput
                    style={{
                        flex: 7.5,
                        backgroundColor: '#fff',
                        borderRadius: 4,
                        paddingHorizontal: 10,
                        paddingVertical: 5
                    }}
                    onChangeText={onchangeUrl}
                    value={valueInput}
                    underlineColorAndroid="transparent"
                    returnKeyType={"go"}
                    onSubmitEditing={opentURL}
                />
                <TouchableOpacity
                    style={{ flex: 1, justifyContent: 'center' }}
                    onPress={() => { this.setState({ url: 'http://45.76.156.99/' }) }}
                >
                    <Icon
                        name="ellipsis-v"
                        style={{ textAlign: 'center', color: GLOBALS.Color.primary, fontWeight: 'bold' }}
                        size={25}
                    />
                </TouchableOpacity>
            </View>
        )
    }
}