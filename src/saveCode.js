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