import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Avatar } from 'react-native-elements'
import GLOBAL from '../../helper/variables';


export class ItemToken extends Component {

    render() {
        const { item } = this.props
        return (
            <View style={styles.Item_coin}>
                <View style={styles.avatar_coin}>
                    <Avatar
                        size="medium"
                        rounded
                        // title={item.name}
                        overlayContainerStyle={{
                            backgroundColor: 'transparent',
                            borderWidth: 1,
                            borderColor: '#979797',
                        }}
                    />
                </View>
                <View style={styles.info_coi}>
                    <Text style={{
                        flex: 4,
                        fontWeight: 'bold',
                        fontSize: 15,
                        color: '#979797'
                    }}>{item.name}</Text>
                    <Text style={{
                        flex: 4,
                        fontSize: 15,
                        color: '#979797'
                    }}>{item.exchagerate}</Text>
                </View>
                <View style={styles.balance_coin}>
                    <Text style={{
                        flex: 6,
                        color: '#979797',
                        textAlign: 'center',
                        fontWeight: 'bold'
                    }}>{this.props.balance == NaN ? this.props.balance : item.balance}</Text>
                    <Text style={{
                        flex: 6,
                        color: '#7ED321',
                        textAlign: 'center'
                    }}>{item.change}</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    Item_coin: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#979797',
        paddingVertical: GLOBAL.hp('2%'),
    },
    avatar_coin: {
        flex: 2
    },
    info_coi: {
        flex: 4,
        flexDirection: 'column'
    },
    balance_coin: {
        flex: 4
    }
})

const mapStateToProps = (state) => {
    return { balance: state.BalanceToken.balance }
}


export default connect(mapStateToProps, null)(ItemToken)
