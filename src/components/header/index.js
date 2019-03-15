import React, { Component } from 'react'
import { Text, View, StyleSheet, Platform, TouchableOpacity, ImageBackground } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import { Header } from 'react-native-elements';
import GLOBAL from '../../helper/variables'

export default class HeaderComponent extends Component {

    render() {
        const { size, backgroundColor, colorIconLeft, colorTitle, nameIconLeft, title, style, pressIconLeft } = this.props;
        if (Platform.OS == 'ios') {
            return (
                // <ImageBackground
                //     source={require('../../images/header.png')}
                //     style={{
                //         width: GLOBAL.wp('100%')
                //     }}
                //     resizeMode="cover"
                // >
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
                        fontSize: 20
                    }}> {title} </Text>
                    <View style={{ flex: 1 }} />
                </View>
                // </ImageBackground>
            )
        } else {
            return (
                <Header
                    // backgroundImage={require('../../images/header.png')}
                    placement="left"
                    leftComponent={<Icon name={nameIconLeft} size={30} color={colorIconLeft} onPress={pressIconLeft} />}
                    centerComponent={{
                        text: `${title}`, style: {
                            color: `${colorTitle}`,
                            fontWeight: 'bold',
                            fontSize: 20,
                            textAlign: 'center'
                        }
                    }}
                    // rightComponent={{ icon: 'home', color: '#fff' }}
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