import React, { Component } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import GLOBALS from '../../../helper/variables';
import Icon from 'react-native-vector-icons/FontAwesome5';


export default class footerBrowser extends Component {
    render() {
        const {
            goBack,
            goForward,
            reFresh
        } = this.props
        return (
            <View
                style={{
                    width: GLOBALS.WIDTH,
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 10,
                }}
            >
                <TouchableOpacity
                    onPress={goBack}
                    style={{ flex: 1 }}
                >
                    <Icon name="chevron-left"
                        style={{ textAlign: 'center', color: GLOBALS.Color.primary, fontWeight: 'bold' }}
                        size={25} />
                </TouchableOpacity>
                <View style={{ flex: 8, justifyContent: 'center' }} >
                    <TouchableOpacity
                        onPress={reFresh}
                        style={{ flex: 1, justifyContent: 'center' }}
                    >
                        <Icon name="redo"
                            style={{ textAlign: 'center', color: GLOBALS.Color.primary, fontWeight: 'bold' }}
                            size={25} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    onPress={goForward}
                    style={{ flex: 1 }}
                >
                    <Icon name="chevron-right"
                        style={{ textAlign: 'center', color: GLOBALS.Color.primary, fontWeight: 'bold' }}
                        size={25} />
                </TouchableOpacity>

            </View>

        )
    }
}