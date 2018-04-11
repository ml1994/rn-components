import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert
} from 'react-native'
import { NavigationActions } from 'react-navigation'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/FontAwesome'
import MyFetch from '../utils/myFetch'

import * as userActions from '../actions/user'

const propTypes = {
  list: PropTypes.array
  /**
   * list:[{
   *  icon: require(''),
   *  title: '', // 标题
   *  nav: '' // routeName,为exit时则为退出登录
   * }]
  */
}

const defaultProps = {
  list: []
}

class Menu extends Component {
  logout () { // 登出
    Alert.alert('温馨提示', '确认登出？', [
      {
        text: '取消',
        onPress: () => {}
      }, {
        text: '登出',
        onPress: () => {
          const { dispatch } = this.props
          MyFetch.get('/account/logout', {}, res => {
            dispatch(userActions.loginOut())
            dispatch(NavigationActions.navigate({ routeName: 'Login' }))
          }, err => {
            console.log(err)
          })
        }
      }
    ])
  }
  onPressHandler (nav, title) {
    console.log(title)
    const { dispatch } = this.props
    switch (nav) {
      case 'exit':
        this.logout()
        break
      case 'AboutDetail':
        dispatch(NavigationActions.navigate({
          routeName: nav,
          params: { title }
        }))
        break
      default:
        dispatch(NavigationActions.navigate({ routeName: nav }))
        break
    }
  }

  renderMenuItem (item, index) {
    const { nav, title } = item
    return (
      <View style={styles.itemView} key={index}>
        <TouchableOpacity style={styles.item} onPress={() => this.onPressHandler(nav, title)}>
          <Image style={styles.icon} source={item.icon}/>
          <View style={styles.titleView}>
            <Text style={styles.title}>{item.title}</Text>
          </View>
          <Icon style={styles.angle} name="angle-right" size={20} color="#bbb"/>
        </TouchableOpacity>
      </View>
    )
  }

  render () {
    return (
      <View style={styles.menu}>
        {this
          .props
          .list
          .map((item, index) => this.renderMenuItem(item, index))}
      </View>
    )
  }
}

Menu.propTypes = propTypes
Menu.defaultProps = defaultProps

const styles = StyleSheet.create({
  menu: {
    marginHorizontal: 10,
    alignItems: 'center'
  },
  itemView: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  item: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  icon: {
    width: 26,
    height: 26,
    marginHorizontal: 8
  },
  titleView: {
    width: '85%'
  },
  title: {
    fontSize: 16,
    color: '#161b61'
  },
  angle: {}
})

export default connect()(Menu)
