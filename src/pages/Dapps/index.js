import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Dimensions,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    Modal,
    ActivityIndicator,
    BackHandler
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import DAppBrowser from '../../../libs/Dweb-browser';
import RNFS from 'react-native-fs';
import Gradient from 'react-native-linear-gradient';


const { width, height } = Dimensions.get('window')
type Props = {};
let jsContent = ''
export default class App extends Component<Props> {

    componentWillMount() {
        if (jsContent === '') {
            if (Platform.OS === 'ios') {
                RNFS.readFile(`${RNFS.MainBundlePath}/EzKeyProvider.js`, 'utf8')
                    .then((content) => {
                        jsContent = content;
                        this.setState({})
                    })
            } else {
                RNFS.readFileAssets(`EzKeyProvider.js`, 'utf8')
                    .then((content) => {
                        jsContent = content;
                        console.log('get jscontent success')
                        this.setState({})
                    }).catch(err => {
                        console.log('aaa', err)
                    })
            }
        }
    }


    state = {
        url: 'https://web3.kyber.network',
        urlView: 'https://web3.kyber.network',
        loading: false,
        cookie: ''
    }
    _onNavigationStateChange(webViewState) {
        if (webViewState.loading) {
            this.setState({ loading: true })
        } else {
            this.setState({ urlView: webViewState.url, loading: false })
        }
    }

    opentURL = (url) => {
        if (!url.startsWith("www.") && !url.startsWith("https://")) {
            url = "www." + url;
            this.setState({ url: url })
        }
        if (!url.startsWith("https://")) {
            url = "https://" + url;
            this.setState({ url: url })
        }
    }

    onMessage = (data) => {
        //Prints out data that was passed.
        console.log(data);
    }

    _onMessage(payload) {
        if (typeof payload === 'string') return
        const {
            onSignTransaction,
            onSignMessage = () => { },
            onSignPersonalMessage,
            onSignTypedMessage = () => { },
            onHistoryStateChange
        } = this.props

        console.log('payload')
        switch (payload.data.name) {
            case 'signTransaction': {
                onSignTransaction({ id: payload.data.id, object: payload.data.object })
                break
            }
            case 'signMessage': {
                onSignMessage({ id: payload.data.id, object: payload.data.object })
                break
            }
            case 'signPersonalMessage': {
                onSignPersonalMessage({ id: payload.data.id, object: payload.data.object })
                break
            }
            case 'signTypedMessage': {
                onSignTypedMessage({ id: payload.data.id, object: payload.data.object })
                break
            }
            case 'history-state-changed': {
                onHistoryStateChange({ navState: payload.data.navState })
                break
            }
            default: break
        }
    }



    render() {
        const patchPostMessageFunction = function () {
            var originalPostMessage = window.postMessage;

            var patchedPostMessage = function (message, targetOrigin, transfer) {
                originalPostMessage(message, targetOrigin, transfer);
            };

            patchedPostMessage.toString = function () {
                return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
            };

            window.postMessage = patchedPostMessage;
        };

        const patchPostMessageJsCode = '(' + String(patchPostMessageFunction) + ')();';
        const { address, network, infuraAPIKey } = this.props.navigation.getParam('payload');

        return (
            <Gradient
                colors={['#F0F3F5', '#E8E8E8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ flex: 1 }}>
                <View style={{
                    backgroundColor: '#095b87',
                    width: width,
                    justifyContent: 'center',
                    flexDirection: 'row',
                    height: height / 11,
                    paddingVertical: 8
                }}>
                    <TouchableOpacity
                        style={{ flex: 1.5, justifyContent: 'center' }}
                        onPress={() => { this.setState({ url: 'https://web3.kyber.network' }) }}
                    >
                        <Icon
                            name="home"
                            style={{ textAlign: 'center', color: '#fff', fontWeight: 'bold' }}
                            size={25}
                        />
                    </TouchableOpacity>
                    <TextInput
                        style={{
                            flex: 7.5,
                            backgroundColor: '#fff',
                            borderRadius: 4,
                            paddingHorizontal: 3,
                            paddingVertical: 0
                        }}
                        onChangeText={(val) => this.setState({ urlView: val })}
                        value={this.state.urlView}
                        underlineColorAndroid="transparent"
                        returnKeyType={"go"}
                        onSubmitEditing={() => {
                            this.opentURL(this.state.urlView)
                        }}
                    />
                    <TouchableOpacity
                        style={{ flex: 1, justifyContent: 'center' }}
                        onPress={() => { this.setState({ url: 'https://google.com' }) }}
                    >
                        <Icon
                            name="ellipsis-v"
                            style={{ textAlign: 'center', color: '#fff', fontWeight: 'bold' }}
                            size={25}
                        />
                    </TouchableOpacity>
                </View>
                {
                    jsContent !== '' &&
                    <DAppBrowser
                        ref="WEBVIEW_REF"
                        uri={this.state.url}
                        addressHex="0x98f788606c518bf8def8cc1c331b8b21b7a78a5a"
                        network="mainnet"
                        infuraAPIKey="llyrtzQ3YhkdESt2Fzrk"
                        jsContent={jsContent}
                        style={{ width: width }}
                        onNavigationStateChange={this._onNavigationStateChange.bind(this)}
                    />
                }
                <View
                    style={{
                        height: height / 12,
                        width: width,
                        backgroundColor: '#095b87',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}
                >
                    <TouchableOpacity
                        onPress={() => { this.refs.WEBVIEW_REF.goBack() }}
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
            </Gradient >
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
