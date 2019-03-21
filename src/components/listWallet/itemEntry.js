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
import Gradient from 'react-native-linear-gradient'
const { width, height } = Dimensions.get('window');
function wp(percentage) {
    const value = (percentage * width) / 100
    return Math.round(value);
}

const itemWidth = wp(65) + wp(2) * 6;
interface item {
    bg_net: any,
    img_net: any,
    color_text_backup: string,
    name_token: string,
    color_gradient: Array
}

class EntryComponent extends Component {

    onClickItem = (item) => {
        console.log('aaa', this.props)
        this.props.navigation.navigate('InforWallet', { payload: item })
    }

    _renderContent = (StyleItem, item) => {
        return (
            <Gradient
                colors={StyleItem.color_gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ flex: 1, borderRadius: 5, flexDirection: 'column' }}
            >
                <View style={{ flex: 8, flexDirection: 'row' }}>
                    <ImageBackground
                        source={StyleItem.bg_net}
                        resizeMode="cover"
                        style={{ flex: 4.6, justifyContent: 'center', alignItems: 'center' }}
                        imageStyle={{ position: 'absolute', top: 0, left: 0 }}
                    >
                        <Image
                            source={StyleItem.img_net}
                            resizeMode="center"
                            style={{
                                marginBottom: GLOBAL.hp('7%'),
                                marginRight: GLOBAL.wp('8%')
                            }} />
                    </ImageBackground>
                    <View style={{
                        flex: 5.4,
                        justifyContent: 'space-between',
                        paddingRight: GLOBAL.wp('5%'),
                        paddingTop: GLOBAL.hp('2%')
                    }}>
                        <View >
                            <Text style={[styles.textItem, { fontSize: GLOBAL.fontsize(4), fontWeight: 'bold' }]}>{this.props.balance == NaN ? this.props.balance : item.balance}</Text>
                            <Text style={[styles.textItem, { opacity: 0.7, marginBottom: GLOBAL.wp('12%') }]} >Total value</Text>
                        </View>
                        <View>
                            <Text style={[styles.textItem, { fontWeight: 'bold' }]}>{item.name}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ flex: 2, justifyContent: 'center', paddingRight: GLOBAL.wp('5%') }}>
                    {
                        item.typeBackup &&
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('Backup', {
                                payload: {
                                    wallet: item
                                }
                            })}
                        >
                            <Text style={{ textAlign: 'right', color: StyleItem.color_text_backup }}>{Language.t('Dashboard.CheckBackup')}</Text>
                        </TouchableOpacity>
                    }
                </View>
            </Gradient>
        )
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
            let StyleItem: item;
            if (this.props.item.network.name) {
                switch (this.props.item.network.name) {
                    case 'nexty':
                        StyleItem = {
                            bg_net: require('../../images/dasboard/bgEntry/nexty/bg_nty.png'),
                            color_text_backup: '#FF0000',
                            img_net: require('../../images/dasboard/bgEntry/nexty/img_nty.png'),
                            name_token: 'NTY',
                            color_gradient: ['#325EFC', '#2AA0F5']
                        }
                        break;
                    case 'ethereum':
                        StyleItem = {
                            bg_net: require('../../images/dasboard/bgEntry/ethereum/bg_eth.png'),
                            color_text_backup: '#FF0000',
                            img_net: require('../../images/dasboard/bgEntry/ethereum/img_eth.png'),
                            name_token: 'ETH',
                            color_gradient: ['#C4C4C4', '#979797']
                        }
                        break;
                    default:
                        StyleItem = {
                            bg_net: require('../../images/dasboard/bgEntry/tron/bg_trx.png'),
                            color_text_backup: '#FFF',
                            img_net: require('../../images/dasboard/bgEntry/tron/img_trx.png'),
                            name_token: 'TRX',
                            color_gradient: ['#7D0202', '#F34C4C']
                        }
                        break;
                }
            }
            return (
                <TouchableOpacity
                    onPress={() => this.onClickItem(item)}
                    style={[styles.ItemCarousel, Platform.OS == 'ios' ? onShadow.shadow : {}]}
                >
                    {this._renderContent(StyleItem, item)}
                    {/* <ImageBackground
                        source={bg_Entry}
                        style={{ flex: 1 }}
                        resizeMode="cover"
                        imageStyle={{ borderRadius: 5 }}
                    >
                        <Text style={[styles.textItem, { fontSize: GLOBAL.fontsize(5), fontWeight: 'bold' }]}>{this.props.balance == NaN ? this.props.balance : item.balance}</Text>
                        <Text style={[styles.textItem, { opacity: 0.7, marginBottom: GLOBAL.wp('12%') }]} >Total value</Text>
                        <Text style={[styles.textItem, { fontWeight: 'bold' }]}>{item.name}</Text>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('Backup', {
                                payload: {
                                    wallet: item
                                }
                            })}
                        >
                            <Text style={{ textAlign: 'right', color: colorBackup }}>{Language.t('Dashboard.CheckBackup')}</Text>
                        </TouchableOpacity>
                    </ImageBackground> */}
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
        flex: 1,
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