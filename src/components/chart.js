import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import GLOBALS from '../helper/variables';
import { Spinner } from "native-base";
import Constants from '../helper/constants'
import { VictoryArea, VictoryStack, VictoryChart, VictoryAxis } from "victory-native";
import Language from '../i18n/i18n'
import { Defs, Stop, LinearGradient } from 'react-native-svg'


export default class Chart extends Component {
    constructor(props) {
        super(props)

        this.state = {
            DataChart: [],
            selected: 'D'
        };
    };

    componentDidMount() {
        this.changeChart('D')

    }

    changeChart(type) {
        this.setState({ DataChart: [], selected: type })
        var time = new Date;
        var url = '';
        switch (type) {
            case 'D': {
                url = Constants.COINMARKETCAP + (time.getTime() - Constants.DAY) + '/' + time.getTime() + '/'
            }
                break;
            case 'W': {
                url = Constants.COINMARKETCAP + (time.getTime() - Constants.WEEK) + '/' + time.getTime() + '/'
            }
                break;
            case 'M': {
                url = Constants.COINMARKETCAP + (time.getTime() - Constants.MONTH) + '/' + time.getTime() + '/'
            }
                break;
            default: {
                url = Constants.COINMARKETCAP
            }
                break;
        }

        try {
            fetch(url)
                .then(response => response.json())
                .then(response => {
                    var tempData = [];
                    var i = 0;
                    response['price_usd'].forEach(element => {
                        i++;
                        tempData.push({
                            x: element[0],
                            y: element[1]
                        })
                        if (i == response['price_usd'].length - 1) {
                            this.setState({ DataChart: tempData })
                        }
                    });
                })
        } catch (error) {
            console.log('e' + error);
        }

    }



    render() {
        var HorizontalData = [
            {
                type: 'D',
                show: Language.t('Dashboard.Day')
            },
            {
                type: 'W',
                show: Language.t('Dashboard.Week')
            },
            {
                type: 'M',
                show: Language.t('Dashboard.Month')
            },
            {
                type: 'ALL',
                show: Language.t('Dashboard.All')
            },
        ]
        return (
            <View style={styles.container}>
                {this.state.DataChart.length > 0 ?
                    <VictoryChart
                        height={GLOBALS.hp('30%')}
                        padding={{ top: 0, bottom: 0, left: GLOBALS.wp('1%'), right: GLOBALS.wp('1%') }}
                    >
                        <Defs>
                            <LinearGradient id="gradientStroke"
                                x1="0%"
                                x2="0%"
                                y1="50%"
                                y2="100%"
                            >
                                <Stop offset="0%" stopColor="#30C7D3" stopOpacity="0.2" />
                                <Stop offset="70%" stopColor="#30C7D3" stopOpacity="0" />
                            </LinearGradient>
                        </Defs>
                        <VictoryArea
                            style={{
                                data: {
                                    // fill: "#30C7D3",
                                    // fillOpacity: 0.3,
                                    // stroke: "#30C7D3",
                                    // strokeWidth: 2,
                                    fill: 'url(#gradientStroke)',
                                    stroke: '#30C7D3',
                                    strokeWidth: 1
                                },
                                axisLabel: { fontSize: 16, fill: '#E0F2F1' },
                            }}
                            data={this.state.DataChart}
                            // animate={{
                            //     duration: 2000,
                            //     onLoad: { duration: 1000 }
                            // }}
                            padding={{ top: 20, bottom: 0, left: 10, right: 10 }}
                        >
                        </VictoryArea>
                        <VictoryAxis style={{ axis: { stroke: "none" } }} tickFormat={() => ''}
                        />
                    </VictoryChart>
                    :
                    <View style={{ width: GLOBALS.WIDTH, height: GLOBALS.hp('30%'), justifyContent: 'center', alignItems: 'center' }}>
                        {/* <Spinner color="#fff" /> */}
                        <Image source={require('../images/loading.gif')} style={{ height: 80, width: 80 }} />
                        {/* <Text style={{ color: '#fff' }}>Please waitting ...</Text> */}
                    </View>
                }
                <FlatList
                    style={{ marginTop: 5, borderBottomWidth: 0.25, borderBottomColor: '#cecece' }}
                    // horizontal={true}
                    numColumns={4}
                    data={HorizontalData}
                    renderItem={({ item, index }) => {
                        return (
                            // <HorizontalItem item={item} index={index} parentlatLis={this} />
                            <TouchableOpacity
                                onPress={() =>
                                    this.state.DataChart.length > 0 ?
                                        this.changeChart(item.type)
                                        : console.log('aaa')
                                }
                                style={
                                    selectedBtn(this.state.selected === item.type).selected
                                }
                            >
                                <View >
                                    <Text style={[styles.text, selectedBtn(this.state.selected === item.type).text]}>{item.show}</Text>
                                    {
                                        this.state.selected === item.type &&
                                        <View style={{
                                            height: 2,
                                            backgroundColor: '#30C7D3',
                                            // borderBottomWidth: 1,
                                            // borderColor: '#30C7D3',
                                            marginTop: GLOBALS.hp('1%'),
                                            shadowColor: "#2CC8D4",
                                            shadowOffset: {
                                                width: 0,
                                                height: 0,
                                            },
                                            shadowOpacity: 0.6,
                                            shadowRadius: 6.27,
                                            elevation: 2,
                                            zIndex: 9999
                                        }} />
                                    }
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                    keyExtractor={(item, index) => item.type}
                />
            </View >
        );
    }
}

const selectedBtn = (type) => StyleSheet.create({
    selected: {
        flex: 1,
        alignItems: 'center',
    },
    text: {
        fontWeight: type ? 'bold' : 'normal',
        // textDecorationLine: type ? 'underline' : 'none',
    }
})

const styles = StyleSheet.create({
    container: {
        flex: 42, // take 38% of the screen height
        backgroundColor: 'transparent',
        marginTop: GLOBALS.hp('1%'),
    },
    text: {
        textAlign: 'center',
        color: '#fff',
        fontFamily: GLOBALS.font.Poppins
    },
    active: {
        fontWeight: 'bold',

    }
});