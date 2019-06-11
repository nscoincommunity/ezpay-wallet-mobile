import { createStackNavigator } from 'react-navigation';
import Splash from '../src/modules/init-app/splash';

export default createStackNavigator(
    {
        Splash: { screen: Splash }
    },
    {
        headerMode: 'none'
    }
)