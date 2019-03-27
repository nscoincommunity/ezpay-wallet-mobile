import React, { Component } from 'react'
import { Text, View, FlatList, StyleSheet } from 'react-native'
import GLOBAL from '../../helper/variables';
import { Avatar } from 'react-native-elements'
import ItemToken from './itemToken'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { getBalanceToken } from '../../../redux/actions/slideWalletAction'

class ListToken extends Component {
    Interval: any;
    intervaled: boolean = true;
    componentWillUpdate() {
        clearInterval(this.Interval)
    }
    componentDidUpdate() {
        this.UpdateBalanceTKFirst(this.props.InforToken, this.props.addressWL, this.props.network)
        this.funcUpdateBalanceTK(this.props.InforToken, this.props.addressWL, this.props.network)
    }

    componentWillMount() {
        const { InforToken, addressWL, network } = this.props;
        this.UpdateBalanceTKFirst(InforToken, addressWL, network)
        this.funcUpdateBalanceTK(InforToken, addressWL, network)
    }

    UpdateBalanceTKFirst(ListToken: Array, addressWL, network) {
        ListToken.forEach(async (Token, i) => {
            await this.props.getBalanceToken(Token.id, Token.addressToken, addressWL, network)
        })
    }

    funcUpdateBalanceTK(ListToken: Array, addressWL, network) {
        this.Interval = setInterval(() => {
            ListToken.forEach(async (Token, i) => {
                await this.props.getBalanceToken(Token.id, Token.addressToken, addressWL, network)
            })
        }, 7000)
    }

    componentWillUnmount() {
        clearInterval(this.Interval)
    }

    render() {
        const { status, InforToken } = this.props
        if (!status) {
            return (
                <FlatList
                    data={InforToken}
                    keyExtractor={(item, index) => index.toString()}
                    style={{ paddingHorizontal: GLOBAL.wp('2%') }}
                    renderItem={({ item }) => {
                        return (
                            <ItemToken item={item} />
                        )
                    }}
                />
            )
        } else {
            return (
                <FlatList
                    data={[
                        { name: 'GOS', balance: 'haha' },
                        { name: 'NTF', balance: 69696969 },
                        { name: 'BNB', balance: 343433 }
                    ]}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => {
                        return (
                            <View style={styles.Item_coin}>
                                <Text style={{
                                    flex: 4,
                                    fontWeight: 'bold',
                                    fontSize: 15,
                                    color: '#328FFC',
                                    opacity: 0.5,
                                    fontFamily: GLOBAL.font.Poppins
                                }}>{item.name}</Text>
                                <Text style={{
                                    flex: 6,
                                    color: '#328FFC',
                                    textAlign: 'center',
                                    opacity: 0.5,
                                    fontFamily: GLOBAL.font.Poppins
                                }}>{item.balance}</Text>
                            </View>
                        )
                    }}
                />
            )
        }

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


const mapDispatchToProps = dispatch => {
    return bindActionCreators({ getBalanceToken }, dispatch)
}


export default connect(null, mapDispatchToProps)(ListToken)
