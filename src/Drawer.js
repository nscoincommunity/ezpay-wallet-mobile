import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import { ScrollView, Text, View, StyleSheet, Platform } from 'react-native';
import { DrawerActions } from 'react-navigation';

class DrawerScreen extends Component {
    navigateToScreen = (route) => () => {
        const navigateAction = NavigationActions.navigate({
            routeName: route
        });
        this.props.navigation.dispatch(navigateAction);
        this.props.navigation.dispatch(DrawerActions.closeDrawer())
    }

    render() {
        return (
            <View>
                <ScrollView>
                    <View>
                        <View style={styles.menuItem}>
                            <Text onPress={this.navigateToScreen('Home')}>
                                Home
              </Text>
                        </View>
                        <View style={styles.menuItem}>
                            <Text onPress={this.navigateToScreen('About')}>
                                About
              </Text>
                        </View>
                        <View style={styles.menuItem}>
                            <Text onPress={this.navigateToScreen('Contact')}>
                                Contact
              </Text>
                        </View>
                        <View style={styles.menuItem}>
                            <Text onPress={this.navigateToScreen('Login')}>
                                Login
              </Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

DrawerScreen.propTypes = {
    navigation: PropTypes.object
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    heading: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    menuItem: {
        padding: 10,
        borderWidth: 0.5,
        borderColor: '#d6d7da'
    }
});
export default DrawerScreen;
