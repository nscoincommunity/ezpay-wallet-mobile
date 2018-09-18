import React, { Component } from 'react'
import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';
import GLOBALS from '../../helper/variables';
import Icon from "react-native-vector-icons/FontAwesome";
import Chart from '../../components/chart';
import Ranges from '../../components/ranges';
import List from '../../components/listCoin';
import { getData } from '../../services/data.service'


export default class dashboard extends Component {

    constructor(props) {
        super(props)

        this.state = {
            balanceNTY: '',
            isBackup: false
        };


    };

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

    gotoBackup() {
        this.props.navigation.navigate('Backup')
    }

    render() {
        return (
            <View style={styles.container}>
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