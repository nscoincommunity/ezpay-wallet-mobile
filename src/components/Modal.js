import React, { Fragment, Component } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Clipboard, ToastAndroid, Platform, Linking } from "react-native";
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../helper/Reponsive';
import Icon from "react-native-vector-icons/FontAwesome";
import GLOBALS from '../helper/variables';
import CustomToast from './toast';
import Language from '../i18n/i18n';
import { exitApp } from '../services/exit/index'

class SwipeableModal extends Component {
    state = {
        visible: false,
        typeModal: '',
        Title: '',
        content: '',
        btnCopy: false,
        copied: false,
        typeOK: false
    };

    openModal(type, Title, Content, btnCopy, deeplink) {
        console.log("deeplink:", deeplink)
        if (btnCopy) {
            this.setState({ visible: true, typeModal: type, Title: Title, content: Content, btnCopy: true, typeOK: deeplink })
        } else {
            this.setState({ visible: true, typeModal: type, Title: Title, content: Content, typeOK: deeplink })
        }
    };

    closeModal = () => {
        this.setState({ visible: false });
        if (this.state.typeOK) {
            exitApp()
        }
    }

    copy = () => {
        try {
            Clipboard.setString(this.state.content);
            console.log('content', this.state.content);
            this.setState({ copied: true });
        } catch (error) {
            console.log(error)
        }
        if (Platform.OS == 'android') {
            ToastAndroid.show('Copied transaction hash', ToastAndroid.SHORT)
        } else {
            this.refs.defaultToastBottom.ShowToastFunction('Copied transaction hash');
        }
    }

    render() {
        return (
            <Fragment >
                <Modal
                    isVisible={this.state.visible}
                    backdropOpacity={0.1}
                    swipeDirection="left"
                    onSwipe={this.closeModal}
                    onBackdropPress={this.closeModal}
                >
                    <View style={styles.modalContainer}>
                        {
                            this.state.typeModal == 'success' ?
                                <Icon name="check-circle" color={GLOBALS.Color.positive} size={wp('20%')} /> :
                                <Icon name="exclamation-circle" color={GLOBALS.Color.danger} size={wp('20%')} />
                        }

                        <Text style={{ fontWeight: 'bold', fontSize: wp('7%'), fontFamily: GLOBALS.font.Poppins, textAlign: 'center' }}>{this.state.Title}</Text>

                        <Text style={styles.description}>
                            {this.state.content}
                        </Text>
                        {
                            this.state.btnCopy == true &&
                            <TouchableOpacity
                                onPress={this.copy}
                                style={{ marginVertical: GLOBALS.hp('2%') }}
                            >
                                <Text style={{ fontWeight: 'bold', fontSize: wp('5%') }}>{this.state.copied ? Language.t('Backup.GetSuccess.TitleCopied') : Language.t('Send.Copy')}</Text>
                            </TouchableOpacity>
                        }

                        <TouchableOpacity
                            onPress={this.closeModal}
                        >
                            <Text style={{ fontWeight: 'bold', fontSize: wp('5%') }}>{Language.t('Send.Ok')}</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
                <View style={{ alignItems: 'center' }}>
                    <CustomToast ref="defaultToastBottom" position="bottom" />
                </View>
            </Fragment>
        );
    }
}

export default SwipeableModal;

const styles = StyleSheet.create({
    modalContainer: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        borderRadius: 4,
        padding: wp('4%')
    },
    description: {
        padding: wp('3%'),
        fontFamily: GLOBALS.font.Poppins,
        fontSize: wp('4%'),
        textAlign: 'center'
    },
});