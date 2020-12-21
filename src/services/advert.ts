import request from '@/utils/request'

export const getAdList = (params: any) => {
  return request({
    method: 'GET',
    url: '/front/ad/getAdList',
    params
  })
}

export const getAllSpaces = () => {
  return request({
    method: 'GET',
    url: '/front/ad/space/getAllSpaces'
  })
}

export const updateStatus = (params: any) => {
  return request({
    method: 'GET',
    url: '/front/ad/updateStatus',
    params
  })
}

export const saveOrUpdate = (data: any) => {
  return request({
    method: 'POST',
    url: '/front/ad/saveOrUpdate',
    data
  })
}

export const getAdById = (params: any) => {
  return request({
    method: 'GET',
    url: '/front/ad/getAdById',
    params
  })
}

export const saveOrUpdateSpace = (data: any) => {
  return request({
    method: 'POST',
    url: '/front/ad/space/saveOrUpdate',
    data
  })
}

export const getSpaceById = (params: any) => {
  return request({
    method: 'GET',
    url: '/front/ad/space/getSpaceById',
    params
  })
}
