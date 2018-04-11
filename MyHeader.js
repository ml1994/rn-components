import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { NavigationActions } from 'react-navigation'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/FontAwesome'

const propTypes = {
  title: PropTypes.string, // header标题
  rightBtn: PropTypes.element, // 右侧按钮组件
  isLoginPage: PropTypes.bool // 是否为登录页
}

const defaultProps = {
  title: '',
  isLoginPage: false
}

class MyHeader extends Component {
  returnFun () {
    const { dispatch, isLoginPage } = this.props
    if (isLoginPage === true || this.props.title=='查看错题') {
      const resetAction = NavigationActions.reset({// 未登录状态返回，返回到home页
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'AppTabNav' })
        ]
      })
      dispatch(resetAction)
    } else {
      dispatch(NavigationActions.back())
    }
  }
  renderRightBtn () {
    if (this.props.rightBtn) {
      return this.props.rightBtn
    } else {
      return <View style={styles.btnView}></View>
    }
  }
  render () {
    return (
      <View style={styles.rootView}>
        <TouchableOpacity style={styles.btnView} onPress={() => this.returnFun()}>
          <Icon name="angle-left" size={20} color="#666"/>
        </TouchableOpacity>
        <View style={styles.titleView}>
          <Text style={styles.title}>{this.props.title}</Text>
        </View>
        <View style={styles.btnView}>
          {this.renderRightBtn()}
        </View>
      </View>
    )
  }
}

MyHeader.propTypes = propTypes
MyHeader.defaultProps = defaultProps

const styles = StyleSheet.create({
  rootView: {
    height: 40,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center'
  },
  btnView: {
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleView: {
    flex: 7,
    alignItems: 'center'
  },
  title: {
    fontSize: 16,
    color: '#666'
  }
})

export default connect()(MyHeader)
