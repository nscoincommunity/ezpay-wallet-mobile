import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, RefreshControl } from 'react-native';
import { Add_Token, Get_All_Token_Of_Wallet } from '../../../../db';
import Header from '../../../components/header';
import SwitchButton from '../../../components/switch-button';
import TokenItem from './tokenItem';
import ImageApp from '../../../../helpers/constant/image';
import Color from '../../../../helpers/constant/color';
import Gradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { GetListToken, Func_Update_price } from '../../../../redux/rootActions/easyMode';
import { GETAPI } from '../../../../helpers/API'
import URI from '../../../../helpers/constant/uri';

class Dashboard extends Component {

    mounting = true;
    state = {
        isRefreshing: false,
    }
    componentDidMount() {
        const { navigation } = this.props;
        console.log('navigation', navigation)
        if (this.mounting) {
            this.update_price_tk()
        }
    }

    update_price_tk = () => {
        setTimeout(() => {
            if (this.props.ListToken.length > 0) {
                this.props.ListToken.forEach((item, index) => {
                    if (item.id_market !== 0) {
                        GETAPI(URI.MARKET_CAP_TICKER + item.id_market)
                            .then(res => res.json())
                            .then(res => {
                                var price = res['data']['quotes']['USD']['price'];
                                var percent_change = res['data']['quotes']['USD']['percent_change_1h'];
                                if (price > 1) {
                                    price = parseFloat(price.toFixed(2))
                                } else {
                                    price = parseFloat(price.toFixed(6))
                                }
                                this.props.Func_Update_price(item.id, price, parseFloat(percent_change))
                            })
                    } else {
                        this.props.Func_Update_price(item.id, 0, 0)
                    }

                    if (index == this.props.ListToken.length - 1) {
                        this.update_price_tk()
                    }
                });
            }
        }, 20000)
    }

    refreshData = () => {
        if (this.props.ListToken.length > 0) {
            this.props.ListToken.forEach((item, index) => {
                if (item.id_market !== 0) {
                    GETAPI(URI.MARKET_CAP_TICKER + item.id_market)
                        .then(res => res.json())
                        .then(res => {
                            var price = res['data']['quotes']['USD']['price'];
                            var percent_change = res['data']['quotes']['USD']['percent_change_1h'];
                            if (price > 1) {
                                price = parseFloat(price.toFixed(2))
                            } else {
                                price = parseFloat(price.toFixed(6))
                            }
                            this.props.Func_Update_price(item.id, price, parseFloat(percent_change))
                        })
                } else {
                    this.props.Func_Update_price(item.id, 0, 0)
                }

                if (index == this.props.ListToken.length - 1) {
                    this.update_price_tk()
                }
            });
        }
    }


    componentWillUnmount() {
        this.mounting = true;
        console.log(this.mounting)
    }

    render() {
        if (this.props.ListToken.length > 0) {
            if (this.props.ListToken.findIndex(x => x.network == 'addToken') == -1) {
                var TempList = Array.from(this.props.ListToken).concat({ network: 'addToken' })
            }
        }

        return (
            <Gradient
                colors={Color.Gradient_backgound_page}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ flex: 1 }}
            >
                <Header componentLeft={() => {
                    return (
                        <SwitchButton
                            // mode ez
                            inactiveButtonColor="#F2F4F4"
                            inactiveBackgroundColor={Color.Gradient_button_tomato}
                            // mode secure
                            activeButtonColor="#FFF"
                            activeBackgroundColor={['#FBFCFC', '#E9EBEC']}
                            switchHeight={25}
                            switchWidth={55}
                        />
                    )
                }}
                    componentRight={() => {
                        return (
                            <TouchableOpacity
                                onPress={this.rightIconClick}
                            >
                                <Image source={ImageApp.notification} />
                            </TouchableOpacity>
                        )
                    }}
                    Title="EZ Keystore"
                    styleTitle={{ color: Color.Tomato }}
                />

                {
                    this.props.ListToken.length > 0 &&
                    <FlatList
                        data={TempList}
                        contentContainerStyle={{ padding: 10 }}
                        renderItem={({ item, index }) => {
                            return (
                                <TokenItem
                                    InforToken={item}
                                    {...this.props}
                                />
                            )
                        }}
                        keyExtractor={(item, index) => index.toString()}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshing}
                                onRefresh={() => this.refreshData()}
                            />
                        }

                    />
                }

            </Gradient>
        );
    }
}

const mapStateToProps = state => {
    return {
        ListToken: state.Get_All_Token.ListToken
    }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ Func_Update_price }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
