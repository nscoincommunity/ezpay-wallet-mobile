import React, { Component } from 'react'
import { View, Text, Button, TouchableOpacity, StyleSheet, ScrollView, BackAndroid } from 'react-native';
import GLOBALS from '../../helper/variables';
import Icon from "react-native-vector-icons/FontAwesome";
import Chart from '../../components/chart';
import Ranges from '../../components/ranges';
import List from '../../components/listCoin';
import { getData, rmData } from '../../services/data.service'

var interval
export default class dashboard extends Component {

    constructor(props) {
        super(props)

        this.state = {
            balanceNTY: '',
            isBackup: true
        };


    };
    componentWillReceiveProps() {
        console.log('componentWillReceiveProps')
    }
    componentWillMount() {

        console.log('componentWillMount');
    }

    componentDidMount() {
        getData('isBackup').then(data => {
            if (data == 1) {
                this.setState({ isBackup: true });
            } else {
                this.setState({ isBackup: false });
            }
        })
    }


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

    checkBackup() {
        getData('isBackup').then(data => {
            console.log('check backup');
            if (data == 1) {
                this.setState({ isBackup: true });
            } else {
                this.setState({ isBackup: false });
            }
        })
    }

    gotoBackup() {
        this.props.navigator.navigate('Backup', { callDasboard: this.checkBackup.bind(this) })
    }
    resetTypeBackup() {
        rmData('isBackup')
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                {/* <View style={styles.container}> */}
                {/* <TouchableOpacity
                    style={{ backgroundColor: 'red', justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => this.resetTypeBackup()}>
                    <Text style={{ color: '#fff' }}>Reset type backup</Text>
                </TouchableOpacity> */}
                {
                    !this.state.isBackup ?
                        <View style={{ flexDirection: 'row', backgroundColor: '#D50000', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ width: GLOBALS.WIDTH * 4 / 5.5, color: '#fff' }}>Wallet has not yet backed up</Text>
                            <TouchableOpacity
                                style={{ backgroundColor: GLOBALS.Color.primary, borderRadius: 3, justifyContent: 'center', padding: 5, margin: 4 }}
                                onPress={() => this.gotoBackup()}
                            >
                                <Text style={{ color: '#fff', textAlign: 'center' }}>BACK UP</Text>
                            </TouchableOpacity>
                        </View>
                        : null
                }
                <Chart />
                {/* <Ranges /> */}
                <List />
                {/* </View> */}
            </ScrollView>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GLOBALS.Color.primary
    }
})