import React, { Component } from 'react'
import { Text, View, StyleSheet, Platform, TouchableOpacity, ImageBackground } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import { Header } from 'react-native-elements';
import GLOBAL from '../../helper/variables'

export default class HeaderComponent extends Component {

    render() {
        const { size,
            backgroundColor,
            colorIconLeft,
            colorTitle,
            nameIconLeft,
            nameIconRight,
            title,
            style,
            pressIconLeft,
            pressIconRight,
            colorIconRight
        } = this.props;
        console.log()
        if (Platform.OS == 'ios') {
            return (

                <View style={[styles.menubar, style, { backgroundColor: backgroundColor }]}>
                    <TouchableOpacity
                        onPress={pressIconLeft}
                        style={{ flex: 1 }}
                    >
                        <Icon name={nameIconLeft} size={25} color={colorIconLeft} />
                    </TouchableOpacity>
                    <Text style={{
                        flex: 8,
                        textAlign: 'center',
                        justifyContent: 'center',
                        color: colorTitle,
                        alignItems: 'center',
                        fontSize: GLOBAL.fontsize(2.5)
                    }}> {title} </Text>
                    {
                        nameIconRight != undefined ?
                            <TouchableOpacity
                                onPress={pressIconRight}
                                style={{ flex: 1 }}
                            >
                                <Icon name={nameIconRight} size={25} color={colorIconRight} />
                            </TouchableOpacity>
                            :
                            <View style={{ flex: 1 }} />
                    }

                </View>
            )
        } else {
            return (
                <Header
                    placement="left"
                    leftComponent={<Icon name={nameIconLeft} size={30} color={colorIconLeft} onPress={pressIconLeft} />}
                    centerComponent={{
                        text: `${title}`, style: {
                            color: `${colorTitle}`,
                            fontWeight: 'bold',
                            fontSize: GLOBAL.fontsize(2.5),
                            textAlign: 'center'
                        }
                    }}
                    rightComponent={nameIconRight != undefined ? <Icon name={nameIconRight} size={30} color={colorIconRight} onPress={pressIconRight} /> : null}
                    backgroundColor="transparent"
                    containerStyle={{ borderBottomColor: 0 }}
                />
            )
        }

    }
}

const styles = StyleSheet.create({
    menubar: {
        flexDirection: 'row',
        paddingHorizontal: 5,
        paddingVertical: 10,
    },

})