import React, { Component } from "react";
import App from "./src/router";
import './global';
import { exChange } from './src/tabfooter'
import { getExchangeRate } from './src/services/rate.service';
import SplashScreen from 'react-native-splash-screen';
import { DeviceLanguage, selectLang } from './src/i18n/i18n';
import { getData } from './src/services/data.service'

export default class Setup extends Component {
  componentDidMount() {
    SplashScreen.hide();
    // try {
    //   getData('languages').then(lang => {
    //     if (lang == null) {
    //       DeviceLanguage()
    //     } else {
    //       selectLang()
    //     }
    //   })
    // } catch (error) {
    //   DeviceLanguage()
    // }

  }

  render() {
    getExchangeRate()
    return (
      <App />
    );
  }
}