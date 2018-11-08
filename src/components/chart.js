import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import GLOBALS from '../helper/variables';
import { Spinner } from "native-base";
import Constants from '../helper/constants'
import { VictoryArea, VictoryStack } from "victory-native";
import Language from '../i18n/i18n'



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
                    style={{ marginTop: 5, }}
                    // horizontal={true}
                    numColumns={4}
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
                                <Text style={[styles.text, selectedBtn(this.state.selected === item.type).text]}>{item.show}</Text>
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
        flex: 1,
        justifyContent: 'space-between'
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