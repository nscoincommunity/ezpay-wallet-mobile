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
import DAppBrowser from '../../../../libs/Dweb-browser'
import RNFS from 'react-native-fs';
import Gradient from 'react-native-linear-gradient';
import GLOBALS from '../../../helper/variables';
import { convertHexToString } from '../Dapp.service'
import HeaderBrowser from './headerBrowser'
import FooterBrowser from './footerBrowser'

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

    setRef = (ref) => {
        this.refwebview = ref
    }

    state = {
        url: '',
        urlView: '',
        loading: false,
        cookie: '',
    }

    _onchangeUrl = (val) => {
        this.setState({ urlView: val })
    }

    startProgress = (val, t, onEndAnim = () => { }) => {
        Animated.timing(this.webProgress, {
            toValue: val,
            duration: 0
        }).start(onEndAnim)
    }

    _onNavigationStateChange(webViewState) {
        if (webViewState.loading) {
            this.setState({ loading: true })
        } else {
            this.setState({ urlView: webViewState.url, loading: false })
        }
    }

    opentURL = () => {
        let tempUrl
        if (!this.state.urlView.startsWith("www.") && !this.state.urlView.startsWith("https://")) {
            tempUrl = "www." + this.state.urlView;
            this.setState({ url: tempUrl })
        }
        if (!this.state.urlView.startsWith("https://")) {
            tempUrl = "https://" + this.state.urlView;
            this.setState({ url: tempUrl })
        }
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
        this.startProgress(progress, 250, reset)
    }

    resetProgress = () => {
        setTimeout(() => {
            Animated.timing(this.webProgress, {
                toValue: 0,
                duration: 0
            }).start()
        }, 100);
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

    goBack = () => {
        this.refs.WEBVIEW_REF.goBack()
    }
    goForward = () => {
        this.refs.WEBVIEW_REF.goForward()
    }
    reFresh = () => {
        this.refs.WEBVIEW_REF.reload()
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
                <HeaderBrowser {...this.props} onchangeUrl={this._onchangeUrl} opentURL={this.opentURL} valueInput={this.state.urlView} />
                <Animated.View style={[styles.progress, { width: progress }]} />
                {
                    jsContent !== '' ?
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
                        :
                        <View style={{ flex: 1 }} />
                }
                <FooterBrowser
                    goBack={this.goBack}
                    goForward={this.goForward}
                    reFresh={this.reFresh}
                />

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
