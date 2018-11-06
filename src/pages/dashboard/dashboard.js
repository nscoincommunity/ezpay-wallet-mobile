import React, { Component } from 'react'
import { View, Text, Button, TouchableOpacity, StyleSheet, ScrollView, BackHandler } from 'react-native';
import GLOBALS from '../../helper/variables';
import Icon from "react-native-vector-icons/FontAwesome";
import Chart from '../../components/chart';
import List from '../../components/listCoin';
import { getData, rmData } from '../../services/data.service'
import Language from '../../i18n/i18n'

var interval
export default class dashboard extends Component {

    constructor(props) {
        super(props)

        this.state = {
            balanceNTY: '',
            isBackup: true
        };
        // this.backButtonClick = this.backButtonClick.bind(this)
    };

    // componentWillUnmount() {
    //     console.log('aaa')
    //     BackHandler.removeEventListener("hardwareBackPress");
    // }


    // backButtonClick() {
    //     console.log('props', this.props.navigation)
    //     const { dispatch, nav } = this.props.navigation;
    //     const { state } = this.props.navigation.dangerouslyGetParent()
    //     console.log("Back pressed", state);
    //     const activeRoute = state.routes[state.index];
    //     if (activeRoute.index === 0) {
    //         return false;
    //     }
    //     dispatch(this.props.navigation.goBack());
    //     return true;
    //     // BackHandler.exitApp()
    //     // return false;
    // }

    componentDidMount() {
        // BackHandler.addEventListener("hardwareBackPress", this.backButtonClick);
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
        this.props.navigation.navigate('Backup', { callDasboard: this.checkBackup.bind(this) })
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
                        <View style={{ flexDirection: 'row', backgroundColor: '#D50000', justifyContent: 'space-between', alignItems: 'center', padding: 5 }}>
                            <Text style={{ flex: 8, color: '#fff' }}>{Language.t('Dashboard.CheckBackup')}</Text>
                            <TouchableOpacity
                                style={{ backgroundColor: GLOBALS.Color.primary, borderRadius: 3, justifyContent: 'center', padding: 5, margin: 4 }}
                                onPress={() => this.gotoBackup()}
                            >
                                <Text style={{ color: '#fff', textAlign: 'center' }}>{Language.t('Dashboard.ButtonBackup')}</Text>
                            </TouchableOpacity>
                        </View>
                        : null
                }
                <Chart />
                <List />
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