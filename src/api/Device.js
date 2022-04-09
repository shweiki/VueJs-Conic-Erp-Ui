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
export function FeelDevice(query) {
  return request({
    url: '/Device/FeelDevice',
    method: 'get',
    params: query
  })
}

export function StartEnrollUser(query) {
  return request({
    url: '/Device/StartEnrollUser',
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
export function SetAll(query) {
  return request({
    url: '/Device/SetAll',
    method: 'get',
    params: query
  })
}
export function GetAllFingerPrints(query) {
  return request({
    url: '/Device/GetAllFingerPrints',
    method: 'get',
    params: query
  })
}
export function GetAllLog(query) {
  return request({
    url: '/Device/GetAllLog',
    method: 'get',
    params: query
  })
} export function ClearUserLog(query) {
  return request({
    url: '/Device/ClearUserLog',
    method: 'get',
    params: query
  })
} export function RestartDevice(query) {
  return request({
    url: '/Device/RestartDevice',
    method: 'get',
    params: query
  })
}export function TurnOff(query) {
  return request({
    url: '/Device/TurnOff',
    method: 'get',
    params: query
  })
}
export function ClearAdministrators(query) {
  return request({
    url: '/Device/ClearAdministrators',
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
