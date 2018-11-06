import React, { Component } from 'react'
import { View } from 'react-native';
// import Icon from "react-native-vector-icons/FontAwesome";
import GLOBALS from '../../helper/variables';
// import Icon from "react-native-vector-icons/FontAwesome";
import {
    Container,
    Header,
    Title,
    Content,
    Text,
    Button,
    Footer,
    FooterTab,
    Left,
    Right,
    Body,
    Icon,
    Tabs,
    Tab,
} from "native-base";
export default class dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab1: false,
            tab2: true,
            tab3: false,
        };
    }
    toggleTab1() {
        const { navigate } = this.props.navigation;
        navigate('Sendpage');
        this.setState({
            tab1: true,
            tab2: false,
            tab3: false,
        });
    }
    toggleTab3() {
        const { navigate } = this.props.navigation;
        navigate('Request');
        this.setState({
            tab1: false,
            tab2: false,
            tab3: true,
        });
    }
    render() {
        console.log(this.props.navigation)
        return (
            <Container style={{ backgroundColor: "#fff" }}>
                <Header style={{ backgroundColor: GLOBALS.Color.primary }}>
                    <Left>
                        <Button
                            transparent
                            onPress={() => this.props.navigation.openDrawer()}
                        >
                            <Icon type="FontAwesome" name="bars" style={{ color: '#fff' }} />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={{ color: '#fff' }}>Header</Title>
                    </Body>
                    <Right />
                </Header>

                <Content padder>
                    <Text>tab dashboard</Text>
                </Content>

                <Footer>
                    <FooterTab>
                        <Button active={this.state.tab1} onPress={() => this.toggleTab1()}>
                            <Icon active={this.state.tab1} type="FontAwesome" name="arrow-up" />
                            <Text>SEND</Text>
                        </Button>

                        <Button active={this.state.tab2}>
                            <Icon active={this.state.tab2} type="FontAwesome" name="home" />
                            <Text>DASHBOARD</Text>
                        </Button>

                        <Button active={this.state.tab3} onPress={() => this.toggleTab3()}>
                            <Icon active={this.state.tab3} type="FontAwesome" name="arrow-down" />
                            <Text>REQUEST</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        )
    }
}
{/* {
                        this.state.transactions &&
                        <List
                            dataArray={this.state.transactions}
                            renderFooter={() => { return (<Spinner color={GLOBALS.Color.primary} />) }}
                            renderRow={data =>
                                < ListItem
                                    button
                                    noBorder
                                    onPress={() => this.props.navigation.navigate("DetailsHis", { data: data })
                                    }
                                >
                                    <Left>
                                        <Icon
                                            active
                                            name={data.type}
                                            style={{ color: data.type == "arrow-down" ? "green" : 'red', fontSize: 26, width: 30, marginRight: 10 }}
                                        />
                                        // <Text style={{ fontWeight: 'bold', marginRight: 10, color: data.type == "arrow-down" ? "green" : 'red', }}>
                                        //   {data.quantity}
                                        //</Text>
                                        <Text style={{ fontFamily: GLOBALS.font.Poppins }}>
                                            {data.datetime}
                                        </Text>
                                    </Left>
                                    <Right>
                                        <Icon name="angle-right"
                                            style={{ fontSize: 26 }}
                                        />
                                    </Right>
                                </ListItem>}
                        />
                    } */}

<View style={style.container}>
    <ScrollView>
        <KeyboardAvoidingView style={style.container} behavior="position" keyboardVerticalOffset={65} enabled>

            <View style={{ width: GLOBALS.WIDTH, paddingLeft: GLOBALS.WIDTH / 25, paddingRight: GLOBALS.WIDTH / 25 }}>

                {
                    this.state.ListToken &&
                    <Dropdown
                        onChangeText={(item) => this.selectToken(item)}
                        label={Language.t('Send.SendForm.SelectToken')}
                        data={this.state.ListToken}
                        value={'NTY'}
                    />
                }
            </View>

            <Form style={style.FormSend}>
                <View style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    width: GLOBALS.WIDTH,
                }}>
                    <Item floatingLabel style={{ width: GLOBALS.WIDTH / 1.4 }} error={this.state.errorAddress} >
                        <Label>{Language.t('Send.SendForm.To')}</Label>
                        <Input
                            value={this.state.addresswallet}
                            onChangeText={(val) => this.CheckAddress(val)}
                            returnKeyType={"next"}
                            blurOnSubmit={false}
                            onSubmitEditing={() => { this.focusTheField('field2'); }}
                        />
                    </Item>

                    <Item style={{ borderBottomWidth: 0 }}>
                        <TouchableOpacity style={style.buttonScan} onPress={this.navigateToScan.bind(this)}>
                            <Icon name="md-qr-scanner" size={30} color="#fff">
                            </Icon>
                        </TouchableOpacity>
                    </Item>
                    <Item style={{ borderBottomWidth: 0 }}>
                        <Text style={{ color: GLOBALS.Color.danger }}>{this.state.TextErrorAddress}</Text>
                    </Item>
                </View>
                <View style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    width: GLOBALS.WIDTH,
                }}>
                    <Item floatingLabel style={style.ColumItem} error={this.state.errorNTY}>
                        <Label>{this.state.viewSymbol}</Label>
                        <Input
                            keyboardType="numeric"
                            onChangeText={(val) => this.CheckNTY(val)}
                            value={this.state.NTY}
                            getRef={input => { this.inputs['field2'] = input }}
                        />
                    </Item>
                    <Icon name="md-swap" size={20} style={{ marginTop: 40 }}></Icon>
                    <Item floatingLabel style={style.ColumItem} error={this.state.errorNTY}>
                        <Label>USD</Label>
                        <Input
                            keyboardType="numeric"
                            onChangeText={(val) => this.CheckUSD(val)}
                            value={this.state.USD} />
                    </Item>
                    <Item style={{ borderBottomWidth: 0 }}>
                        <Text style={{ color: GLOBALS.Color.danger }}>{this.state.TextErrorNTY}</Text>
                    </Item>
                </View>
                <TouchableOpacity style={styleButton(GLOBALS.Color.secondary, this.state.VisibaleButton).button} disabled={this.state.VisibaleButton} onPress={() => this.setState({ dialogSend: true })}>
                    <Text style={style.TextButton}>{Language.t('Send.SendForm.TitleButton')}</Text>
                </TouchableOpacity>
            </Form>

            <Dialog.Container visible={this.state.dialogSend} >
                <Dialog.Title>{Language.t('Send.ConfirmSend.Title')}</Dialog.Title>
                <Dialog.Description>
                    {Language.t('Send.ConfirmSend.Content')}
                </Dialog.Description>
                <Dialog.Input placeholder={Language.t('Send.ConfirmSend.Placeholder')} onChangeText={(val) => this.setState({ Password: val })} secureTextEntry={true} autoFocus={true}></Dialog.Input>
                <Dialog.Button label={Language.t('Send.ConfirmSend.TitleButtonCancel')} onPress={this.handleCancel.bind(this)} />
                <Dialog.Button label={Language.t('Send.SendForm.TitleButton')} onPress={this.doSend.bind(this)} />
            </Dialog.Container>
        </KeyboardAvoidingView>
    </ScrollView>

    <PopupDialog
        dialogStyle={{ width: GLOBALS.WIDTH / 1.2, height: GLOBALS.HEIGHT / 4 }}
        ref={(popupDialog) => {
            this.scaleAnimationDialog = popupDialog;
        }}
        dialogAnimation={scaleAnimation}
        dialogTitle={<DialogTitle title={this.state.titleDialog} />}
        actions={[
            <DialogButton
                text={Language.t('Send.Ok')}
                onPress={() => {
                    this.scaleAnimationDialog.dismiss();
                }}
                key="button-1"
            />,
        ]}
    >
        <View style={style.dialogContentView}>
            <Text style={{ textAlign: 'center', marginTop: 10 }}>{this.state.contentDialog}</Text>
        </View>
    </PopupDialog>
</View >