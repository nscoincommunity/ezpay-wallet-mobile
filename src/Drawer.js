import React from "react";
import { navigationOptions, createDrawerNavigator } from "react-navigation";
import Language from './i18n/i18n';

class MyHomeScreen extends React.Component {
    static navigationOptions = {
        drawerLabel: 'Home',
        drawerIcon: ({ tintColor }) => (
            <Image
                source={require('./chats-icon.png')}
                style={[styles.icon, { tintColor: tintColor }]}
            />
        ),
    };

    render() {
        return (
            <Button
                onPress={() => this.props.navigation.navigate('Notifications')}
                title="Go to notifications"
            />
        );
    }
}

class MyNotificationsScreen extends React.Component {
    static navigationOptions = {
        drawerLabel: 'Notifications',
        drawerIcon: ({ tintColor }) => (
            <Image
                source={require('./notif-icon.png')}
                style={[styles.icon, { tintColor: tintColor }]}
            />
        ),
    };

    render() {
        return (
            <Button
                onPress={() => this.props.navigation.goBack()}
                title="Go back home"
            />
        );
    }
}

const styles = StyleSheet.create({
    icon: {
        width: 24,
        height: 24,
    },
});

const Drawer = createDrawerNavigator({
    Home: {
        screen: MyHomeScreen,
    },
    Notifications: {
        screen: MyNotificationsScreen,
    },
});
export default Drawer;