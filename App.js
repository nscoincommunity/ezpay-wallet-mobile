import React, { Component } from "react";
import App from "./src/router";
import './global';
import { exChange } from './src/tabfooter'
import { getExchangeRate } from './src/services/rate.service';
import { DeviceLanguage, selectLang } from './src/i18n/i18n';
import { getData, setData } from './src/services/data.service'
import firebase from 'react-native-firebase';
import { Alert } from 'react-native'

export default class Setup extends Component {
  async componentDidMount() {
    getData('ListToken').then((data) => {
      if (data == null) {
        var initialData = [{
          "tokenAddress": '',
          "balance": '0',
          "symbol": 'NTY',
          "decimals": '',
          "ABI": ''
        }]
        setData('ListToken', JSON.stringify(initialData))
      }
    })
    this.checkPermission();
    this.createNotificationListeners();
  }

  //Remove listeners allocated in createNotificationListeners()
  componentWillUnmount() {
    this.notificationListener();
    this.notificationOpenedListener();
  }

  async createNotificationListeners() {
    /*
    * Triggered when a particular notification has been received in foreground
    * */
    this.notificationListener = firebase.notifications().onNotification((notification) => {
      console.log(notification)
      const { title, body } = notification;
      this.showAlert(title, body);
    });

    /*
    * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
    * */
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
      const { title, body } = notificationOpen.notification;
      this.showAlert(title, body);
    });

    /*
    * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    * */
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      const { title, body } = notificationOpen.notification;
      this.showAlert(title, body);
    }
    /*
    * Triggered for data only payload in foreground
    * */
    this.messageListener = firebase.messaging().onMessage((message) => {
      //process data message
      console.log(JSON.stringify(message));
    });
  }

  showAlert(title, body) {
    Alert.alert(
      title, body,
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false },
    );
  }


  //1
  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      // this.getToken();
      let fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        console.log('device token', fcmToken)
      }
    } else {
      this.requestPermission();
    }
  }

  //2
  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      let fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        console.log('device token', fcmToken)
      }
    } catch (error) {
      // User has rejected permissions
      console.log('permission rejected');
    }
  }

  render() {
    getExchangeRate()
    return (
      <App />
    );
  }
}