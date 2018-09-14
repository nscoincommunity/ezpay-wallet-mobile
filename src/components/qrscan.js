import React from 'react';
import { StyleSheet, Dimensions, View, Text, Platform } from 'react-native';
import Camera from 'react-native-camera'
import Icon from "react-native-vector-icons/FontAwesome";
import { Button } from 'native-base'

export default class CameraScreen extends React.Component<any, any> {
    // static navigationOptions = {
    //     headerLeft: ({ goBack }) =>
    //         < Text onPress={() => {
    //             console.log(goBack)
    //         }}> aaa</Text>
    //     // header: ({ state, setParams }) => ({
    //     //     left: (
    //     //         <Button
    //     //             onPress={() => {
    //     //                 if (state.params && state.params.onBackPress) {
    //     //                     state.params.onBackPress();
    //     //                 }
    //     //             }}
    //     //             title={'Back'}
    //     //         />
    //     //     )
    //     // })
    // }
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            headerLeft:
                <Button
                    style={{ paddingLeft: 10, paddingRight: 10 }}
                    transparent
                    onPress={() => {
                        navigation.goBack();
                        navigation.state.params.onSelect({ result: 'cancelScan' });
                    }} >
                    <Icon name="angle-left" color='#fff' size={30} style={{ marginTop: Platform.OS == 'android' ? Dimensions.get('window').height / 50 : 0 }}></Icon>
                    <Text
                        style={{ color: '#fff', fontSize: 15, marginTop: Platform.OS == 'android' ? Dimensions.get('window').height / 50 : 0, marginRight: Platform.OS == 'android' ? Dimensions.get('window').width / 10 : 0 }}
                    >
                        Cancel
                        </Text>
                </Button>
        };
    };

    constructor(props) {
        super(props);
        this.camera = null;
        this.barcodeCodes = 'Please scan the barcode.';
        this.state = {
            camera: {
                aspect: Camera.constants.Aspect.fill,
                captureTarget: Camera.constants.CaptureTarget.cameraRoll,
                type: Camera.constants.Type.back,
                orientation: Camera.constants.Orientation.auto,
                flashMode: Camera.constants.FlashMode.auto,
                barcodeFinderVisible: true
            }
        };
    }
    onBarCodeRead(scanResult) {
        if (scanResult.data != null) {
            this.props.navigation.goBack();
            this.props.navigation.state.params.onSelect({ result: scanResult.data });
        }
        return;
    }

    defaultStyles() {
        return {
            preview: {
                flex: 1,
                justifyContent: 'flex-end',
                alignItems: 'center'
            },
            overlay: {
                position: 'absolute',
                padding: 16,
                right: 0,
                left: 0,
                alignItems: 'center'
            },
            topOverlay: {
                top: 0,
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
            },
            scanScreenMessage: {
                fontSize: 14,
                color: 'white',
                textAlign: 'center',
                alignItems: 'center',
                justifyContent: 'center'
            },
            container: {
                flex: 1,
            },
            cameraView: {
                flex: 1,
                justifyContent: 'flex-start',
            },
            maskOutter: {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'space-around',
            },
            maskInner: {
                width: 300,
                backgroundColor: 'transparent',
                borderColor: 'red',
                borderWidth: 1,
            },
            maskFrame: {
                backgroundColor: 'rgba(1,1,1,0.6)',
            },
            maskRow: {
                width: '100%',
            },
            maskCenter: { flexDirection: 'row' },
        };
    }

    render() {
        console.log(this.props.navigation)

        const styles = this.defaultStyles();

        const { height, width } = Dimensions.get('window');
        const maskRowHeight = Math.round((height - 300) / 20);
        const maskColWidth = (width - 300) / 2;

        return (
            <View style={styles.container}>
                <Camera
                    ref={cam => {
                        this.camera = cam;
                    }}
                    style={styles.preview}
                    aspect={this.state.camera.aspect}
                    captureTarget={this.state.camera.captureTarget}
                    type={this.state.camera.type}
                    flashMode={this.state.camera.flashMode}
                    barcodeFinderVisible={this.state.camera.barcodeFinderVisible}
                    onBarCodeRead={this.onBarCodeRead.bind(this)}
                >
                    <View style={styles.maskOutter}>
                        <View style={[{ flex: maskRowHeight }, styles.maskRow, styles.maskFrame]} />
                        <View style={[{ flex: 30 }, styles.maskCenter]}>
                            <View style={[{ width: maskColWidth }, styles.maskFrame]} />
                            <View style={styles.maskInner} />
                            <View style={[{ width: maskColWidth }, styles.maskFrame]} />
                        </View>
                        <View style={[{ flex: maskRowHeight }, styles.maskRow, styles.maskFrame]} />
                    </View>
                    <View style={[styles.overlay, styles.topOverlay]}>
                        <Text style={styles.scanScreenMessage}>{this.state.barcodeCodes}</Text>
                    </View>
                </Camera>
            </View>
        );
    }
}