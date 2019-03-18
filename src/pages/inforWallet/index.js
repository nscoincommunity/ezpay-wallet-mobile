import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import QRCode from 'react-native-qrcode';
import Header from '../../components/header';
import GLOBAL from '../../helper/variables';
import { getBottomSpace, getStatusBarHeight } from 'react-native-iphone-x-helper'
import Gradient from 'react-native-linear-gradient';
export default class InforWallet extends Component {
    render() {
        const item = this.props.navigation.getParam('payload');
        return (
            <Gradient
                colors={['#F0F3F5', '#E8E8E8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.container}>
                <StatusBar
                    backgroundColor={'transparent'}
                    translucent
                    barStyle="dark-content"
                />
                <Header
                    backgroundColor="transparent"
                    colorIconLeft="#328FFC"
                    colorTitle="#328FFC"
                    nameIconLeft="times"
                    title={item.name}
                    style={{ paddingTop: getStatusBarHeight() }}
                    pressIconLeft={() => { this.props.navigation.goBack(); }}
                />
                <View style={{ flex: 1, backgroundColor: 'transparent', justifyContent: 'space-between', flexDirection: 'column', paddingVertical: 20 }}>
                    <View />
                    <View>
                        <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20 }}>{item.network.name}</Text>
                        <TouchableOpacity style={{
                            justifyContent: 'center',
                            alignItems: 'center', margin: 20
                        }}>
                            <QRCode
                                value={item.address}
                                size={GLOBAL.wp('65%')}
                                bgColor='black'
                                fgColor="white"
                            />
                        </TouchableOpacity>
                        <Text style={{ textAlign: 'center' }}>{item.address}</Text>
                    </View>
                    <View style={{ paddingHorizontal: GLOBAL.wp('10%'), marginBottom: getBottomSpace() }}>
                        <TouchableOpacity style={styles.buttonShare}>
                            <Gradient
                                style={{ paddingVertical: 15, borderRadius: 5 }}
                                colors={['#08AEEA', '#328FFC']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <Text style={{ textAlign: 'center', color: '#fff' }}>Share</Text>
                            </Gradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </Gradient>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonShare: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2.27,
        elevation: 7,
    }
})