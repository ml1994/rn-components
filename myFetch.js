import { Alert } from 'react-native'

const alert = (message) => Alert.alert('温馨提示', message, [
  {
    text: '好的'
  }
])

/**
 * 接收到的json通过适应后台接口做相应操作
 * mcq
 * @param {object} json json数据
 * @param {function} callback 成功回调
 * @param {function} ecallback 失败回调
 */
const handleJson = (json, callback, ecallback) => {
  switch (json.code) {
    case 0:
      callback
        ? callback(json)
        : alert(json.message)
      break
    case undefined: // 分页接口成功无code
      callback
        ? callback(json)
        : alert(json.message)
      break
    case 401: // 后端约定未登录 code === 401
      // 返回登录页
      break
    default:
      ecallback
        ? ecallback(json)
        : alert(json.message)
      break
  }
}

export default class MyFetch {
  // static rootUrl = 'http://ipapp.dev.hzjuxiu.com:40004' // es6不支持静态属性声明语法
  // static rootUrl = 'http://192.168.1.80:8080'
  static rootUrl = 'http://zzb.hzjuxiu.com'
  /**
   * 封装get
   * mcq
   * @static
   * @param {string} url 请求地址
   * @param {object} params 参数
   * @param {function} callback 成功回调
   * @param {function} ecallback 失败回调
   * @memberof MyFetch
   */
  static get (url, params, callback, ecallback) {
    if (params) {
      let paramsArray = []
      // 拼接参数
      Object
        .keys(params)
        .forEach(key => paramsArray.push(key + '=' + params[key]))
      if (url.search(/\?/) === -1) {
        url += '?' + paramsArray.join('&')
      } else {
        url += '&' + paramsArray.join('&')
      }
      console.log(url)
    }
    // fetch请求
    fetch(this.rootUrl + url, { method: 'GET' })
      .then(response => response.json())
      .then(responseJSON => {
        handleJson(responseJSON, callback, ecallback)
      })
      .catch(err => alert(err + ''))
  }
  /**
   * 封装post
   * mcq
   * @static
   * @param {string} url 请求路径
   * @param {string} body 参数字符串
   * @param {function} callback 成功回调
   * @param {function} ecallback 失败回调
   * @memberof MyFetch
   */
  static post (url, body, callback, ecallback) {
    // fetch请求
    fetch(this.rootUrl + url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body
    })
      .then(response => response.json())
      .then(responseJSON => {
        handleJson(responseJSON, callback, ecallback)
      })
      .catch(err => alert(err + ''))
  }
}
