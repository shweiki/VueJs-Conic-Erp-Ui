import request from '@/utils/RequestApi'
import qs from 'qs';
export function GetDevice(query) {
  return request({
    url: '/Device/GetDevice',
    method: 'get',
    params: query
  })
}
export function CheckDevice(query) {
  return request({
    url: '/Device/CheckDevice',
    method: 'get',
    params: query
  })
}
export function SetUser(query) {
  return request({
    url: '/Device/SetUser',
    method: 'get',
    params: query
  })
}
export function GetUserLog(query) {
  return request({
    url: '/Device/GetUserLog',
    method: 'get',
    params: query
  })
}

export function Create(data) {
  return request({
    url: '/Device/Create',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function Edit(data) {
  return request({
    url: '/Device/Edit',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function SetAllMembers(query) {
  return request({
    url: '/Device/SetAllMembers',
    method: 'get',
    params: query
  })
}
export function GetAllFaceMembers(query) {
  return request({
    url: '/Device/GetAllFaceMembers',
    method: 'get',
    params: query
  })
}
export function GetAllLogMembers(query) {
  return request({
    url: '/Device/GetAllLogMembers',
    method: 'get',
    params: query
  })
}
export function OpenCashDrawer(query) {
  return request({
    url: '/Device/OpenCashDrawer',
    method: 'get',
    params: query
  })
}
