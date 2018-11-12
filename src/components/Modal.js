import React, { Fragment, Component } from "react";
import { View, StyleSheet, Text, TouchableHighlight } from "react-native";
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../helper/Reponsive';
import Icon from "react-native-vector-icons/FontAwesome";
import GLOBALS from '../helper/variables';

class SwipeableModal extends Component {
    state = {
        visible: false,
        typeModal: '',
        Title: '',
        content: ''
    };

    openModal(type, Title, Content) {
        console.log('aaa', type, Title, Content)
        this.setState({ visible: true, typeModal: type, Title: Title, content: Content })
    };
    closeModal = () => this.setState({ visible: false });

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

                        <Text style={{ fontWeight: 'bold', fontSize: wp('7%'), fontFamily: GLOBALS.font.Poppins }}>{this.state.Title}</Text>

                        <Text style={styles.description}>
                            {this.state.content}
                        </Text>
                        <TouchableHighlight
                            onPress={this.closeModal}
                        >
                            <Text style={{ fontWeight: 'bold', fontSize: wp('5%') }}>OK</Text>
                        </TouchableHighlight>
                    </View>
                </Modal>

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
        fontSize: wp('4%')
    },
});