import React, { Component } from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Image,
    ImageBackground,
    PixelRatio,
    Platform
} from 'react-native'
import GLOBAL from '../../helper/variables'
import Icon from "react-native-vector-icons/FontAwesome";
import Language from '../../i18n/i18n';
import { connect } from 'react-redux'

const { width, height } = Dimensions.get('window');
function wp(percentage) {
    const value = (percentage * width) / 100
    return Math.round(value);
}

const itemWidth = wp(65) + wp(2) * 6;

class EntryComponent extends Component {

    // componentDidMount() {
    //     this.props.navigation.navigate('AddNewWallet')
    // }
    onClickItem = (item) => {
        console.log('aaa', this.props)
        // alert(PixelRatio.get(), GLOBAL.hp('1%') / GLOBAL.wp('1%'))
        this.props.navigation.navigate('InforWallet', { payload: item })
    }
    render() {
        const { item, index } = this.props;
        if (item.wallet == "addNew") {
            return (
                < TouchableOpacity
                    onPress={() => this.props.navigation.navigate('AddNewWallet')}
                    style={styles.AddNewItem}
                >
                    <ImageBackground
                        source={require('../../images/dasboard/bgEntry/new/new.png')}
                        style={{
                            flex: 1, justifyContent: 'flex-end', paddingVertical: GLOBAL.hp('4%')
                        }}
                        resizeMode="cover"
                        imageStyle={{ borderRadius: 5 }}
                    >
                        <Text style={{ textAlign: 'center', color: '#fff', }}>Add new wallet</Text>
                    </ImageBackground>
                </TouchableOpacity >
            )
        } else {
            let bg_Entry;
            let type_token;
            let colorBackup = '#FF0000';
            if (this.props.item.network.name) {
                switch (this.props.item.network.name) {
                    case 'nexty':
                        bg_Entry = require('../../images/dasboard/bgEntry/nexty/nty.png');
                        type_token = 'NTY';
                        break;
                    case 'ethereum':
                        bg_Entry = require('../../images/dasboard/bgEntry/ethereum/eth.png');
                        type_token = 'ETH';
                        break;
                    default:
                        bg_Entry = require('../../images/dasboard/bgEntry/tron/tron.png');
                        type_token = 'TRX';
                        colorBackup = "#fff"
                        break;
                }
            }
            return (
                <TouchableOpacity
                    onPress={() => this.onClickItem(item)}
                    style={[styles.ItemCarousel, Platform.OS == 'ios' ? onShadow.shadow : {}]}
                >
                    <ImageBackground
                        source={bg_Entry}
                        style={{ padding: GLOBAL.wp('1%'), paddingRight: GLOBAL.wp('6%'), paddingVertical: GLOBAL.hp('2%') }}
                        resizeMode="contain"
                        imageStyle={{ borderRadius: 5 }}
                    >
                        <Text style={[styles.textItem, { fontSize: GLOBAL.fontsize(5), fontWeight: 'bold' }]}>{this.props.balance == NaN ? this.props.balance : item.balance}</Text>
                        <Text style={[styles.textItem, { opacity: 0.7, marginBottom: GLOBAL.wp('12%') }]} >Total value</Text>
                        <Text style={[styles.textItem, { fontWeight: 'bold' }]}>{item.name}</Text>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('Backup')}
                        >
                            <Text style={{ textAlign: 'right', color: colorBackup }}>{Language.t('Dashboard.CheckBackup')}</Text>
                        </TouchableOpacity>
                    </ImageBackground>
                </TouchableOpacity >
            )
        }
    }
}

const onShadow = StyleSheet.create({
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: -1,
            height: 2,
        },
        shadowOpacity: 0.4,
        shadowRadius: 4.27,
        elevation: 2,
    }
});

const styles = StyleSheet.create({
    textItem: {
        textAlign: 'right',
        color: '#fff',
    },
    ItemCarousel: {
        borderRadius: 10,
    },
    AddNewItem: {
        borderRadius: 5,
        flex: 1,
    },
})

const mapStateToProps = state => {
    return { balance: state.updateBalance.balance }
}

export default connect(mapStateToProps, null)(EntryComponent)