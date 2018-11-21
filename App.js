import React, { Component } from "react";
import App from "./src/router";
import './global';
import { exChange } from './src/tabfooter'
import { getExchangeRate } from './src/services/rate.service';
import { DeviceLanguage, selectLang } from './src/i18n/i18n';
import { getData, setData } from './src/services/data.service'

export default class Setup extends Component {
  componentDidMount() {
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
  }

  render() {
    getExchangeRate()
    return (
      <App />
    );
  }
}