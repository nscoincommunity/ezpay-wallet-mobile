import React, { Component } from 'react'
import { View, Text, Button, TouchableOpacity, StyleSheet, ScrollView, BackHandler, Platform, Keyboard, Alert } from 'react-native';
import GLOBALS from '../../helper/variables';
import Icon from "react-native-vector-icons/FontAwesome";
import Chart from '../../components/chart';
import List from '../../components/listCoin';
import { getData, rmData, setData } from '../../services/data.service';
import Language from '../../i18n/i18n';
import TouchID from 'react-native-touch-id';


export default class dashboard extends Component {
    mounted: boolean = true

    constructor(props) {
        super(props)

        this.state = {
            balanceNTY: '',
            isBackup: true
        };
    };

    componentDidMount() {
        Keyboard.dismiss();
        if (this.mounted) {
            getData('isBackup').then(data => {
                if (data == 1) {
                    this.setState({ isBackup: true });
                } else {
                    this.setState({ isBackup: false });
                }
            })
            getData('activeTouchID')
                .then(data => {
                    TouchID.isSupported().then(() => {
                        if (data == 0) {
                            Alert.alert(
                                Language.t('AlertTouchID.Title'),
                                Language.t('AlertTouchID.Content'),
                                [
                                    {
                                        text: Language.t('AlertTouchID.BtnSetting'), onPress: () => {
                                            this.props.navigation.navigate('Setting');
                                            setData('activeTouchID', '1');
                                        }
                                    },
                                    { text: Language.t('AlertTouchID.BtnCancel'), onPress: () => { setData('activeTouchID', '1') }, style: 'cancel' }
                                ]
                            )
                        }
                    })
                }).catch(err => {
                    console.log('aaa', err)
                })
        }
    }



    componentWillUnmount() {
        this.mounted = false;
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
                <List />
                {
                    !this.state.isBackup ?
                        <View style={{
                            flexDirection: 'row',
                            backgroundColor: 'transparent',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingHorizontal: GLOBALS.wp('3%'),
                            paddingVertical: GLOBALS.hp('1%')
                        }}>
                            <Text style={{
                                flex: 8,
                                color: '#fff',
                                fontFamily: GLOBALS.font.Poppins,
                                fontSize: GLOBALS.wp('4%')
                            }}>{Language.t('Dashboard.CheckBackup')}</Text>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: GLOBALS.Color.secondary,
                                    borderRadius: GLOBALS.hp('10%'),
                                    justifyContent: 'center',
                                    padding: GLOBALS.wp('2.5%'),
                                    paddingHorizontal: GLOBALS.wp('3%'),
                                    margin: 4,
                                    shadowColor: GLOBALS.Color.secondary,
                                    shadowOffset: {
                                        width: 0,
                                        height: 0,
                                    },
                                    shadowOpacity: Platform.OS == 'ios' ? 0.6 : 10,
                                    shadowRadius: 6.27,
                                    elevation: Platform.OS == 'ios' ? 20 : 3,
                                }}
                                onPress={() => this.gotoBackup()}
                            >
                                <Text style={{ color: '#fff', textAlign: 'center', fontFamily: GLOBALS.font.Poppins, fontSize: GLOBALS.wp('4%') }}>{Language.t('Dashboard.ButtonBackup')}</Text>
                            </TouchableOpacity>
                        </View>
                        : null
                }
                <Chart />
            </ScrollView>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent'
    }
})