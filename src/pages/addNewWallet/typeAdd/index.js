import React, { Component } from 'react'
import { Text, View, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native'
import Header from '../../../components/header';
import GLOBAL from '../../../helper/variables';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import { fetchAllWallet } from '../../../../redux/actions/slideWalletAction'
import Gradient from 'react-native-linear-gradient';
import { Avatar } from 'react-native-elements'

const arrayType = [
    {
        title: 'Create',
        description: 'Create a new wallet.',
        type: 1,
        highlight: true,
        icon: require('../../../images/AddWallet/typeadd/create.png')
    },
    {
        title: 'Change network',
        description: 'Select exist wallet but change network.',
        type: 2,
        highlight: false,
        icon: require('../../../images/AddWallet/typeadd/exchange.png')
    },
    {
        title: 'Import',
        description: 'Import wallet form restore code, private key...',
        type: 3,
        highlight: false,
        icon: require('../../../images/AddWallet/typeadd/import.png')
    },
]
class TypeAddWallet extends Component {
    toScreen(type) {
        const { navigate } = this.props.navigation
        switch (type) {
            case 1:
                navigate('SelectNetwork', {
                    payload: {
                        type: 'New'
                    }
                })
                break;
            case 2:
                this.props.fetchAllWallet()
                navigate('NameWallet', {
                    payload: {
                        type: 'changeNetwork'
                    }
                })
                break
            default:
                navigate('Import')
                break;
        }
    }


    render() {
        return (
            <Gradient
                colors={['#F0F3F5', '#E8E8E8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.container}>
                <Header
                    backgroundColor="transparent"
                    colorIconLeft="#328FFC"
                    colorTitle="#328FFC"
                    nameIconLeft="arrow-left"
                    title="Add new wallet"
                    style={{ marginTop: 23 }}
                    pressIconLeft={() => this.props.navigation.goBack()}
                />

                <FlatList
                    data={arrayType}
                    keyExtractor={(item, index) => index.toString()}
                    style={{ padding: GLOBAL.wp('2%') }}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity
                                style={styleBtn(item.highlight).buttonType}
                                onPress={() => this.toScreen(item.type)}
                            >
                                <View style={{ flex: 6 }}>
                                    <Text style={{
                                        color: '#535353',
                                        fontSize: GLOBAL.fontsize(4)
                                    }}>{item.title}</Text>
                                    <Text
                                        style={{
                                            color: '#979797',
                                            fontSize: GLOBAL.fontsize(2)
                                        }}
                                    >{item.description}</Text>
                                </View>
                                <Image
                                    source={item.icon}
                                />
                            </TouchableOpacity>
                        )
                    }}
                />
            </Gradient>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#1B2049'
    }
})
const styleBtn = (type) => StyleSheet.create({
    buttonType: {
        padding: GLOBAL.wp('3%'),
        marginVertical: GLOBAL.hp('1%'),
        backgroundColor: type ? '#F0F3F5' : '#F8F9F9',
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.27,
        elevation: 3,
        flexDirection: 'row',
        paddingVertical: GLOBAL.wp('7%'),
    }
})

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ fetchAllWallet }, dispatch)
}

export default connect(null, mapDispatchToProps)(TypeAddWallet)