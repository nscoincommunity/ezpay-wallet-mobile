import React, { Component } from 'react';
import {
    Text,
    View,
    Platform,
    TouchableHighlight,
    TouchableOpacity,
    ScrollView,
    Image,
    RefreshControl
} from 'react-native';
import Gradient from 'react-native-linear-gradient';
import Header from '../../../components/header';
import Color from '../../../../helpers/constant/color';
import ImageApp from '../../../../helpers/constant/image';
import Icon from 'react-native-vector-icons/Ionicons'
import Item from './item'
import RBSheet from '../../../../lib/bottom-sheet'
import { get_Token } from '../../../../db';
import { Create_account_of_token } from './actions'
import { Update_balance } from '../../../../services/index.account'
import realm, { update_Balance_db, update_total_balance } from '../../../../db'



export default class Token extends Component {
    mounted = true
    state = {
        Token: {},
        isRefreshing: false,
    }
    componentWillMount() {
        this.loadData();
        this.props.navigation.getParam('payload').changeMount()
    }

    loadData = () => {
        const { id } = this.props.navigation.getParam('payload');
        get_Token(id).then(tk => {
            this.setState({ Token: tk })
        }).catch(console.log)
    }

    create_new_account = () => {
        const { id, network } = this.props.navigation.getParam('payload');
        Create_account_of_token(id, network).then(ss => {
            if (ss) {
                this.RBSheet.close()
                this.loadData()
            }
        }).catch(e => console.log(e))
    }

    componentDidMount() {
        if (this.mounted == true) {
            this.updateBalance()
        }
        // realm.addListener('change', (change) => {
        //     console.log('realm update', change)
        // })
    }
    componentWillUnmount() {
        this.mounted = false;
        clearTimeout(this.timeoutUpdate)
    }

    refreshData = () => {
        if (this.state.Token && this.state.Token.account.length > 0) {
            let total_balance = 0;
            this.state.Token.account.forEach((item, index) => {
                Update_balance(this.state.Token.address,
                    item.address,
                    this.state.Token.network,
                    this.state.Token.decimals)
                    .then(bal => {
                        total_balance += parseFloat(bal);
                        update_Balance_db(item.id, parseFloat(bal)).then(() => {
                            update_total_balance(this.state.Token.id, total_balance);
                            this.loadData()
                        })
                    }).catch(e => console.log(e))
                if (index == this.state.Token.account.length - 1) {
                    this.updateBalance()
                }
            });
        }
    }

    updateBalance = () => {
        this.timeoutUpdate = setTimeout(() => {
            if (this.state.Token && this.state.Token.account.length > 0) {
                let total_balance = 0;
                this.state.Token.account.forEach((item, index) => {
                    Update_balance(this.state.Token.address,
                        item.address,
                        this.state.Token.network,
                        this.state.Token.decimals)
                        .then(bal => {
                            total_balance += parseFloat(bal);
                            update_Balance_db(item.id, parseFloat(bal)).then(() => {
                                update_total_balance(this.state.Token.id, total_balance);
                                this.loadData()
                            })
                        }).catch(e => console.log(e))
                    if (index == this.state.Token.account.length - 1) {
                        this.updateBalance()
                    }
                });
            }
        }, 5000);
    }

    import_account = async () => {
        const { id } = this.props.navigation.getParam('payload');
        await this.RBSheet.close();
        get_Token(id).then(tk => {
            this.props.navigation.navigate('TypeImport', {
                payload: {
                    token: tk,
                    typeAdd: 'account',
                    loadData: this.loadData
                }
            })
        }).catch(console.log)
    }
    render() {
        const { name, network, address } = this.props.navigation.getParam('payload');
        return (
            <Gradient
                colors={Color.Gradient_backgound_page}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ flex: 1 }}
            >
                <Header
                    IconLeft="arrow-back"
                    onPressLeft={() => {
                        this.props.navigation.goBack();
                        this.props.navigation.getParam('payload').changeMount()
                    }}
                    Title={address === '' ? network : name}
                    styleTitle={{ color: Color.Tomato }}
                />
                <View style={{ flex: 1, padding: 10 }}>
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshing}
                                onRefresh={() => this.refreshData()}
                            />
                        }
                    >
                        {
                            this.state.Token.account !== undefined && this.state.Token.account.length > 0 &&
                            <Item data={this.state.Token} {...this.props} />
                        }
                        <TouchableOpacity
                            onPress={() => this.RBSheet.open()}
                        >
                            <Text style={{
                                fontSize: 50,
                                fontWeight: 'bold',
                                textAlign: 'center',
                                color: Color.Tomato
                            }}>+</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
                <RBSheet
                    ref={ref => {
                        this.RBSheet = ref;
                    }}
                    closeOnDragDown={true}
                    height={150}
                    duration={250}
                    customStyles={{
                        container: {
                            justifyContent: "center",
                            alignItems: "center",
                            borderTopLeftRadius: 5,
                            borderTopRightRadius: 5,
                        }
                    }}
                >
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity
                            style={{
                                flex: 5,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                            onPress={() => this.create_new_account()}
                        >
                            <Image source={ImageApp.ic_add_new_wallet} style={{ height: 100, width: 100 }} resizeMode="center" />
                            <Text>New</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                flex: 5,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                            onPress={() => this.import_account()}
                        >
                            <Image source={ImageApp.ic_import_wallet} style={{ height: 100, width: 100 }} resizeMode="center" />
                            <Text>Import</Text>
                        </TouchableOpacity>
                    </View>
                </RBSheet>
            </Gradient>
        )
    }
}
