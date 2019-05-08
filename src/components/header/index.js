import React, { Component } from 'react'
import { Text, View, StyleSheet, Platform, TouchableOpacity, ImageBackground, ViewProps } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import { Header } from 'react-native-elements';
import GLOBAL from '../../helper/variables';
import PropTypes from 'prop-types'

export interface HeaderProps extends ViewProps {
    size?: number,
    backgroundColor?: string,
    colorIconLeft?: string,
    colorIconRight?: string,
    colorTitle?: string,
    nameIconLeft?: string,
    nameIconRight?: string,
    title?: string,
    style?: any,
    pressIconLeft?: Function,
    pressIconRight?: Function,
}

export default class HeaderComponent extends Component<HeaderProps> {
    static PropTypes = {
        size: PropTypes.number,
        backgroundColor: PropTypes.string,
        colorIconLeft: PropTypes.string,
        colorIconRight: PropTypes.string,
        nameIconLeft: PropTypes.string,
        nameIconRight: PropTypes.string,
        title: PropTypes.string,
        style: PropTypes.any,
        pressIconLeft: PropTypes.func,
        pressIconRight: PropTypes.func,
        colorTitle: PropTypes.string
    }

    static defaultProps = {
        pressIconLeft: (data) => { },
        pressIconRight: (data) => { }
    }

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
                        fontSize: GLOBAL.fontsize(2.5),
                        fontFamily: GLOBAL.font.Poppins
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