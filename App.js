import React, { Component } from "react";
import ROUTER from "./src/router";
import RouterContainer from './app/route'
import './global';
// import { exChange } from './src/tabfooter'
import { DeviceLanguage, selectLang } from './src/i18n/i18n';
import { getData, setData } from './src/services/data.service';
import { getExchangeRate } from './src/services/rate.service';
import firebase from 'react-native-firebase';
import { Alert, Platform, StatusBar } from 'react-native'
import { POSTAPI } from './src/helper/utils';
import devToolsEnhancer from 'remote-redux-devtools';
// redux
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import THUNK from 'redux-thunk';
// import REDUCER from './redux/reducers/rootReducer';
import REDUCER from './app/redux/reducers'

const store = createStore(REDUCER, compose(
  applyMiddleware(THUNK),
  devToolsEnhancer()
))


export default class Setup extends Component {
  constructor(props) {
    super(props)
    getExchangeRate()
  }

  async componentDidMount() {

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
    });
  }

  showAlert(title, body) {
    Alert.alert(
      title, body,
      [
        { text: 'OK', style: 'cancel' },
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
        var body = {
          deviceID: fcmToken,
          platform: Platform.OS
        }
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
      }
    } catch (error) {
      // User has rejected permissions
      console.log('permission rejected');
    }
  }

  render() {
    return (
      <Provider store={store}>
        <StatusBar
          backgroundColor={'transparent'}
          translucent
          barStyle="dark-content"
        />
        <RouterContainer />
        {/* <ROUTER /> */}
      </Provider>
    );
  }
}