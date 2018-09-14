import React, { Component } from 'react'
import { Platform, StyleSheet, Text, View, Image, TouchableOpacity, KeyboardAvoidingView, ScrollView, SegmentedControlIOS } from 'react-native';
import { Form, Item, Input, Label } from 'native-base'
import SegmentControl from 'react-native-segment-controller';
import GLOBALS from '../../helper/variables';
import Icon from "react-native-vector-icons/FontAwesome";

class ScreenRestore extends Component {
    constructor() {
        super();

        this.state = {
            index: 0,
            content: ''
        }
        this.handlePress = this.handlePress.bind(this);
    }

    handlePress(index) {
        this.setState({ content: `Segment ${index + 1} selected !!!`, index });
    }
    render() {
        return (
            <View style={style.container}>
                <Image style={style.logo} source={require('../../images/logo-with-text.png')} resizeMode="contain" />

                <SegmentControl
                    values={['BACKUP CODE', 'PRIVATE KEY']}
                    selectedIndex={this.state.index}
                    height={30}
                    onTabPress={this.handlePress}
                    borderRadius={5}
                    activeTabStyle={{ backgroundColor: GLOBALS.Color.primary }}
                    borderRadius={9}
                />

                {this.state.index === 0 && <FormBackupcode />}
                {this.state.index === 1 && <FormPrivateKey />}

            </View>

        )
    }

}

class FormBackupcode extends Component {
    render() {
        return (
            <View>
                <Form style={style.FormLogin}>
                    <View style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        width: GLOBALS.WIDTH,
                    }}>
                        <Item floatingLabel style={{ width: GLOBALS.WIDTH / 1.3 }}>
                            <Label>Backup code/Choose file</Label>
                            <Input />
                        </Item>

                        <TouchableOpacity style={style.buttonFolder}>
                            <Icon name="folder-open" backgroundColor="#3b5998" color="rgb(170, 170, 27)" size={35}>
                            </Icon>
                        </TouchableOpacity>
                    </View>


                    <Item floatingLabel>
                        <Label>Local passcode</Label>
                        <Input secureTextEntry={true} />
                    </Item>

                    <Item floatingLabel>
                        <Label>Comfirm local passcode</Label>
                        <Input secureTextEntry={true} />
                    </Item>
                </Form>
                <View style={style.FormRouter}>
                    <TouchableOpacity style={styleButton(GLOBALS.Color.primary).button} onPress={() => { }}>
                        <Text style={style.TextButton}>Continue</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}
class FormPrivateKey extends Component {
    render() {
        return (
            <View>
                <Form style={style.FormLogin}>
                    <Item floatingLabel>
                        <Label>Private key</Label>
                        <Input />
                    </Item>

                    <Item floatingLabel>
                        <Label>Local passcode</Label>
                        <Input secureTextEntry={true} />
                    </Item>

                    <Item floatingLabel>
                        <Label>Comfirm local passcode</Label>
                        <Input secureTextEntry={true} />
                    </Item>
                </Form>
                <View style={style.FormRouter}>
                    <TouchableOpacity style={styleButton(GLOBALS.Color.primary).button} onPress={() => { }}>
                        <Text style={style.TextButton}>Continue</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

export default class restore extends Component {
    render() {
        return (
            <ScrollView >
                <KeyboardAvoidingView style={style.container} behavior="position" keyboardVerticalOffset={65} enabled>
                    <ScreenRestore></ScreenRestore>
                </KeyboardAvoidingView>
            </ScrollView>
        )
    }
}

/* style button */
var styleButton = (color) => StyleSheet.create({
    button: {
        backgroundColor: color,
        marginBottom: GLOBALS.HEIGHT / 40,
        height: GLOBALS.HEIGHT / 17,
        justifyContent: 'center',
        width: GLOBALS.WIDTH / 1.6
    }
})

const style = StyleSheet.create({
    container: {
        flex: 1,
        // marginTop: Platform.OS === 'ios' ? 25 : 0,

        alignItems: 'center',
    },
    logo: {
        height: GLOBALS.HEIGHT / 3,
        width: GLOBALS.WIDTH / 1.6,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    FormRouter: {
        alignItems: 'center',
        // paddingLeft: GLOBALS.WIDTH / 5,
        // paddingRight: GLOBALS.WIDTH / 5
    },
    TextButton: {
        color: 'white',
        textAlign: 'center',
        fontSize: 15
    },
    FormLogin: {
        width: GLOBALS.WIDTH,
        marginBottom: GLOBALS.HEIGHT / 20,
    },
    buttonFolder: {
        flexDirection: 'column',
        width: GLOBALS.WIDTH / 6,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        backgroundColor: GLOBALS.Color.primary,
        borderRadius: 5
    }
})