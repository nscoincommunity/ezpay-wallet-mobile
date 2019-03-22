import React, { Component } from 'react'
import { Text, View, FlatList, TouchableOpacity, StyleSheet, StatusBar } from 'react-native'
import { Radio, ListItem, Left, Right } from 'native-base';
import { setData, getData } from '../../services/data.service'
import Language, { ListLanguage, selectLang } from '../../i18n/i18n'
import { NavigationActions, StackActions } from 'react-navigation'
import GLOBALS from '../../helper/variables';
import { connect } from 'react-redux'
import { ChangeLanguage } from '../../../redux/actions/slideWalletAction'
import Header from '../../components/header';
import Gradient from 'react-native-linear-gradient';

class language extends Component {

    constructor(props) {
        super(props)
        this.state = {
            selected: ''
        };
    };

    componentDidMount() {
        getData('languages')
            .then(language => {
                this.setState({ selected: language })
            })
    }

    componentWillUnmount() {
        if (this.state.selected != '') {
            this.props.navigation.state.params.changeLang(this.state.selected)
        }
    }

    selectLanguage(lang) {
        this.setState({ selected: lang })
        setData('languages', lang);
        selectLang();
        this.props.dispatch(ChangeLanguage(lang))
    }

    render() {
        Language.locale = this.props.language;
        return (
            <Gradient
                colors={['#F0F3F5', '#E8E8E8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ flex: 1 }}
            >
                <StatusBar
                    backgroundColor={'transparent'}
                    translucent
                    barStyle="dark-content"
                />
                <Header
                    backgroundColor="transparent"
                    colorIconLeft="#328FFC"
                    colorTitle="#328FFC"
                    nameIconLeft="arrow-left"
                    title={Language.t('Settings.Languages')}
                    style={{ marginTop: 23 }}
                    pressIconLeft={() => this.props.navigation.goBack()}
                />
                <View style={styles.container}>
                    <View style={styles.MainForm}>
                        {
                            this.state.selected != '' &&
                            <FlatList
                                data={ListLanguage}
                                keyExtractor={(item) => item.type}
                                extraData={this.state}
                                renderItem={data => {
                                    return (
                                        <ListItem
                                            noPadding
                                            noMargin
                                            style={{ marginLeft: 0, paddingHorizontal: GLOBALS.wp('2%') }}
                                            button
                                            onPress={() => this.selectLanguage(data.item.type)}
                                        >

                                            <Left>
                                                <Text>{data.item.View}</Text>
                                            </Left>
                                            <Right>
                                                <Radio
                                                    selected={this.state.selected == data.item.type ? true : false}
                                                    onPress={() => this.selectLanguage(data.item.type)}
                                                />
                                            </Right>
                                        </ListItem>
                                    )
                                }

                                }
                            />}
                    </View>
                </View>
            </Gradient>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: GLOBALS.hp('2%'),
    },
    MainForm: {
        flex: 1,
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: {
            width: -1,
            height: 3,
        },
        shadowOpacity: 0.24,
        shadowRadius: 2.27,
        elevation: 2,
        borderRadius: 5,
        padding: GLOBALS.wp('2%'),
    },
})
const mapStateToProps = state => {
    return {
        language: state.Language.language
    }
}
export default connect(mapStateToProps, null)(language)