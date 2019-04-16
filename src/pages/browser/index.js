import React, { Component } from 'react'
import { Text, View, WebView, StatusBar, TouchableOpacity, Linking, Modal, ActivityIndicator } from 'react-native'
import Header from '../../components/header';
import Gradient from 'react-native-linear-gradient';
import GLOBALS from '../../helper/variables';
import Icon from 'react-native-vector-icons/FontAwesome'

export default class componentName extends Component {
    state = {
        loading: true
    }

    _onNavigationStateChange(webViewState) {
        console.log(webViewState)
        if (webViewState.loading) {
            this.setState({ loading: true })
        } else {
            setTimeout(() => {
                this.setState({ loading: false })
            }, 1000);
        }
    }

    render() {
        const url = this.props.navigation.getParam('url')
        return (
            <Gradient
                colors={['#F0F3F5', '#E8E8E8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ flex: 1 }}>
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
                    title=''
                    style={{ marginTop: 23 }}
                    pressIconLeft={() => this.props.navigation.goBack()}
                    nameIconRight="globe"
                    colorIconRight="#328FFC"
                    pressIconRight={() => Linking.openURL(url)}
                />
                <View style={{ flex: 1 }}>
                    <WebView
                        source={{ uri: url }}
                        style={{ width: GLOBALS.wp('100%') }}
                        ref="WEBVIEW_REF"
                        onNavigationStateChange={this._onNavigationStateChange.bind(this)}
                    />
                    <View
                        style={{
                            height: GLOBALS.hp('7%'),
                            width: GLOBALS.WIDTH,
                            backgroundColor: '#328FFC',
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => { this.refs.WEBVIEW_REF.goBack(); console.log(this.refs.WEBVIEW_REF.goBack()) }}
                            style={{ flex: 1 }}
                        >
                            <Icon name="chevron-left"
                                style={{ textAlign: 'center', color: '#fff', fontWeight: 'bold' }}
                                size={25} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => { this.refs.WEBVIEW_REF.goForward() }}
                            style={{ flex: 1 }}
                        >
                            <Icon name="chevron-right"
                                style={{ textAlign: 'center', color: '#fff', fontWeight: 'bold' }}
                                size={25} />
                        </TouchableOpacity>
                        <View style={{ flex: 8 }} />
                    </View>
                    {
                        this.state.loading ?
                            <Modal
                                animationType='fade'
                                transparent={true}
                                visible={true}>
                                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,.2)' }}>
                                    <ActivityIndicator size='large' color="#30C7D3" style={{ flex: 1 }} />
                                </View>
                            </Modal>
                            : null
                    }
                </View>
            </Gradient>
        )
    }
}