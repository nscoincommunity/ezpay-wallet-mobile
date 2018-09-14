import React, { Component } from "react";
import { StyleProvider } from "native-base";
import App from "./src/router";
import './global';
import { exChange } from './src/tabfooter'
import { getExchangeRate } from './src/services/rate.service';
export default class Setup extends Component {
  render() {
    getExchangeRate()
    return (
      <App />
    );
  }
}
