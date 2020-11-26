import request from '@/utils/RequestApi'
import qs from 'qs';

export function login(data) {
  return request({
    url: '/User/Login',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function getInfo() {
  return request({
    url: '/User/Info',
    method: 'post',
  })
}

export function logout() {
  return request({
    url: '/User/logout',
    method: 'post',
  })
}



export function Register(data) {
  return request({
    url: '/User/Register',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function ChangePassword(data) {
  return request({
    url: '/User/ChangePassword',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function GetUsers() {
  return request({
    url: '/User/GetUsers',
    method: 'post'
  })
}
export function GetRoles() {
  return request({
    url: '/User/GetRoles',
    method: 'get'
  })
}
export function AddRoleUser(data) {
  return request({
    url: '/User/AddRoleForUser',
    method: 'post',
    params:data
  })
}
export function DeleteRoleUser(data) {
  return request({
    url: '/User/DeleteRoleForUser',
    method: 'post',
    params:data
  })
}
