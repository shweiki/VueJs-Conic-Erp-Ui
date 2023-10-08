import request from '@/utils/requestApi'
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
export function FeelDevice(query) {
  return request({
    url: '/Device/FeelDevice',
    method: 'get',
    params: query
  })
}

export function GetById(query) {
  return request({
    url: '/Device/GetById',
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
export function OpenCashDrawer(query) {
  return request({
    url: '/Device/OpenCashDrawer',
    method: 'get',
    params: query
  })
}
