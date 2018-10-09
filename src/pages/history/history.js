import React, { Component } from 'react'
import { View, FlatList, RefreshControl } from 'react-native';
import GLOBALS from '../../helper/variables';
import Icon from "react-native-vector-icons/FontAwesome";
import CONSTANTS from '../../helper/constants';
import { POSTAPI } from '../../helper/utils'
import { Address } from '../../services/auth.service'
import { getDataHis, HistoryModel, historyData } from './history.service'

import {
    Container,
    Header,
    Title,
    Content,
    Text,
    Button,
    Left,
    Right,
    Body,
    ListItem,
    Spinner,
} from "native-base";


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
        this.setState({ isRefreshing: true, transactions: [], isLoading: true })
        getDataHis().then(async data => {
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

    componentDidMount() {
        this.getData();
    }

    getFullTransaction(): Transaction[] {
        let transactions = [];
        // var AddressTest = '0xCf9D1938F80861D0B512a8E322F190a293eEC87e';
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
        setTimeout(() => {
            try {
                getDataHis(this.state.index, length)
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

    handleLoadMore = () => {
        console.log('load more')
        // this.onEndReached()
        // this.setState({ index: transactions.length }, () => {
        //     this._onEndReached()
        // })
    }

    render() {
        if (this.state.isLoading) {
            return (
                <Container style={{ backgroundColor: '#fff' }}>
                    <Header style={{ backgroundColor: GLOBALS.Color.primary }}>
                        <Left>
                            <Button
                                transparent
                                onPress={() => this.props.navigation.openDrawer()}
                            >
                                <Icon name="bars" color='#fff' size={25}></Icon>
                            </Button>
                        </Left>
                        <Body>
                            <Title style={{ color: '#fff', fontFamily: GLOBALS.font.Poppins }}>History</Title>
                        </Body>
                        <Right />
                    </Header>
                    <Content padder contentContainerStyle={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center', height: GLOBALS.HEIGHT - 20 }}>
                        <Spinner color={GLOBALS.Color.primary} />
                        <Text>Please waitting ...</Text>
                    </Content>
                </Container>
            )
        } else {
            return (
                <Container style={{ backgroundColor: "#fff" }}>
                    <Header style={{ backgroundColor: GLOBALS.Color.primary }}>
                        <Left>
                            <Button
                                transparent
                                onPress={() => this.props.navigation.openDrawer()}
                            >
                                <Icon name="bars" color='#fff' size={25}></Icon>
                            </Button>
                        </Left>
                        <Body>
                            <Title style={{ color: '#fff', fontFamily: GLOBALS.font.Poppins }}>History</Title>
                        </Body>
                        <Right />
                    </Header>

                    {/* <Content padder> */}
                    {
                        this.state.transactions ?
                            <FlatList
                                data={this.state.transactions}
                                renderItem={({ item }) => {
                                    return (
                                        < ListItem
                                            button
                                            noBorder
                                            onPress={() => this.props.navigation.navigate("DetailsHis", { data: item })
                                            }
                                        >
                                            <Left>
                                                <Icon
                                                    active
                                                    name={item.type}
                                                    style={{ color: item.type == "arrow-down" ? "green" : 'red', fontSize: 26, width: 30, marginRight: 10 }}
                                                />
                                                <Text style={{ fontFamily: GLOBALS.font.Poppins }}>
                                                    {item.datetime}
                                                </Text>
                                            </Left>
                                            <Right>
                                                <Icon name="angle-right"
                                                    style={{ fontSize: 26 }}
                                                />
                                            </Right>
                                        </ListItem>

                                    );
                                }}
                                onEndReached={() => this.onEndReached()}
                                onEndReachedThreshold={0.001}
                                // ListFooterComponent={<BottomList show={this.state.loadbottom} />}
                                keyExtractor={(item, index) => index.toString()}
                                refreshControl={
                                    <RefreshControl  //Component cho chức năng Pull to Refresh
                                        refreshing={this.state.isRefreshing}  // check xem có hành động Pull trên màn hình của user hay không
                                        onRefresh={() => this.getData()} // mỗi lần pull thì sẽ thực hiện hàm getData để load dữ liệu về
                                    ></RefreshControl>
                                }

                            ></FlatList>
                            : null
                    }

                    {/* </Content> */}
                </Container >
            )
        }
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
