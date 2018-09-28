import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import Line from './line';
// import { SmoothLine } from 'react-native-pathjs-charts'
import GLOBALS from '../helper/variables';
import { Spinner } from "native-base";
import Constants from '../helper/constants'
// import PureChart from 'react-native-pure-chart';
import { VictoryArea, VictoryStack } from "victory-native";


var HorizontalData = [
    {
        type: 'D',
        show: 'Day'
    },
    {
        type: 'W',
        show: 'Week'
    },
    {
        type: 'M',
        show: 'Month'
    },
    {
        type: 'ALL',
        show: 'All'
    },
]

export default class Chart extends Component {
    constructor(props) {
        super(props)

        this.state = {
            DataChart: [],
            selected: 'W'
        };
    };

    componentDidMount() {
        this.changeChart('W')

    }

    async changeChart(type) {
        await this.setState({ DataChart: [], selected: type })
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
                    response['price_usd'].forEach(async element => {
                        i++;
                        tempData.push({
                            x: element[0],
                            y: element[1]
                        })
                        if (i == response['price_usd'].length - 1) {
                            await this.setState({ DataChart: tempData })
                        }
                    });
                })
        } catch (error) {
            console.log('e' + error);
        }

    }



    render() {

        // let options = {
        //     width: GLOBALS.WIDTH,
        //     height: GLOBALS.HEIGHT / 3,
        //     color: "#286bb7",
        //     margin: {
        //         top: 20,
        //         left: 0,
        //         bottom: 0,
        //         right: 20
        //     },
        //     animate: {
        //         type: 'delayed',
        //         duration: 200
        //     },
        //     axisX: {
        //         showAxis: false,
        //         showLines: false,
        //         showLabels: false,
        //         showTicks: false,
        //         zeroAxis: true,
        //         orient: 'bottom',
        //         label: {
        //             fontFamily: 'Arial',
        //             fontSize: 14,
        //             fontWeight: true,
        //             fill: '#34495E'
        //         }
        //     },
        //     axisY: {
        //         showAxis: false,
        //         showLines: false,
        //         showLabels: false,
        //         showTicks: false,
        //         zeroAxis: false,
        //         orient: 'left',
        //         label: {
        //             fontFamily: 'Arial',
        //             fontSize: 14,
        //             fontWeight: true,
        //             fill: '#34495E'
        //         }
        //     }
        // }
        return (
            <View style={styles.container}>
                {this.state.DataChart.length > 0 ?
                    // <View />
                    // <SmoothLine data={[this.state.DataChart]} options={options} xKey='x' yKey='y' />

                    <VictoryArea
                        style={{
                            data: {
                                fill: "#286bb7",
                                fillOpacity: 0.3,
                                stroke: "#286bb7",
                                strokeWidth: 2,
                            }
                        }}
                        data={this.state.DataChart}
                        // animate={{
                        //     duration: 2000,
                        //     onLoad: { duration: 1000 }
                        // }}
                        width={GLOBALS.WIDTH}
                        height={GLOBALS.HEIGHT / 2.75}
                        padding={{ top: 20, bottom: 0, left: 10, right: 10 }}
                    />
                    :
                    <View style={{ width: GLOBALS.WIDTH, height: GLOBALS.HEIGHT / 2.75, justifyContent: 'center', alignItems: 'center' }}>
                        {/* <Spinner color="#fff" /> */}
                        <Image source={require('../images/loading.gif')} style={{ height: 80, width: 80 }} />
                        {/* <Text style={{ color: '#fff' }}>Please waitting ...</Text> */}
                    </View>
                }
                <FlatList
                    style={{ marginTop: 5 }}
                    horizontal={true}
                    data={HorizontalData}
                    renderItem={({ item, index }) => {
                        return (
                            // <HorizontalItem item={item} index={index} parentlatLis={this} />
                            <TouchableOpacity
                                onPress={() => this.changeChart(item.type)}
                                style={
                                    selectedBtn(this.state.selected === item.type).selected
                                }
                            >
                                <View style={{
                                    flex: 1,
                                    flexDirection: 'column',
                                    alignContent: 'center',
                                    width: GLOBALS.WIDTH / 4,
                                    // backgroundColor: GLOBALS.Color.primary,
                                    padding: 10
                                }}>
                                    <Text style={[styles.text, selectedBtn(this.state.selected === item.type).text]}>{item.show}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                    keyExtractor={(item, index) => item.type}
                />
            </View>
        );
    }
}

const selectedBtn = (type) => StyleSheet.create({
    selected: {
        // backgroundColor: type ? 'rgba(255, 255, 255,0.1)' : GLOBALS.Color.primary,
        borderRadius: 50,
    },
    text: {
        fontWeight: type ? 'bold' : 'normal',
        textDecorationLine: type ? 'underline' : 'none',
    }
})

const styles = StyleSheet.create({
    container: {
        flex: 42, // take 38% of the screen height
        backgroundColor: GLOBALS.Color.primary,
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