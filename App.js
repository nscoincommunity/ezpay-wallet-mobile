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
    try {
      getData('languages').then(lang => {
        if (lang == null) {
          DeviceLanguage()
        } else {
          selectLang()
        }
      })
    } catch (error) {
      DeviceLanguage()
    }

  }

  render() {
    getExchangeRate()
    return (
      <App />
    );
  }
}
/* ************************************** */
/* test code */
/* ************************************** */
// import React, { Component } from "react";
// import { View, Text } from "react-native";
// import { TabNavigator, DrawerNavigator, StackNavigator } from "react-navigation";

// class DrawerScreen extends Component {
//   render() {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

//         <Text >
//           Drawer Screen Content
//       </Text>
//       </View>
//     );
//   }
// }
// class TabScreen extends Component {
//   render() {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <Text >
//           Tab Screen Content
//       </Text>
//       </View>
//     );
//   }
// }

// export default class NavSample extends Component {
//   state = {};

//   render() {
//     const Drawer = DrawerNavigator(
//       { DrawerScreen: { screen: DrawerScreen } },
//       { drawerPosition: "right" }
//     );

//     const Tab = TabNavigator({
//       TabScreen: { screen: Drawer }
//     });

//     return <Tab />;
//   }
// }