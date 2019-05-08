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
    BackHandler,
    Animated
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import DAppBrowser from '../../../../libs/Dweb-browser'
import RNFS from 'react-native-fs';
import Gradient from 'react-native-linear-gradient';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import GLOBALS from '../../../helper/variables';
import { convertHexToString } from '../Dapp.service'

const { width, height } = Dimensions.get('window')
type Props = {};
let jsContent = ''
export default class App extends Component<Props> {
    constructor(props) {
        super(props);
        this.webProgress = new Animated.Value(0)
    }
    componentWillMount() {
        if (jsContent === '') {
            if (Platform.OS === 'ios') {
                try {
                    RNFS.readFile(`${RNFS.MainBundlePath}/EzKeyProvider.js`, 'utf8')
                        .then((content) => {
                            jsContent = content;
                            this.setState({})
                        }).catch(e => console.log(e))
                } catch (error) {
                    console.log(error)
                }

            } else {
                try {
                    RNFS.readFileAssets(`EzKeyProvider.js`, 'utf8')
                        .then((content) => {
                            jsContent = content;
                            console.log('get jscontent success')
                            this.setState({})
                        }).catch(err => {
                            console.log('aaa', err)
                        })
                } catch (error) {
                    console.log(error)
                }

            }
        }
        const { url } = this.props.navigation.getParam('payload');
        this.setState({ url: url, urlView: url })
    }

    state = {
        url: '',
        urlView: '',
        loading: false,
        cookie: ''
    }

    startProgress = (val, t, onEndAnim = () => { }) => {
        Animated.timing(this.webProgress, {
            toValue: val,
            duration: 0
        }).start()
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

    onProgress = (p) => {
        if (Platform.OS === 'android') return
        if (p === 1) {
            this.startProgress(100, 250)
            setTimeout(() => this.startProgress(0, 0), 250)
        } else {
            this.startProgress(100 * p, 250)
        }
    }

    onLoadEnd = (event) => {
        const { progress } = event.nativeEvent
        let reset = null
        if (progress === 100) {
            reset = this.resetProgress
        }
        this.startProgress(event.nativeEvent.progress, 250, reset)
    }

    executeCallback = (id, signedTx) => {
        this.refs.WEBVIEW_REF.executeCallback(id, null, signedTx)
    }

    onSignPersonalMessage = ({ id, object }) => {
        const { url, pk_en } = this.props.navigation.getParam('payload');
        this.props.navigation.navigate('SignMessageScreen', {
            id,
            object,
            url,
            pk_en,
            callBack: this.executeCallback
        })
    }
    onSignTransaction = async ({ id, object }) => {
        const { pk_en } = this.props.navigation.getParam('payload');
        const ViewObject = await convertHexToString(object)
        this.props.navigation.navigate('SignTransaction', {
            id,
            object,
            url: this.state.urlView,
            pk_en,
            callBack: this.executeCallback,
            ViewObject
        })
    }

    render() {
        const progress = this.webProgress.interpolate({
            inputRange: [0, 100],
            outputRange: [0, width]
        })
        const { address, network } = this.props.navigation.getParam('payload');
        return (
            <Gradient
                colors={['#F0F3F5', '#E8E8E8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ flex: 1 }}>
                <View style={{
                    width: width,
                    justifyContent: 'center',
                    flexDirection: 'row',
                    height: height / 11,
                    paddingTop: getStatusBarHeight(),
                    paddingBottom: 10
                }}>
                    <TouchableOpacity
                        style={{ flex: 1.5, justifyContent: 'center' }}
                        onPress={() => { this.props.navigation.goBack() }}
                    >
                        <Icon
                            name="times"
                            style={{ textAlign: 'center', color: GLOBALS.Color.primary, fontWeight: 'bold' }}
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
                        onPress={() => { this.setState({ url: 'http://45.76.156.99/' }) }}
                    >
                        <Icon
                            name="ellipsis-v"
                            style={{ textAlign: 'center', color: GLOBALS.Color.primary, fontWeight: 'bold' }}
                            size={25}
                        />
                    </TouchableOpacity>
                </View>
                <Animated.View style={[styles.progress, { width: progress }]} />
                {/* {
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
                } */}
                {
                    jsContent !== '' &&
                    <DAppBrowser
                        ref="WEBVIEW_REF"
                        uri={this.state.url}
                        addressHex={address}
                        network="rinkeby"
                        infuraAPIKey="b174a1cc2f7441eb94ed9ea18c384730"
                        jsContent={jsContent}
                        style={{ width: width }}
                        onNavigationStateChange={this._onNavigationStateChange.bind(this)}
                        onProgress={this.onProgress}
                        onLoadEnd={this.onLoadEnd}
                        onSignPersonalMessage={this.onSignPersonalMessage}
                        onSignTransaction={this.onSignTransaction}
                    />
                }
                <View
                    style={{
                        height: height / 12,
                        width: width,
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}
                >
                    <TouchableOpacity
                        onPress={() => { this.refs.WEBVIEW_REF.goBack() }}
                        style={{ flex: 1 }}
                    >
                        <Icon name="chevron-left"
                            style={{ textAlign: 'center', color: GLOBALS.Color.primary, fontWeight: 'bold' }}
                            size={25} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => { this.refs.WEBVIEW_REF.goForward() }}
                        style={{ flex: 1 }}
                    >
                        <Icon name="chevron-right"
                            style={{ textAlign: 'center', color: GLOBALS.Color.primary, fontWeight: 'bold' }}
                            size={25} />
                    </TouchableOpacity>
                    <View style={{ flex: 8 }} />
                </View>

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
    progress: {
        height: 2,
        backgroundColor: GLOBALS.Color.primary
    }
});
