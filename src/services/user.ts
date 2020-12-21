/*
 * 用户请求相关
*/

import request from '@/utils/request'
import qs from 'qs'

interface User {
  phone: string
  password: string
}

export const login = (data: User) => request({
  method: 'POST',
  url: '/front/user/login',
  // headers: { 'content-type': 'application/x-www-form-urlencoded' },
  // 如果 date 是普通对象，则Content-Type 是 application/json
  // 如果 data 是qs.stringify(data) 转换之后的数据：key=value&key=value，则Content-type 会被设置为 application/x-www-form-urlencoded
  // 如果 data 是 h5 的 文件上传的 FormData 对象，则Content-Type 会被设置为multipart/form-data
  data: qs.stringify(data) // axios 默认发送的是application.json格式的数据
})

export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/front/user/getInfo'
    // headers: {
    //   Authorization: store.state.user.access_token
    // }
  })
}

export const getUserPages = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/user/getUserPages',
    data
  })
}

export const forbidUser = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/user/forbidUser',
    params: qs.stringify(data)
  })
}

export const enableUser = (data: any) => {
  return request({
    method: 'GET',
    url: '/boss/user/enableUser',
    params: qs.stringify(data)
  })
}
