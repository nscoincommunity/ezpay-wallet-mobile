import React, { Component } from 'react'
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import GLOBALS from '../../helper/variables';
import { Platform } from 'react-native'
// import Icon from "react-native-vector-icons/FontAwesome";
import {
    Container,
    Header,
    Title,
    Content,
    Button,
    Left,
    Right,
    Body,

} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import CustomToast from '../../components/toast';
import Language from '../../i18n/i18n';



export default class Setting extends Component {
    Default_Toast_Bottom = () => {

        this.refs.defaultToastBottom.ShowToastFunction(Language.t('Settings.Toast'));

    }



    pushToPage(Status: boolean, Router) {
        if (Status == true) {
            this.props.navigation.navigate(Router)
        }
        else {
            this.Default_Toast_Bottom()
            // try {
            //     Toast.show({
            //         text: "This feature is coming soon",
            //         position: "bottom"
            //     })
            // } catch (error) {
            //     console.log(error)
            // }

        }
    }
    render() {
        const datas = [
            {
                route: "Backup",
                text: Language.t('Settings.Backup'),
                status: true
            },
            {
                route: 'Language',
                text: Language.t('Settings.Languages'),
                status: true
            },
            {
                route: "ChangePIN",
                text: Language.t('Settings.ChangePIN'),
                status: false
            },
            {
                route: "TouchID",
                text: Language.t('Settings.TouchID'),
                status: false
            }
        ];
        return (
            <Container style={{ backgroundColor: "#fafafa" }}>
                <Header style={{ backgroundColor: '#fafafa', borderBottomWidth: 0 }}>
                    <Left>
                        <Button
                            transparent
                            onPress={() => {
                                this.props.navigation.openDrawer();
                            }}
                        >
                            <Icon type="FontAwesome" name="align-left" style={{ color: GLOBALS.Color.primary, fontSize: 25 }} />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={{ color: GLOBALS.Color.primary }}>{Language.t('Settings.Title')}</Title>
                    </Body>
                    <Right />
                </Header>

                <View style={styles.container}>
                    <FlatList
                        style={{ padding: GLOBALS.hp('2%') }}
                        data={datas}
                        extraData={this.state}
                        renderItem={({ item }) => {
                            return (
                                <TouchableOpacity
                                    onPress={() => this.pushToPage(item.status, item.route)}
                                    style={styles.row}>
                                    <Text style={{
                                        flex: 9,
                                        fontFamily: GLOBALS.font.Poppins,
                                        fontSize: GLOBALS.wp('4%')
                                    }}>{item.text}</Text>
                                    <Icon
                                        name="angle-right"
                                        style={{ flex: 1, textAlign: 'right' }}
                                        size={GLOBALS.wp('6%')}
                                        color="#AAA"
                                    />
                                </TouchableOpacity>
                            )
                        }}
                        keyExtractor={(item) => item.text}
                    />
                    <View
                        style={{
                            position: 'absolute',
                            bottom: GLOBALS.hp('10%'),
                            width: GLOBALS.wp('100%'),
                            elevation: 999,
                            alignItems: 'center',
                            backgroundColor: 'red'
                        }}
                    >
                        <CustomToast ref="defaultToastBottom" position="bottom" />
                    </View>
                </View>
            </Container >
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    row: {
        borderLeftWidth: Platform.OS == 'ios' ? 0 : 0.2,
        borderRightWidth: Platform.OS == 'ios' ? 0 : 0.2,
        borderColor: '#c1bfbf',
        paddingVertical: GLOBALS.hp('3%'),
        paddingHorizontal: GLOBALS.hp('4%'),
        backgroundColor: '#fff',
        flexDirection: 'row',
        // flexWrap: 'wrap',
        marginVertical: GLOBALS.hp('1%'),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.14,
        shadowRadius: 2.27,
        elevation: 2,
        borderRadius: 10,
    }
})