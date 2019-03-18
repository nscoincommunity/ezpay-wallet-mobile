import React, { Component } from 'react'
import { Text, View, ImageBackground, StatusBar, TouchableOpacity } from 'react-native'
import { SelectAllWallet } from '../../../realm/walletSchema';
import ListCoin from '../../components/listWallet';
import Header from '../../components/header';
import ComponentToken from '../../components/listToken';
import GLOBALS from '../../helper/variables';
import { connect } from 'react-redux';
import { ONSNAPWALLET } from '../../../redux/actions/slideWalletAction';
import { bindActionCreators } from 'redux';
import { fetchRate, fetchAllWallet } from '../../../redux/actions/slideWalletAction'
import SegmentControl from 'react-native-segment-controller';
import Segment from './segmentComponent'
import { Avatar } from 'react-native-elements'
class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ListWallet: [],
            index: 0
        }
    }

    componentWillMount() {
        this.props.fetchRate('nexty', 0);
        this.fetchListWallet()
        SelectAllWallet().then(ListWallet => {
            this.setState({ ListWallet })
        })
    }

    fetchListWallet = () => {
        this.props.fetchAllWallet()
    }


    render() {
        const { exchange } = this.props.snapToWallet;
        const { data } = this.props.ActionDB;
        const { DataToken, status } = this.props
        return (
            <View style={{ flex: 1, backgroundColor: '#F2F2F2' }}>
                <StatusBar
                    backgroundColor={'transparent'}
                    translucent
                    barStyle="dark-content"
                />
                <Header
                    backgroundColor="transparent"
                    colorIconLeft="#328FFC"
                    colorTitle="#328FFC"
                    nameIconLeft="align-left"
                    title={exchange}
                    style={{ marginTop: 23 }}
                    pressIconLeft={() => { this.props.navigation.openDrawer(); }}
                />
                {
                    data.length > 0 ?
                        <View style={{ flex: 1 }}>
                            <ListCoin Data={data} navigation={this.props.navigation} />
                            {
                                exchange != '' &&
                                <View style={{ paddingHorizontal: GLOBALS.wp('20%'), paddingVertical: GLOBALS.hp('3%') }}>
                                    <Segment navigation={this.props.navigation} Data={DataToken} />
                                </View>
                            }
                            {
                                exchange != '' &&
                                <View style={{
                                    flexDirection: 'row', marginVertical: GLOBALS.hp('1%'),
                                    paddingHorizontal: GLOBALS.wp('3%')
                                }}>
                                    <Text style={{
                                        color: "#328FFC",
                                        fontSize: GLOBALS.fontsize(3),
                                        flex: 8
                                    }}>Tokens</Text>
                                    <Avatar
                                        icon={{
                                            name: 'plus',
                                            type: 'font-awesome',
                                            color: '#328FFC'
                                        }}
                                        overlayContainerStyle={{
                                            backgroundColor: 'transparent',
                                            borderWidth: 1,
                                            borderColor: '#328FFC',
                                            flex: 2
                                        }}
                                        onPress={() => this.props.navigation.navigate('Addtoken', {
                                            payload: {
                                                network: this.props.snapToWallet.network,
                                            }
                                        })}
                                        rounded
                                    />
                                </View>
                            }
                            {
                                DataToken.ListToken.length > 0 &&
                                <ComponentToken InforToken={DataToken} status={status} />
                            }

                        </View>
                        : null
                }
            </View>
        )
    }
}

function mapStateToProps(state) {
    return {
        snapToWallet: state.snapToWallet,
        ActionDB: state.ActionDB,
        DataToken: state.getListToken,
        status: state.eventSnap.status,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ fetchRate, fetchAllWallet }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)