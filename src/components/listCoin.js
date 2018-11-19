import React, { Component } from 'react';
import { StyleSheet, View, Text, FlatList, Dimensions, ImageBackground, Image } from 'react-native';
import GLOBALS from '../helper/variables'
import { Item } from 'native-base'
import { updateBalance, balance, updateBalanceTK } from '../services/wallet.service';
import { Utils } from '../helper/utils';
import CONSTANTS from '../helper/constants';
import { getData } from '../services/data.service'
import Language from '../i18n/i18n'
import Carousel, { ParallaxImage } from 'react-native-snap-carousel';
import { setInterval } from 'timers';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
function wp(percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}

const slideHeight = viewportHeight * 0.4;
const slideWidth = wp(65);
const itemHorizontalMargin = wp(2);

export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 6;
const DataCoin = [];


var interval;
export default class listCoin extends Component {

    constructor(props) {
        super(props)
        this.state = {
            balanceNTY: '',
            ListToken: [],
            slider1ActiveSlide: 0,
            NTY: []
        };
        updateBalance()
            .then(res => {
                console.log('first: ', balance)
                this.setState({ balanceNTY: balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") })
            }).catch(err => {
                console.log('catch', err)
                this.setState({ balanceNTY: '0' })
            })
        this.loadListToken()
    };

    _renderItem({ item, index }, parallaxProps) {
        return (
            <View style={{ paddingVertical: 10 }}>
                <ImageBackground
                    source={require('../images/background-balance.png')}
                    style={{
                        alignContent: "center",
                        paddingVertical: GLOBALS.wp('10%'),
                        shadowColor: "#2CC8D4",
                        shadowOffset: {
                            width: 0,
                            height: 0,
                        },
                        shadowOpacity: 0.6,
                        shadowRadius: 6.27,
                        elevation: 20,
                        flexDirection: 'row'
                    }}
                    imageStyle={{
                        borderRadius: 10,

                    }}
                >
                    {/* <Text>
                        {item.nameToken}
                    </Text> */}
                    <View style={{ flex: 3, alignItems: 'center', justifyContent: 'center' }}>
                        <Image
                            source={require('../images/wallet.png')}
                            resizeMode="cover"
                            style={{ width: GLOBALS.wp('16%'), height: GLOBALS.wp('16%') }}
                        />
                    </View>
                    <View style={{ flex: 7, justifyContent: 'center' }}>
                        <Text style={{
                            color: '#fff',
                            fontWeight: '400',
                            fontFamily: GLOBALS.font.Poppins,
                            fontSize: GLOBALS.wp('4%')
                        }}>Balance: {item.symbol}</Text>
                        <Text style={{
                            color: '#fff',
                            fontWeight: '400',
                            fontFamily: GLOBALS.font.Poppins,
                            fontSize: GLOBALS.wp('8%'),
                        }}>{item.balance.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                    </View>
                </ImageBackground>
            </View>
        );
    }

    loadListToken() {
        getData('ListToken').then(data => {
            if (data != null) {
                this.state.ListToken = JSON.parse(data)
            } else {
                console.log('list token null')
            }
        })
    }

    componentDidMount() {
        interval = setInterval(() => {
            updateBalance().then(res => {
                this.setState({ balanceNTY: balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") })
            }).catch(err => {
                this.setState({ balanceNTY: '0' })
            })
        }, 2000)
        this.updateBalTK()
    }

    async updateBalTK() {
        try {
            updateBalanceTK().then(async data => {
                if (data == 1) {
                    await this.loadListToken();
                    setTimeout(() => {
                        this.updateBalTK();
                    }, 2000);
                }
            }).catch(err => {
                console.log(err)
            })
        } catch (error) {
            console.log(error)
        }

    }

    componentWillUnmount() {
        clearInterval(interval)
    }



    render() {
        var HorizontalData = this.state.ListToken
        return (
            <View style={styles.container}>
                <Carousel
                    ref={(c) => { this._carousel = c; }}
                    data={HorizontalData}
                    renderItem={this._renderItem}
                    sliderWidth={sliderWidth}
                    itemWidth={itemWidth}
                    firstItem={HorizontalData.length > 2 ? 1 : 0}
                    hasParallaxImages={true}
                    loop={true}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 38,
        backgroundColor: 'transparent',
        padding: 6,
    },
    ItemHozi: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        // width: GLOBALS.WIDTH,
        backgroundColor: 'rgba(255, 255, 255, 0.158)',
        paddingTop: 20,
        paddingBottom: 20,
        borderRadius: 4,
        marginTop: 5,
        marginBottom: 5,

    },
    contenCoin: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
        width: GLOBALS.WIDTH / 2.1,
        textAlign: 'center',
        fontFamily: GLOBALS.font.Poppins
    }
})