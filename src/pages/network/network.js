import React, { Component } from 'react'
import { Text, View, FlatList, TouchableOpacity, StyleSheet, Image, PixelRatio } from 'react-native'
import { setData, getData } from '../../services/data.service'
import Language from '../../i18n/i18n'
import GLOBALS from '../../helper/variables';
import { Radio } from 'native-base';

const ListNetwork = [
    {
        name: 'Nexty',
        uri: '2714'
    },
    {
        name: 'Ethereum',
        uri: '1027'
    }
]

const px = PixelRatio.getFontScale()
export default class SelectNetwork extends Component {
    static navigationOptions = () => ({
        title: 'Select network',
        headerStyle: {
            backgroundColor: '#fafafa',
            borderBottomWidth: 0,
            elevation: 0
        },
        headerTitleStyle: {
            color: '#0C449A',
        },
        headerBackTitleStyle: {
            color: '#0C449A'
        },
        headerTintColor: '#0C449A',
    });


    constructor(props) {
        super(props)

        this.state = {
            selected: 'Nexty'
        };
    };

    componentWillMount() {
        getData('Network').then(net => {
            if (net) {
                this.setState({ selected: net })
            } else {
                this.setState({ selected: 'Nexty' })
            }
        })
    }

    selectNetwork(network) {
        if (network == this.state.selected) return
        console.log('aaa', network)
        this.setState({ selected: network }, () => {
            setData('Network', network);
            this.props.navigation.navigate('TabNavigator')
        })
    }

    render() {
        return (
            <View style={styles.container}>
                {
                    <FlatList
                        data={ListNetwork}
                        extraData={this.state.selected}
                        keyExtractor={(item, index) => index.toString()}
                        numColumns={2}
                        renderItem={network => {
                            return (
                                <TouchableOpacity
                                    style={buttonNetwork(this.state.selected == network.item.name ? true : false).button}
                                    onPress={() => this.selectNetwork(network.item.name)}
                                >
                                    <Image
                                        resizeMode="contain"
                                        source={{ uri: `https://s2.coinmarketcap.com/static/img/coins/64x64/${network.item.uri}.png` }}
                                        style={{ height: 80, width: 80 }}
                                    />
                                    <Text style={{
                                        fontSize: px * 20,
                                        textAlign: 'center',
                                        color: this.state.selected == network.item.name ? "#000" : "#000"
                                    }}>{network.item.name}</Text>
                                </TouchableOpacity>
                            )
                        }}
                    />
                }
            </View>
        )
    }
}

const buttonNetwork = (type) => StyleSheet.create({
    button: {
        backgroundColor: type ? "#f4f4f4" : '#fafafa',
        width: (GLOBALS.wp('100%') - (GLOBALS.hp('4%') + GLOBALS.wp('8%'))) / 2,
        height: (GLOBALS.wp('100%') - (GLOBALS.hp('4%') + GLOBALS.wp('8%'))) / 2,
        padding: GLOBALS.wp('2%'),
        marginVertical: GLOBALS.wp('2%'),
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: -1,
            height: 3,
        },
        shadowOpacity: type ? 0.24 : 0,
        shadowRadius: 2.27,
        elevation: type ? 2 : 0,
        margin: GLOBALS.wp('2%'),
        justifyContent: 'center',
        alignItems: 'center',
    }
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: GLOBALS.hp('2%'),
        backgroundColor: '#fafafa'
    },
})