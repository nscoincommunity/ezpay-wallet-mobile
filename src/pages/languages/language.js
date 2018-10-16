import React, { Component } from 'react'
import { Text, View, FlatList, TouchableOpacity } from 'react-native'
import { Radio, ListItem, Left, Right } from 'native-base';
import { setData, getData } from '../../services/data.service'
import Language, { ListLanguage, selectLang } from '../../i18n/i18n'
import { NavigationActions, StackActions } from 'react-navigation'
import GLOBALS from '../../helper/variables';

export default class language extends Component {
    static navigationOptions = () => ({
        title: Language.t('Settings.Languages'),
        headerStyle: {
            backgroundColor: GLOBALS.Color.primary,
        },
        headerTitleStyle: {
            color: 'white',
        },
        headerBackTitleStyle: {
            color: 'white',
        },
        headerTintColor: 'white',
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
            <View>
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
        )
    }
}