import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'

export class segmentComponent extends Component {


    render() {
        return (
            <View style={styles.formSegment}>
                <TouchableOpacity style={styles.btnLeft}>
                    <Text style={{ textAlign: 'center', color: '#fff' }}>Send</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnRight}>
                    <Text style={{ textAlign: 'center', color: '#393B51' }}>Reciver</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    formSegment: {
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#ACAEBF',
    },
    btnLeft: {
        flex: 5,
        backgroundColor: '#ACAEBF',
        padding: 5,
        borderTopLeftRadius: 3,
        borderBottomLeftRadius: 3,
    },
    btnRight: {
        flex: 5,
        padding: 5,
        backgroundColor: '#fff',
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
    }
})


export default segmentComponent
