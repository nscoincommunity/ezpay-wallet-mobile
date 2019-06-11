import React, { Component } from 'react'
import {
    Text,
    View,
    FlatList,
    TextInput,
    Image,
    TouchableOpacity,
    StyleSheet,
    Platform,
    RefreshControl,
    Keyboard,
    ActivityIndicator
} from 'react-native';
import Gradient from 'react-native-linear-gradient';
import Header from '../../../components/header';
import Color from '../../../../helpers/constant/color';
import ImageApp from '../../../../helpers/constant/image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getStorage, setStorage } from '../../../../helpers/storages';
import { Get_All_Token_Of_Wallet } from '../../../../db'
import URI from '../../../../helpers/constant/uri'
import RBSheet from '../../../../lib/bottom-sheet'
import { Create_account } from '../../../../services/index.account'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { Func_Add_Account, Func_Remove_Token } from '../../../../redux/rootActions/easyMode';
import { StackActions, NavigationActions } from 'react-navigation';


let TokenArray = [];
class ListToken extends Component {
    state = {
        list_Token: [],
        val_ipt_search: '',
        isRefreshing: false,
        loadding: false,
        Item_tranfer: {}
    }
    componentWillMount() {
        this.getListToken()
    }

    getListToken = () => {
        this.setState({ loadding: true })
        try {
            Get_All_Token_Of_Wallet().then(listExistTK => {
                getStorage('list_token').then(list => {
                    list = JSON.parse(list)
                    var tempArr = []
                    listExistTK.forEach(tk => {
                        let index = list.findIndex(x => x.symbol == tk.symbol);
                        if (index > -1) {
                            tempArr = list;
                            tempArr[index].type = true;
                            TokenArray = tempArr;
                            this.setState({ list_Token: tempArr, loadding: false })
                        }
                    })
                })
            }).catch(e => {
                console.log(e);
                this.setState({ loadding: false });
            })

        } catch (error) {
            this.setState({ loadding: false })
            console.log('sss', error)
        }
    }

    find_Token = (key_search: string) => {
        var tempArr = [];
        TokenArray.forEach((item, index) => {
            var re = new RegExp(key_search, 'i')
            var in_name = item.name.match(re);
            var in_symbol = item.symbol.match(re);
            if (in_name != null || in_symbol != null) {
                tempArr.push(item);
            }
            if (index == TokenArray.length - 1) {
                this.setState({ list_Token: tempArr })
            }
        })
        if (key_search == '') {
            this.getListToken();
        }
    }

    change_text_search = (val) => {
        this.setState({ val_ipt_search: val })
        this.find_Token(val)
    }

    clear_input_search = () => {
        this.setState({ val_ipt_search: '' });
        this.getListToken();
    }

    show_sheet_bottom = async (item) => {
        this.setState({ Item_tranfer: item })
        if (item.type == true) {
            await this.props.Func_Remove_Token(item.name, item.symbol);
            await this.clear_input_search()
        } else {
            await this.RBSheet.open()
        }
    }
    create_new_account = async () => {
        await this.props.Func_Add_Account(this.state.Item_tranfer);
        await this.RBSheet.close()
        await this.props.navigation.dispatch(StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({
                    routeName: 'Dashboard',
                }),
            ],
        }))
    }
    import_account = async () => {
        await this.RBSheet.close();
        await this.props.navigation.navigate('TypeImport', {
            payload: {
                token: this.state.Item_tranfer,
                typeAdd: 'token'
            }
        })
    }

    _renderItem = ({ index, item }) => {
        let ic_token;
        switch (item.network) {
            case 'ethereum':
                if (item.address == '') {
                    ic_token = ImageApp.ic_eth_token;
                    break;
                } else {
                    ic_token = 'ERC20'
                    break;
                }
            case 'nexty':
                if (item.address == '') {
                    ic_token = ImageApp.ic_nty_token;
                    break;
                } else {
                    ic_token = 'ERC20'
                    break;
                }
            default:
                if (item.address == '') {
                    ic_token = ImageApp.ic_trx_token;
                    break;
                } else {
                    ic_token = 'TRC20'
                    break;
                }
        }
        return (
            <TouchableOpacity
                onPress={() => { this.props.navigation.navigate('InforToken', { payload: item }) }}
            >
                <View style={[styles.styleRowItem, { backgroundColor: item.type == true ? Color.Wild_sand : '#fff' }]}>
                    <View style={styles.styleColumnAvatarItem}>
                        {
                            item.id_market == 0 ?
                                <View style={styles.styleCircleAvatar}>
                                    <Text style={{ fontSize: 10 }}>{ic_token}</Text>
                                </View>
                                :
                                <Image source={{ uri: URI.MARKET_CAP_ICON + item.id_market + '.png' }} style={{ height: 45, width: 45 }} resizeMode="contain" />
                        }
                    </View>
                    <View style={{ flex: 8, flexDirection: 'row' }}>
                        <View style={{ flex: 8, justifyContent: 'center' }}>
                            <Text style={{ color: item.type == true ? Color.Dark_gray : '#000' }}>{item.name} (<Text>{item.symbol}</Text>)</Text>
                        </View>
                        <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity
                                onPress={() => this.show_sheet_bottom(item)}
                            >
                                <Icon name={item.type == true ? 'close-circle' : 'plus-circle'} color={item.type == true ? Color.Scarlet : Color.Malachite} size={30} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableOpacity >
        )
    }

    render() {
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
                    Title='Add token'
                    styleTitle={{ color: Color.Tomato }}
                />
                <View style={styles.ViewSearch}>
                    <View style={styles.viewInputSearch}>
                        <View style={{ flex: 8, flexDirection: 'row' }}>
                            <TextInput
                                style={{
                                    flex: this.state.val_ipt_search.length > 0 ? 9 : 10,
                                    borderBottomWidth: 0,
                                    paddingVertical: Platform.OS == 'ios' ? 6 : 2
                                }}
                                placeholder="search token"
                                // autoFocus={true}
                                underlineColorAndroid="transparent"
                                onChangeText={val => this.change_text_search(val)}
                                value={this.state.val_ipt_search}
                            />
                            {
                                this.state.val_ipt_search.length > 0 &&
                                <TouchableOpacity
                                    style={{ flex: 1, justifyContent: 'center' }}
                                    onPress={() => this.clear_input_search()}
                                >
                                    <Icon name="close-circle" size={25} />
                                </TouchableOpacity>
                            }

                        </View>
                    </View>
                    <TouchableOpacity style={styles.styleButtonSearch}>
                        <Icon name="magnify" color={Color.Tomato} size={35} />
                    </TouchableOpacity>
                </View>
                <View style={styles.containerListTK}>
                    {
                        !this.state.loadding && this.state.list_Token.length > 0 ?
                            <FlatList
                                data={this.state.list_Token}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={this._renderItem}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.isRefreshing}
                                        onRefresh={() => {
                                            Keyboard.dismiss();
                                            this.clear_input_search()
                                        }}
                                    />
                                }
                            />
                            :
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                {
                                    !this.state.loadding && this.state.list_Token.length == 0 ?
                                        <Text>Token <Text style={{ fontWeight: 'bold' }}>"{this.state.val_ipt_search}"</Text> is not found</Text>
                                        :
                                        <ActivityIndicator size="large" style={{ flex: 1 }} color={Color.Tomato} />
                                }
                            </View>
                    }
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
                </View>
            </Gradient>
        )
    }
}

const styles = StyleSheet.create({
    ViewSearch: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 5
    },
    viewInputSearch: {
        flex: 8.5,
        flexDirection: 'row',
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 5,
        backgroundColor: '#fff'
    },
    styleButtonSearch: {
        flex: 1.5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    containerListTK: {
        flex: 1,
        paddingHorizontal: 10,
    },
    styleRowItem: {
        flexDirection: 'row',
        marginBottom: 5,
        paddingVertical: 10,
        borderRadius: 5
    },
    styleColumnAvatarItem: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    styleCircleAvatar: {
        height: 45,
        width: 45,
        borderRadius: 25,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }

})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ Func_Add_Account, Func_Remove_Token }, dispatch)
}

export default connect(null, mapDispatchToProps)(ListToken)
