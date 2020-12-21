import request from '@/utils/request'

export function getRoles (data: any): any {
  return request({
    method: 'POST',
    url: '/boss/role/getRolePages',
    data
  })
}

export function deleteRoles (id: any) {
  return request({
    method: 'DELETE',
    url: `/boss/role/${id}`
  })
}

export function createOrUpdate (data: any) {
  return request({
    method: 'POST',
    url: '/boss/role/saveOrUpdate',
    data
  })
}

export function getAllRoles () {
  return request({
    method: 'GET',
    url: '/boss/role/all'
  })
}

export function allocateUserRoles (data: any) {
  return request({
    method: 'POST',
    url: '/boss/role/allocateUserRoles',
    data
  })
}

export function getUserRoles (userId: string | number) {
  return request({
    method: 'GET',
    url: `/boss/role/user/${userId}`
  })
}
