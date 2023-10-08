import request from '@/utils/requestApi'
import qs from 'qs';
import store from '@/store'
import { asyncRoutes, constantRoutes } from '@/router'


export function GetRoles() {
  return request({
    url: '/Role/GetRoles',
    method: 'get'
  })
}


export function AddRole(data) {
  return request({
    url: '/Role/AddRole',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function AddUserRouter(data) {
  return request({
    url: '/Role/AddUserRouter',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function Edit(data) {
  return request({
    url: '/Role/Edit',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function DeleteRole(data) {
  return request({
    url: '/Role/DeleteRole',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function getRoutes() {
  return asyncRoutes
}