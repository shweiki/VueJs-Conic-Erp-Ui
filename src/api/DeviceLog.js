import request from '@/utils/requestApi'
import qs from 'qs'
export function GetDeviceLog(query) {
  return request({
    url: '/DeviceLog/GetDeviceLog',
    method: 'get',
    params: query
  })
}
export function GetById(query) {
  return request({
    url: '/DeviceLog/GetById',
    method: 'get',
    params: query

  })
}
export function GetByStatus(query) {
  return request({
    url: '/DeviceLog/GetByStatus',
    method: 'get',
    params: query
  })
}

export function GetlastLogByUserId(query) {
  return request({
    url: '/DeviceLog/GetlastLogByUserId',
    method: 'get',
    params: query

  })
}

export function GetLogByUserId(query) {
  return request({
    url: '/DeviceLog/GetLogByUserId',
    method: 'get',
    params: query

  })
}

export function Edit(data) {
  return request({
    url: '/DeviceLog/Edit',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function Create(data) {
  return request({
    url: '/DeviceLog/Create',
    method: 'post',
    data: qs.stringify(data)
  })
}

