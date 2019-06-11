import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import Header from '../../../components/header';
import Color from '../../../../helpers/constant/color';
import ImageApp from '../../../../helpers/constant/image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Gradient from 'react-native-linear-gradient';
import { Remove_account_of_token } from './actions'

export default class InforAccount extends Component {

    Remove_wallet = () => {
        const { section, funcReload } = this.props.navigation.getParam('payload');
        console.log(this.props.navigation.state.params)
        Remove_account_of_token(section.id).then(ss => {
            funcReload();
            this.props.navigation.goBack();
        })
    }
    render() {
        const { section, symbol, addressTK } = this.props.navigation.getParam('payload');
        console.log('section', section)
        return (
            <Gradient
                colors={Color.Gradient_backgound_page}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ flex: 1 }}
            >
                <Header
                    IconLeft="arrow-back"
                    onPressLeft={() => this.props.navigation.goBack()}
                    Title={section.name}
                    styleTitle={{ color: Color.Tomato }}
                />
                <View style={{ flex: 1, padding: 10 }}>
                    <View style={styles.FormInfor}>
                        <View style={styles.styleRow}>
                            <Text style={{ flex: 2, fontWeight: 'bold' }}>Name:</Text>
                            <Text style={{ flex: 7 }}>{section.name}</Text>
                            <TouchableOpacity
                                style={{ flex: 1 }}
                            >
                                <Icon name="pencil" color={Color.Tomato} size={20} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.styleRow}>
                            <Text style={{ flex: 2, fontWeight: 'bold' }}>Address:</Text>
                            <Text style={{ flex: 8, color: Color.Dark_gray }} numberOfLines={1} ellipsizeMode="middle">{section.address}</Text>
                        </View>

                        <View style={styles.styleRow}>
                            <Text style={{ flex: 2, fontWeight: 'bold' }}>Type:</Text>
                            <Text style={{ flex: addressTK == '' ? 8 : 6, color: Color.Dark_gray }}>{symbol}</Text>
                            {
                                addressTK !== '' &&
                                <Text style={{ flex: 2, color: Color.Dark_gray }}>ERC20</Text>
                            }
                        </View>

                        <View style={styles.styleRow}>
                            <Text style={{ flex: 2, fontWeight: 'bold' }}>Balance:</Text>
                            <Text style={{ flex: 8, color: Color.Dark_gray }}>{section.balance}</Text>
                        </View>
                        <View style={{ padding: 20, paddingHorizontal: 30 }}>
                            <TouchableOpacity
                                style={{
                                    shadowColor: '#000',
                                    shadowOffset: {
                                        width: 1,
                                        height: 2,
                                    },
                                    shadowOpacity: 0.21,
                                    shadowRadius: 5,
                                    elevation: 2,
                                }}
                            >
                                <Gradient
                                    colors={Color.Gradient_button_tomato}
                                    style={styles.styleButton}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                >
                                    <Text style={{ color: '#fff', fontSize: 15 }}>Export private key</Text>
                                </Gradient>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    shadowColor: '#000',
                                    shadowOffset: {
                                        width: 1,
                                        height: 2,
                                    },
                                    shadowOpacity: 0.21,
                                    shadowRadius: 5,
                                    elevation: 2,
                                }}
                                onPress={() => this.Remove_wallet()}
                            >
                                <Gradient
                                    colors={Color.Gradient_button_red}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.styleButton}
                                >
                                    <Text style={{ color: '#fff', fontSize: 15 }}>Remove</Text>
                                </Gradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Gradient>
        )
    }
}

const styles = StyleSheet.create({
    FormInfor: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
    },
    styleRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: Color.Dark_gray,
        padding: 10
    },
    FirstCol: {

    },
    SecondCol: {

    },
    EndCol: {

    },
    styleButton: {
        alignItems: 'center',
        borderRadius: 8,
        paddingVertical: 10,
        marginVertical: 10,

    }
})