import React, { Component } from 'react'
import { Text, View, TextInput, ScrollView, KeyboardAvoidingView, ViewPagerAndroid } from 'react-native'
import { Form, Item, Label, Input } from 'native-base'
export default class Homepage extends Component {
    render() {
        return (
            <ViewPagerAndroid>
                {/* <KeyboardAvoidingView> */}
                <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}>
                    <Form>
                        <Item floatingLabel>
                            <Label>Username</Label>
                            <Input />
                        </Item>
                        <Item floatingLabel>
                            <Label>Password</Label>
                            <Input />
                        </Item>
                    </Form>
                    <TextInput placeholder="Nhaapj vao day" style={{ height: 70, width: 300, borderWidth: 2 }} />
                    <Item>
                        <Input placeholder="Nhaapj vao day" style={{ width: 300, borderWidth: 2, zIndex: 10 }} />
                    </Item>
                    <InputField placeholder="adasds" />
                </View>
                {/* </KeyboardAvoidingView> */}

            </ViewPagerAndroid>
        )
    }
}

class InputField extends React.Component<Props, State> {

    static defaultProps = {
        editable: true,
    }

    constructor(props) {
        super(props);
        this.state = {
            editable: !props.editable
        };
    }

    componentDidMount() {
        if (this.props.editable) {
            setTimeout(() => {
                this.setState({ editable: true });
            }, 100);
        }
    }

    render() {
        const { editable } = this.state;
        return <TextInput {...this.props} editable={editable} />;
    }
}