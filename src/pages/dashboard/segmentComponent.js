import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import GLOBAL from '../../helper/variables';
import { fromBottom } from '../../components/effectPushScreen'
import Language from '../../i18n/i18n';

export class segmentComponent extends Component {

    shouldComponentUpdate() {
        return false
    }
    goReciver() {
        const Item = {
            id: this.props.walletID,
            name: this.props.Data.nameWL,
            address: this.props.Data.addressWL,
            network: {
                name: this.props.Data.network
            }
        }

        this.props.navigation.navigate('InforWallet', { payload: Item })
        // this.props.navigation.navigate({ screen: 'InforWallet', params: { payload: Item }, transitionConfig: fromBottom })
    }

    goSend() {
        this.props.navigation.navigate('SendScreen', { payload: this.props.Data })
    }


    render() {
        return (
            <View style={styles.formSegment}>
                <TouchableOpacity
                    style={styles.btnLeft}
                    onPress={() => this.goSend()}
                >
                    <Text style={{ textAlign: 'center', color: '#fff', fontFamily: GLOBAL.font.Poppins, fontWeight: 'bold' }}>{Language.t('Dashboard.segment.send')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.btnRight}
                    onPress={() => this.goReciver()}
                >
                    <Text style={{ textAlign: 'center', color: '#fff', fontFamily: GLOBAL.font.Poppins, fontWeight: 'bold' }}>{Language.t('Dashboard.segment.receve')}</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    formSegment: {
        flexDirection: 'row',
        // borderWidth: 1,
        // borderRadius: 5,
        // borderColor: '#ACAEBF',
        flex: 1
    },
    btnLeft: {
        flex: 5,
        backgroundColor: '#328FFC',
        borderTopLeftRadius: 3,
        borderBottomLeftRadius: 3,
        justifyContent: 'center',
    },
    btnRight: {
        borderLeftWidth: 1,
        borderLeftColor: '#2f78ed',
        flex: 5,
        backgroundColor: '#328FFC',
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        justifyContent: 'center'
    }
})


export default segmentComponent
