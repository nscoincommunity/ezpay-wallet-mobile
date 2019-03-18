import React, { Component } from 'react';
import { Text, View, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import Carousel, { ParallaxImage } from 'react-native-snap-carousel';
import ItemEntry from './itemEntry';
import { connect, } from 'react-redux';
import { fetchRate, EventSnap, EventGetBalance, GetListToken } from '../../../redux/actions/slideWalletAction'
import { bindActionCreators } from 'redux'


const { width, height } = Dimensions.get('window');
function wp(percentage) {
    const value = (percentage * width) / 100
    return Math.round(value);
}
const sliderHeight = width * 0.4;
const sliderWidth = wp(65);
const itemHorizontalMargin = wp(2);
const itemWidth = sliderWidth + itemHorizontalMargin * 10;

class ListWallet extends Component {
    Interval: any;
    InitInterval: boolean = true;
    constructor(props) {
        super(props)
        this.FunAddNew = this.FunAddNew.bind(this);
        this._renderItem = this._renderItem.bind(this)
    }
    FunAddNew() {
        alert('add new wallet')
    }

    _snapToItem(Item) {
        this.InitInterval = false;
        if (Item.wallet == "addNew") {
            this.props.fetchRate('new', '');
            this.props.GetListToken('')
        } else {
            this.props.fetchRate(Item.network.name, Item.id);
            this.funcUpdateBalance(Item)
            this.props.GetListToken(Item.network.name, Item.address, Item.name, Item.pk_en)
        }
    }

    funcUpdateBalance(Item) {
        this.Interval = setInterval(() => {
            this.props.EventGetBalance(Item.address, Item.network.name, Item.id)
        }, 4000)
    }

    _renderItem({ item, index }) {
        return (
            <ItemEntry item={item} index={index} {...this.props} />
        )
    }
    _startSnap() {
        this.props.EventSnap(true);
        clearInterval(this.Interval)
    }
    _endSnap() {
        this.props.EventSnap(false)
    }
    shouldComponentUpdate() {
        return false
    }

    componentWillUnmount() {
        clearInterval(this.Interval)
    }

    componentDidMount() {
        if (this.InitInterval) {
            this.funcUpdateBalance(this.props.Data[0]);
            this.props.GetListToken(
                this.props.Data[0].network.name,
                this.props.Data[0].address,
                this.props.Data[0].name,
                this.props.Data[0].pk_en
            )
        }
    }

    onMove(evt) {
        const { locationX, locationY } = evt.nativeEvent;
        console.log('move', evt.nativeEvent)
    }

    render() {
        const { Data } = this.props;
        if (Data.findIndex(x => x.wallet == 'addNew') == -1) {
            // Data.push({ wallet: 'addNew' })
            var TempData = Data.concat({ wallet: 'addNew' })
        }
        return (
            <View>
                <Carousel
                    ref={(c) => { this._carousel = c }}
                    data={TempData}
                    renderItem={this._renderItem}
                    sliderWidth={width}
                    itemWidth={itemWidth}
                    firstItem={0}
                    onSnapToItem={(index) => this._snapToItem(TempData[index])}
                    // hasParallaxImages={true}
                    loop={true}
                    // onScroll={(pan) => { console.log('aaaa', pan) }}
                    // onScrollBeginDrag={() => this._startSnap()}
                    // onScrollEndDrag={() => this._endSnap()}
                    slideStyle={{ paddingVertical: 8, }}
                    onResponderMove={this.onMove.bind(this)}
                />
            </View>
        )
    }
}

function mapStateToProp(state) {
    return state
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({ fetchRate, EventSnap, EventGetBalance, GetListToken }, dispatch)
}

export default connect(mapStateToProp, mapDispatchToProps)(ListWallet)
