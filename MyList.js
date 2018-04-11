import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl
} from 'react-native'
import PropTypes from 'prop-types'

import MyFetch from '../utils/myFetch'

const IMG_URL = `${MyFetch.rootUrl}/uploadify/renderThumb/` // 获取图片缩略图的接口

const propTypes = {
  header: PropTypes.element, // 列表头 不传则没有列表头
  title: PropTypes.string, // 列表标题 不传则没有列表标题
  imgPosition: PropTypes.string, // 图片局左局右 'left'|'right'
  /* 生成列表的源数据数组
  list:[{
      id,
      imgUrl,
      title,
      time
    }]
  */
  list: PropTypes.array,
  onPressItem: PropTypes.func, // 点击每项的点击方法，返回被点击项的id
  refreshFun: PropTypes.func, // 下拉刷新方法
  pullUpFun: PropTypes.func // 上拉加载方法
}

const defaultProps = {
  header: <View></View>,
  // title: '我的列表',
  imgPosition: 'left',
  list: []
}

class MyList extends Component {
  constructor () {
    super()
    this.state = {
      showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
      isRefreshing: false // 下拉控制
    }
  }

  refreshFun () {
    if (this.props.refreshFun) {
      this.setState({ isRefreshing: true })
      this
        .props
        .refreshFun(() => this.setState({ isRefreshing: false })) // 刷新完毕回调
    }
  }

  pullUpFun () {
    if (this.props.pullUpFun) {
      this.setState({ showFoot: 2 })
      this
        .props
        .pullUpFun(() => this.setState({ showFoot: 1 })) // 数据全部加载完的回调
    }
  }

  keyExtractor (item) { // item加key
    return item.id + '' // 返回值要求String
  }

  renderSeparator () { // 分割线渲染
    return (
      <View style={styles.separator}></View>
    )
  }

  renderHeader () { // 头部渲染
    const rHeader = (
      <View style={styles.header}>
        {this.props.header}
        {!!this.props.title && (
          <View style={styles.headerTitleView}>
            <Text style={styles.headerTitle}>{this.props.title}</Text>
          </View>
        )}
      </View>
    )
    return rHeader
  }

  renderFooter () {
    if (this.props.list.length === 0) { // 空数据
      return (
        <View style={styles.footerView}>
          <Text>暂无数据</Text>
        </View>
      )
    } else {
      if (this.state.showFoot === 1) {
        return (
          <View style={styles.footerView}>
            <Text>没有更多数据了</Text>
          </View>
        )
      } else if (this.state.showFoot === 2) {
        return (
          <View style={styles.footerView}>
            <ActivityIndicator/>
            <Text>正在加载更多数据...</Text>
          </View>
        )
      } else if (this.state.showFoot === 0) {
        return (
          <View style={styles.footerView}>
            <Text></Text>
          </View>
        )
      }
    }
  }

  renderItem (item) {
    return (
      <TouchableOpacity
        style={[
          styles.itemView, {
            flexDirection: this.props.imgPosition === 'left'
              ? 'row'
              : 'row-reverse'
          }
        ]}
        onPress={() => !!this.props.onPressItem && this.props.onPressItem(item.id)}
        activeOpacity={0.2}>
        <View style={styles.imgView}>
          <Image
            style={styles.img}
            source={{
              uri: `${IMG_URL}${item.imgUrl}/135x90`
            }}
            resizeMode="contain"/>
        </View>
        <View style={styles.textView}>
          <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  render () {
    return (
      <View style={styles.listView}>
        <FlatList
          {...this.props}
          data={this.props.list}
          refreshControl={< RefreshControl refreshing = {
            this.state.isRefreshing
          }
          onRefresh = {
            () => this.refreshFun()
          }
          tintColor = "#ccc" title = "Loading..." titleColor = "#ccc" />}
          onEndReached={() => this.pullUpFun()}
          onEndReachedThreshold={0.1}
          keyExtractor={this.keyExtractor}
          ItemSeparatorComponent={() => this.renderSeparator()}
          ListHeaderComponent={() => this.renderHeader()}
          ListFooterComponent={() => this.renderFooter()}
          renderItem={({ item }) => this.renderItem(item)}
          showsVerticalScrollIndicator={false}/>
      </View>
    )
  }
}

MyList.propTypes = propTypes
MyList.defaultProps = defaultProps

const styles = StyleSheet.create({
  listView: {
    flex: 1
  },
  header: {},
  headerTitleView: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginHorizontal: 10,
    justifyContent: 'center'
  },
  headerTitle: {
    fontSize: 17,
    color: '#666'
  },
  separator: {
    height: 1,
    marginHorizontal: 10,
    backgroundColor: '#ccc'
  },
  itemView: {
    height: 116,
    paddingVertical: 13,
    marginHorizontal: 10,
    justifyContent: 'space-between'
  },
  imgView: {
    flex: 4,
    alignItems: 'center'
  },
  img: {
    width: 135,
    height: 90,
    borderRadius: 3
  },
  textView: {
    flex: 5,
    paddingHorizontal: 10,
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 16,
    color: '#000'
  },
  time: {
    fontSize: 11,
    color: '#999'
  },
  footerView: {
    flexDirection: 'row',
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10
  }
})

export default MyList
