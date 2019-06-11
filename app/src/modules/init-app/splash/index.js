import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { InitData, Remove_DB, Check_Exist_Wallet } from '../../../../db';
import { CreateETH } from '../../../../services/ETH/account.service';
import { getStorage, setStorage } from '../../../../helpers/storages';
import Setting from '../../../../settings/initApp';
import ListToken from '../../../../helpers/constant/listToken';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { GetListToken } from '../../../../redux/rootActions/easyMode'

class Splash extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    componentWillMount() {
        try {
            getStorage('setting').then(set => {
                if (set) {
                    console.log(set)
                } else {
                    console.log(set)
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    componentDidMount() {
        // Remove_DB().then(console.log).catch(console.log)
        this.InitWallet()
    }

    InitWallet = () => {
        Check_Exist_Wallet()
            .then(status => {
                console.log('exist wallet', status)
                if (!status) {
                    CreateETH()
                        .then(async wallet => {
                            var ID = Math.floor(Date.now() / 1000);
                            const InitData_Object = {
                                id: ID,
                                mode: 'Easy',
                                seeds: '',
                                token: [{
                                    id: ID,
                                    name: 'Ethereum',
                                    symbol: 'ETH',
                                    network: 'ethereum',
                                    address: '',
                                    price: 0.0,
                                    percent_change: 0.0,
                                    icon: '',
                                    decimals: 18,
                                    total_balance: 0,
                                    id_market: 1027,
                                    account: [{
                                        id: ID,
                                        name: 'Account 1',
                                        token_type: 'ethereum',
                                        address: wallet.address,
                                        private_key: wallet.privateKey,
                                        balance: 0,
                                        time: new Date()
                                    }]
                                }]
                            }
                            await InitData(InitData_Object)
                                .then(() => {
                                    Setting.first_open = true;
                                    setStorage('list_token', JSON.stringify(ListToken)).then(() => {
                                        Setting.push_list_token = true;
                                        setStorage('setting', JSON.stringify(Setting)).then(() => {
                                            this.props.GetListToken()
                                            this.props.navigation.navigate('InApp')
                                        })
                                    })
                                })
                                .catch(e => console.log('ssss', e))

                        }).catch(e => console.log)
                } else {
                    this.props.GetListToken()
                    this.props.navigation.navigate('InApp')
                }
            }).catch(console.log)
    }

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                <Text> Splash </Text>
            </View >
        );
    }
}
const mapDispatchToProps = dispatch => {
    return bindActionCreators({ GetListToken }, dispatch)
}

export default connect(null, mapDispatchToProps)(Splash);
