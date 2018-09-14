import React, { Component } from 'react'
import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';
import GLOBALS from '../../helper/variables';
import Icon from "react-native-vector-icons/FontAwesome";
import Chart from '../../components/chart';
import Ranges from '../../components/ranges';
import List from '../../components/listCoin';


export default class dashboard extends Component {

    constructor(props) {
        super(props)

        this.state = {
            balanceNTY: ''
        };


    };

    static navigationOptions = {
        headerStyle: {
            backgroundColor: GLOBALS.Color.primary,
        },
        headerTitleStyle: {
            color: 'white',
        },
        headerBackTitleStyle: {
            color: 'white',
        },
        headerTintColor: 'white',
    };
    render() {
        return (
            <View style={styles.container}>
                <Chart />
                <Ranges />
                <List />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})