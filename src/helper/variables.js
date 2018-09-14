import { Dimensions } from 'react-native';

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
    }
}
