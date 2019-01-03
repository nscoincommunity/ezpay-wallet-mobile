import React, { Component } from 'react'
import { Text, View, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import { Radio, ListItem, Left, Right } from 'native-base';
import { setData, getData } from '../../services/data.service'
import Language, { ListLanguage, selectLang } from '../../i18n/i18n'
import { NavigationActions, StackActions } from 'react-navigation'
import GLOBALS from '../../helper/variables';

export default class language extends Component {
    static navigationOptions = () => ({
        title: Language.t('Settings.Languages'),
        headerStyle: {
            backgroundColor: '#fafafa',
            borderBottomWidth: 0,
            elevation: 0
        },
        headerTitleStyle: {
            color: '#0C449A',
        },
        headerBackTitleStyle: {
            color: '#0C449A'
        },
        headerTintColor: '#0C449A',
    });

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

    selectLanguage(lang) {
        this.setState({ selected: lang })
        setData('languages', lang);
        selectLang();

        this.props.navigation.dispatch(StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({
                    routeName: 'Unlogin',
                }),
            ],
        }))
    }

    render() {
        return (
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
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: GLOBALS.hp('2%'),
        backgroundColor: '#fafafa'
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