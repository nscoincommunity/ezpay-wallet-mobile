import React, { Component } from "react";
import { StyleProvider } from "native-base";
import App from "./src/router";
import './global';
import { exChange } from './src/tabfooter'
import { getExchangeRate } from './src/services/rate.service';
import SplashScreen from 'react-native-splash-screen';

export default class Setup extends Component {
  componentDidMount() {
    SplashScreen.hide();
  }

  render() {
    getExchangeRate()
    return (
      <App />
    );
  }
}
