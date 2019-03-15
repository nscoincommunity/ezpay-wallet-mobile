import { Dimensions } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, responsiveFontSize as fontsize } from './Reponsive';
import Language from '../i18n/i18n'
export default {
    WIDTH: Dimensions.get('window').width,
    HEIGHT: Dimensions.get('window').height,
    Color: {
        primary: '#0d47a1',
        secondary: '#fcb415',
        tertiary: '#488aff',
        extra: '#009a89',
        positive: '#32db64',
        danger: '#f53d3d',
        light: 'rgba(99, 93, 96, 0.28)',
        dark: '#222',
    },
    font: {
        Poppins: 'Poppins-Light'
    },
    wp,
    hp,
    fontsize,
    darkmode: {
        backgroundColor: '#f2f2f2',
        textColor: '#328FFC',
        colorTextListCoin: '#0000'
    },
    lightmode: {
        backgroundColor: '#1B2049',
        textColor: '#fff',
        colorTextListCoin: '#fff'
    }
}
