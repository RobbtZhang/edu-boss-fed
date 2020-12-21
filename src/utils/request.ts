import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'
import qs from 'qs'

function redirectLogin () {
  router.push({
    name: 'login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}

function refreshToken () {
  return axios.create()({
    method: 'POST',
    url: '/front/user/refresh_token',
    data: qs.stringify({
      refreshtoken: store.state.user.refresh_token
    })
  })
}

const request = axios.create({
  // 配置选项
  // baseURL
  // timeout
})

// 请求拦截器
request.interceptors.request.use(function (config) {
  // 改写config配置信息实现业务功能的统一处理
  const { user } = store.state
  if (user && user.access_token) {
    config.headers.Authorization = user.access_token
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

// 响应拦截器
let isRfreshing = false
let requests: any[] = []
request.interceptors.response.use(function (response) {
  // 状态码为2xx都会进入这里
  // 如果是自定义错误的状态码，错误就在这处理
  // console.log(response)
  if (response.data.code === '-1') {
    Message.error(response.data.mesg)
  }
  return response
}, async function (error) {
  // 超出2xx的状态码都会进入这里
  // 如果是HTTP状态码，错误就在这处理
  if (error.response) { // 请求发出去收到响应了，但是状态码超出了2xx
    const { status } = error.response
    if (status === 400) {
      Message.error('请求参数错误')
    } else if (status === 401) {
      // token 无效(没提供token，无效token、token过期)
      // 如果有refresh_token 则尝试使用refresh_token获取新的access_token
      if (!store.state.user) {
        redirectLogin()
        return Promise.reject(error)
      }
      // 尝试刷新获取新的 token
      if (!isRfreshing) {
        isRfreshing = true
        return refreshToken().then(res => {
          if (!res.data.content) {
            throw new Error('刷新token失败')
          }
          store.commit('setUser', res.data.content)
          requests.forEach(cb => cb())
          requests = []
          return request(error.config)
        }).catch(err => {
          store.commit('setUser', null)
          redirectLogin()
          return Promise.reject(err)
        }).finally(() => {
          isRfreshing = false
        })
      }
      // 刷新状态下把请求挂起放到 requests 中
      // requests.push(() => request(error.config))
      return new Promise(resolve => {
        requests.push(() => {
          resolve(request(error.config))
        })
      })
      // try {
      //   const { data } = await axios.create()({
      //     method: 'POST',
      //     url: '/front/user/refresh_token',
      //     data: qs.stringify({
      //       refreshtoken: store.state.user.refresh_token
      //     })
      //   })
      //   // 成功 把本次失败的请求重新发出去
      //   // 把新的token更新到vuex中
      //   store.commit('setUser', data.content)
      //   return request(error.config) // error.config请求失败的配置信息
      // } catch (err) {
      //   // 把点前登录用户状态清除
      //   store.commit('setUser', null)
      //   // 失败跳转回登录页重新获取token
      //   redirectLogin()
      //   return Promise.reject(err)
      // }
    } else if (status === 403) {
      Message.error('没有权限，请联系管理员')
    } else if (status === 404) {
      Message.error('请求资源不存在')
    } else if (status >= 500) {
      Message.error('服务端错误，请联系管理员')
    }
  } else if (error.request) { // 请求发出没有收到响应
    Message.error('请求超时，请刷新重试')
  } else { // 请求时发生错误
    Message.error(`请求失败：${error.message}`)
  }
  return Promise.reject(error) // 把请求失败的错误对象继续抛出，扔给下一个调用者
})

export default request
