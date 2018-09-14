import React, { Component } from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native';
import { List, ListItem } from 'native-base'
import GLOBALS from '../helper/variables'
class HorizontalItem extends Component {
    render() {
        return (
            <View style={{
                flex: 1,
                flexDirection: 'column',
                alignContent: 'center',
                width: GLOBALS.WIDTH / 4,
                backgroundColor: GLOBALS.Color.primary,
                padding: 10
            }}>
                <Text style={{ textAlign: 'center', color: '#fff', fontFamily: GLOBALS.font.Poppins }}>{this.props.item.show}</Text>
            </View>
        )
    }
}

export default class Ranges extends Component {


    render() {
        var HorizontalData = [
            {
                type: 'D',
                show: 'Day'
            },
            {
                type: 'W',
                show: 'Week'
            },
            {
                type: 'M',
                show: 'Month'
            },
            {
                type: 'ALL',
                show: 'All'
            },
        ]

        return (
            <View style={styles.container}>
                <FlatList
                    horizontal={true}
                    data={HorizontalData}
                    renderItem={({ item, index }) => {
                        return (
                            <HorizontalItem item={item} index={index} parentlatLis={this} />
                        )
                    }}
                    keyExtractor={(item, index) => item.type}
                />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#673AB7',
        borderBottomWidth: 0.5,
        borderBottomColor: 'gray',
    },
});