import React, { Component } from 'react'
import {
    View,
    FlatList,
    RefreshControl,
    StyleSheet,
    Platform,
    TouchableOpacity,
    Text,
    StatusBar
} from 'react-native';
import GLOBALS from '../../helper/variables';
import Icon from "react-native-vector-icons/FontAwesome";
import CONSTANTS from '../../helper/constants';
import { POSTAPI } from '../../helper/utils'
import { getDataHis, HistoryModel, historyData } from './history.service'
import Language from '../../i18n/i18n'
import IconFeather from "react-native-vector-icons/Feather"
import Header from '../../components/header';



export class Transaction {
    tx: string;
    type: string;
    quantity: string;
    datetime: string;
    data: HistoryModel;
}

export let transactions: Transaction[];
export const length = 15;
export default class History extends Component {

    constructor(props) {
        super(props)

        this.state = {
            transactions: transactions,
            index: 0,
            isLoading: true,
            isRefreshing: false,
            loadbottom: false
        };
    };

    getData() {
        const { address, network } = this.props.navigation.getParam('payload')
        this.setState({ isRefreshing: true, transactions: [], isLoading: true })
        getDataHis(0, 15, address, network).then(async data => {
            transactions = await this.getFullTransaction();
            await this.setState({
                transactions: transactions,
                index: transactions.length,
                isLoading: false,
                isRefreshing: false
            });
        }).catch((e) => [
            this.setState({
                isLoading: false,
                isRefreshing: false
            })
        ])
    }

    componentWillMount() {
        this.getData();
    }

    getFullTransaction(): Transaction[] {
        let transactions = [];
        for (let entry of historyData) {
            let type = 'arrow-up';
            if (entry.to.toLowerCase() == Address.toLowerCase()) {
                type = 'arrow-down'
            }
            let transaction = new Transaction();
            transaction.tx = entry.tx;
            transaction.type = type;
            transaction.quantity = entry.value.toFixed(2) + " NTY";
            transaction.datetime = entry.time.format("YYYY-MM-DD HH:mm:ss");
            transaction.data = entry;
            transactions.push(transaction)
        }
        return transactions;
    }

    onEndReached() {
        this.setState({ loadbottom: true })
        const { address, network } = this.props.navigation.getParam('payload')
        setTimeout(() => {
            try {
                getDataHis(this.state.index, length, address, network)
                    .then(async data => {
                        await this.getFullTransaction().forEach(element => {
                            transactions.push(element)
                        });
                        await this.setState({ index: transactions.length, loadbottom: false })
                        console.log(this.state.index)
                    }).catch((err) => {
                        console.log('err', err)
                    })
            } catch (error) {
                console.log(error)
            }
            if (this.state.index % length == 0) {
                this.setState({ loadbottom: false })
            }
        }, 1000);


    }


    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "#fafafa" }}>
                <StatusBar
                    backgroundColor={'transparent'}
                    translucent
                    barStyle="dark-content"
                />
                <Header
                    backgroundColor="transparent"
                    colorIconLeft="#328FFC"
                    colorTitle="#328FFC"
                    nameIconLeft="arrow-left"
                    title={Language.t('History.Title')}
                    style={{ marginTop: 23 }}
                    pressIconLeft={() => this.props.navigation.goBack()}
                />
                {
                    this.state.isLoading ?
                        null
                        :
                        <View style={styles.container}>
                            <View style={{
                                backgroundColor: '#fff',
                                flex: 1,
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 0,
                                },
                                shadowOpacity: 0.14,
                                shadowRadius: 2.27,
                                elevation: 2,
                                borderRadius: 10,
                            }}>
                                {
                                    this.state.transactions.length > 0
                                        ?
                                        <FlatList
                                            style={{ padding: GLOBALS.hp('2%') }}
                                            data={this.state.transactions}
                                            extraData={this.state}
                                            renderItem={({ item }) => {
                                                return (
                                                    <TouchableOpacity
                                                        onPress={() => this.props.navigation.navigate("DetailsHis", { data: item })}
                                                        style={styles.row}>
                                                        <Icon
                                                            active
                                                            name={item.type}
                                                            style={{ color: item.type == "arrow-down" ? "green" : 'red', flex: 1 }}
                                                            size={GLOBALS.wp('6%')}
                                                        />
                                                        <Text style={{
                                                            flex: 7,
                                                            fontFamily: GLOBALS.font.Poppins,
                                                            fontSize: GLOBALS.wp('4%')
                                                        }}>{item.datetime}</Text>
                                                        <Icon
                                                            name="angle-right"
                                                            style={{ flex: 1, textAlign: 'right' }}
                                                            size={GLOBALS.wp('6%')}
                                                            color="#AAA"
                                                        />
                                                    </TouchableOpacity>
                                                );
                                            }}
                                            onEndReached={() => this.onEndReached()}
                                            onEndReachedThreshold={0.001}
                                            keyExtractor={(item, index) => index.toString()}
                                            refreshControl={
                                                <RefreshControl  //Component cho chức năng Pull to Refresh
                                                    refreshing={this.state.isRefreshing}  // check xem có hành động Pull trên màn hình của user hay không
                                                    onRefresh={() => this.getData()} // mỗi lần pull thì sẽ thực hiện hàm getData để load dữ liệu về
                                                ></RefreshControl>
                                            }

                                        />
                                        :
                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                            <Icon name="exclamation-circle" color="#d1d1d1" size={GLOBALS.hp('20%')} />
                                            <Text style={{ fontFamily: GLOBALS.font.Poppins, fontSize: GLOBALS.hp('2.5%') }}>{Language.t('History.NoTransaction')}</Text>
                                        </View>
                                }

                            </View>
                        </View>
                }
            </View>
        )
    }
}
class BottomList extends Component {
    render() {
        return (
            <View>
                {
                    this.props.show ?
                        <Spinner color={GLOBALS.Color.primary} /> : null
                }
            </View>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: GLOBALS.hp('2%')
    },
    row: {
        paddingVertical: GLOBALS.hp('3%'),
        paddingHorizontal: GLOBALS.hp('2%'),
        flexDirection: 'row',
        borderRadius: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#AAA',
        marginLeft: Platform.OS == 'android' ? GLOBALS.wp('5%') : 'auto',
    }
})