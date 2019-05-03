import React, { Component } from 'react'
import { Text, View, StatusBar, StyleSheet, FlatList, Platform, TouchableWithoutFeedback, Image } from 'react-native'
import Gradient from 'react-native-linear-gradient';
import GLOBALS from '../../../helper/variables';
import Header from '../../../components/header';
import { NavigationActions } from 'react-navigation';


export default class ListDapps extends Component {
  constructor(props) {
    super(props)
    this.ready = false
  }

  componentDidMount() {
    setTimeout(() => {
      this.ready = true
    }, 650)
  }
  _goToBrowser = (item) => {
    const { address, network, pk_en } = this.props.navigation.getParam('payload');
    this.props.navigation.navigate('BrowserDapps', {
      payload: {
        url: item.url,
        address,
        network,
        pk_en
      }
    })
  }

  render() {
    return (
      <Gradient
        colors={['#F0F3F5', '#E8E8E8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}>
        <StatusBar
          backgroundColor={'transparent'}
          translucent
          barStyle="dark-content"
        />
        <Header
          backgroundColor="transparent"
          colorIconLeft="#328FFC"
          colorTitle="#328FFC"
          nameIconLeft="arrow-left"
          title='List Dapps'
          style={{ marginTop: 23 }}
          pressIconLeft={() => {
            this.props.navigation.dispatch(NavigationActions.back())
          }}
        />
        <View style={styles.container}>
          <FlatList
            data={data}
            keyExtractor={(item, index) => `${item.title}-${index}`}
            renderItem={({ item, index }) => {
              return (
                <DAppListItem
                  style={{ marginTop: index === 0 ? 15 : 0 }}
                  title={item.title}
                  subTitle={item.subTitle}
                  line={index != 0}
                  img={{ uri: item.img }}
                  onPress={() => this._goToBrowser(item)}
                />
              )

            }}
          />
        </View>
      </Gradient>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

const dumpData = [
  {
    title: 'Kyber Network',
    subTitle: 'An instant decentralized cryptocurrency exchange service.',
    url: 'https://web3.kyber.network',
    img: 'https://cdn.cryptostats.net/assets/images/coins/310497-KNC.png'
  },
  {
    title: 'IDEX',
    subTitle: 'IDEX is a decentralized exchange for trading Ethereum tokens.',
    url: 'https://idex.market/',
    img: 'https://idex.market/static/images/favicon-logo-wt-trans.png'
  },
  {
    title: 'OpenSea',
    subTitle: 'A peer-to-peer marketplace for rare digital items and crypto collectibles. Buy, sell, auction, and discover CryptoKitties, blockchain game items, and much more.',
    url: 'https://opensea.io',
    img: 'https://pbs.twimg.com/profile_images/988983240458305538/KNIW8ufg_400x400.jpg'
  },
  {
    title: 'Etheremon',
    subTitle: 'A world of Ether monster where you can captures, transform,...',
    url: 'https://www.etheremon.com',
    img: 'https://pbs.twimg.com/profile_images/960520740196909056/3RBArulO_400x400.jpg'
  },
  {
    title: '0x Portal',
    subTitle: 'An Open Protocol For Decentralized Exchange On The Ethereum Blockchain.',
    url: 'https://www.0xproject.com/portal',
    img: 'https://www.bebit.fr/wp-content/uploads/2018/04/0x-.png'
  },
  {
    title: 'Fork Delta',
    subTitle: 'A decentralized Ethereum Token Exchange with the most ERC20 listings of any exchange',
    url: 'https://forkdelta.app',
    img: 'https://forkdelta.io/images/logo.png'
  }
]

const data = Platform.OS === 'ios'
  ? [{
    title: 'Cryptokitties',
    subTitle: "The world's first blockchain games. Breed your rarest cats to create the purrfect furry friend. The future is meow!",
    url: 'https://www.cryptokitties.co',
    img: 'https://vignette.wikia.nocookie.net/cryptokitties/images/7/7f/Kitty-eth.png/revision/latest?cb=20171202061949'
  }, {
    title: 'DDEX',
    subTitle: 'DDEX is the first decentralized exchange built on Hydro Protocol...',
    url: 'https://ddex.io',
    img: 'https://pbs.twimg.com/profile_images/996789325823074304/huBkgZg4.jpg'
  }, ...dumpData]
  : dumpData

const imgNone = require('../../../images/Add-token.png')
class DAppListItem extends Component {
  render() {
    const {
      title,
      subTitle,
      onPress,
      line,
      img,
      style
    } = this.props
    return (
      <View style={[{ backgroundColor: 'transparent' }, style]}>
        {line && <View style={stylesItem.line} />}

        <TouchableWithoutFeedback onPress={onPress}>
          <View style={stylesItem.container}>
            <Image
              source={img.uri ? img : imgNone}
              style={stylesItem.image}
              resizeMode="contain"
            />
            <View style={stylesItem.viewStyle}>
              <Text style={stylesItem.titleStyle}>{title}</Text>
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                style={stylesItem.subTitleStyle}
              >
                {subTitle}
              </Text>
            </View>
            {/* <Image
              style={{ alignSelf: 'center' }}
              source={images.icon_indicator}
            /> */}
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }
}
const stylesItem = StyleSheet.create({
  container: {
    height: 105,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 15
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25
  },
  viewStyle: {
    flex: 1,
    marginRight: 10,
    marginLeft: 10,
    height: 50,
    justifyContent: 'space-between'
  },
  titleStyle: {
    color: GLOBALS.Color.primary,
    fontSize: 16,
    fontFamily: GLOBALS.font.Poppins
  },
  subTitleStyle: {
    color: '#8A8D97',
    fontSize: 14,
    fontFamily: GLOBALS.font.Poppins,
    marginTop: 5
  },
  line: {
    height: 1,
    backgroundColor: '#1D2137',
    marginLeft: 80,
    marginRight: 20
  }
})