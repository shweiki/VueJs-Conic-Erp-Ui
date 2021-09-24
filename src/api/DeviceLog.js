import request from '@/utils/RequestApi'
import qs from 'qs';
export function GetDeviceLog(query) {
  return request({
    url: '/DeviceLog/GetDeviceLog',
    method: 'get',
    params: query
  })
}

export function GetByStatus(query) {
  return request({
    url: '/DeviceLog/GetByStatus',
    method: 'get',
    params:  query 
    
  })
}
export function RemoveDuplicate(query) {
  return request({
    url: '/DeviceLog/RemoveDuplicate',
    method: 'get',
    params:  query 
    
  })
}

export function GetlastLogByUserId(query) {
  return request({
    url: '/DeviceLog/GetlastLogByUserId',
    method: 'get',
    params:  query 
    
  })
}
export function CheckDeviceLog(query) {
  return request({
    url: '/DeviceLog/CheckDeviceLog',
    method: 'get',
    params:  query 
    
  })
}

export function GetLogByUserId(query) {
  return request({
    url: '/DeviceLog/GetLogByUserId',
    method: 'get',
    params:  query 
    
  })
}

export function Create(data) {
  return request({
    url: '/DeviceLog/Create',
    method: 'post',
    data: qs.stringify(data)
  })
}

