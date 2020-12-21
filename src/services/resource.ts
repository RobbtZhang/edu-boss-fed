import request from '@/utils/request'

export const getResourcePages = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/resource/getResourcePages',
    data
  })
}

export const getResourceCategory = (id: any = null) => {
  return request({
    method: 'GET',
    url: '/boss/resource/category/getAll',
    params: {
      resourceId: id
    }
  })
}

export const resourceSaveOrUpdate = (data: object) => {
  return request({
    method: 'POST',
    url: '/boss/resource/saveOrUpdate',
    data
  })
}

export const resourceCategorySaveOrUpdate = (data: object) => {
  return request({
    method: 'POST',
    url: '/boss/resource/category/saveOrderUpdate',
    data
  })
}

export const deleteResourceCategory = (id: number) => {
  return request({
    method: 'DELETE',
    url: `boss/resource/category/${id}`
  })
}

export const deleteResource = (id: number) => {
  return request({
    method: 'DELETE',
    url: `/boss/resource/${id}`
  })
}

export const getResource = () => {
  return request({
    method: 'GET',
    url: '/boss/resource/getAll'
  })
}

export const getRoleResources = (roleId: number | string) => {
  return request({
    method: 'GET',
    url: '/boss/resource/getRoleResources',
    params: {
      roleId
    }
  })
}

export const allocateRoleResources = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/resource/allocateRoleResources',
    data
  })
}
