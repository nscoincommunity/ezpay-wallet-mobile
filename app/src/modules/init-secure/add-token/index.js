import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Func_Add_Account } from '../../../../redux/rootActions/easyMode';
import Gradient from 'react-native-linear-gradient';
import Color from '../../../../helpers/constant/color';
import ImageApp from '../../../../helpers/constant/image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp, responsiveFontSize as font_size } from '../../../../helpers/constant/responsive';
import FormCreate from './create'
import FormImport from './import'
import Header from '../../../components/header';

export default class Add_token extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type_add: this.props.navigation.getParam('payload').type_add
        };
        console.log(this.props.navigation.getParam('payload'))
    }

    render() {
        return (
            <Gradient
                colors={Color.Gradient_clear_sky}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{ flex: 1 }}
            >
                <Header
                    IconLeft={"arrow-back"}
                    onPressLeft={() => this.props.navigation.goBack()}
                    Title="Phrase"
                    styleTitle={{ color: "#fff" }}
                    colorIconLeft='#fff'
                    colorIconRight="#fff"
                />
                {
                    this.state.type_add == "create" ?
                        <FormCreate {...this.props} />
                        :
                        <FormImport {...this.props} />
                }
            </Gradient>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})


