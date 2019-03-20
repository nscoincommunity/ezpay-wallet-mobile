import React, { Component } from 'react'
import {
    Text,
    View,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    Alert,
    TouchableOpacity,
    Platform,
    StatusBar
} from 'react-native'
import Language from '../../i18n/i18n';
import GLOBALS from '../../helper/variables';
import Swipeout, { SwipeoutButtonProperties } from 'react-native-swipeout';
import IconMtr from 'react-native-vector-icons/MaterialIcons'
import { GetTokenOfNetwork, DeleteToken } from '../../../realm/walletSchema'
import Header from '../../components/header';

export default class ListToken extends Component {
    // static navigationOptions = () => ({
    //     title: Language.t('Token.Title'),
    //     headerStyle: {
    //         backgroundColor: '#fafafa',
    //         borderBottomWidth: 0,
    //         elevation: 0
    //     },
    //     headerTitleStyle: {
    //         color: '#0C449A',
    //     },
    //     headerBackTitleStyle: {
    //         color: '#0C449A'
    //     },
    //     headerTintColor: '#0C449A',
    //     swipeEnabled: false,
    // });
    mounted: boolean = true;

    network: string = "Nexty";
    constructor(props) {
        super(props);
        this.state = {
            ArrayToken: []
        }
    }

    componentWillMount() {
        if (this.mounted) {
            this.LoadData(this.props.navigation.getParam('payload').network)
        }
    }
    componentWillUnmount() {
        this.mounted = false;
    }

    LoadData = (network) => {
        // GetAllToken().then(data => {
        //     console.log('list', data)
        //     this.setState({ ArrayToken: data })
        // })
        GetTokenOfNetwork(network).then(list => {
            console.log('ssss', list)
            this.setState({ ArrayToken: list })
        })
    }

    deleteNote = (rowData) => {
        Alert.alert(
            Language.t('Token.AlertDelete.Title'),
            Language.t('Token.AlertDelete.Content'),
            [
                { text: Language.t('Token.AlertDelete.ButtonAgree'), onPress: () => { this.Delete(rowData['id']) } },
                { text: Language.t('Token.AlertDelete.ButtonCancel'), style: 'cancel' }
            ]
        )
    }

    Delete = (id) => {
        DeleteToken(id).then(ss => {
            this.LoadData(this.props.navigation.getParam('payload').network)
        }).catch(e => console.log(e))
    }

    render() {

        return (
            <View style={styles.container}>
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
                    title={Language.t('Token.Title')}
                    style={{ marginTop: 23 }}
                    pressIconLeft={() => this.props.navigation.goBack()}
                />
                {
                    this.state.ArrayToken.length > 0 ?

                        <FlatList
                            style={{ padding: GLOBALS.hp('2%') }}
                            data={this.state.ArrayToken}
                            extraData={this.state}
                            renderItem={({ item }) => {
                                if (item['name'] == "NTF") {
                                    item.disable = true
                                } else {
                                    item.disable = false
                                }
                                return (
                                    <View style={styles.Item}>
                                        <Text style={{ flex: 3, fontFamily: GLOBALS.font.Poppins, fontWeight: 'bold' }}>{item["name"]}</Text>
                                        <Text
                                            style={{ flex: 6, paddingHorizontal: GLOBALS.wp('1%'), fontFamily: GLOBALS.font.Poppins }}
                                            ellipsizeMode="tail"
                                            numberOfLines={1}
                                        >{item["balance"].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                                        {
                                            !item['disable'] ?
                                                <TouchableOpacity
                                                    style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                                                    onPress={() => this.deleteNote(item)}
                                                >
                                                    <IconMtr name="highlight-off" color={GLOBALS.Color.danger} size={GLOBALS.wp('6%')} />
                                                </TouchableOpacity>
                                                : <View style={{ flex: 1 }} />
                                        }

                                    </View>
                                )
                            }}
                            keyExtractor={(item, index) => index.toString()}
                        />
                        :
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <ActivityIndicator size='large' color={GLOBALS.Color.primary} style={{ flex: 1 }} />
                        </View>
                }

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
    },
    MainForm: {
        flex: 1,
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: {
            width: -1,
            height: 3,
        },
        shadowOpacity: 0.24,
        shadowRadius: 2.27,
        elevation: 2,
        borderRadius: 5,
        padding: GLOBALS.hp('2.5%'),
    },
    Item: {
        borderLeftWidth: Platform.OS == 'ios' ? 0 : 0.2,
        borderRightWidth: Platform.OS == 'ios' ? 0 : 0.2,
        borderColor: '#c1bfbf',
        flexDirection: 'row',
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.24,
        shadowRadius: 2.27,
        elevation: 2,
        borderRadius: 5,
        padding: GLOBALS.hp('2.5%'),
        marginVertical: GLOBALS.hp('1%'),
    }
})