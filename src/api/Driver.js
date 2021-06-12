import request from '@/utils/RequestApi'
import qs from 'qs';
export function GetDriver(query) {
  return request({
    url: '/Driver/GetDriver',
    method: 'get',
    params: query
  })
}
export function GetDriverByAny(query) {
  return request({
    url: '/Driver/GetDriverByAny',
    method: 'get',
    params: query
  })
}
export function FixPhoneNumber(query) {
  return request({
    url: '/Driver/FixPhoneNumber',
    method: 'get',
    params: query
  })
}
export function GetByListQ(data) {
  return request({
    url: '/Driver/GetByListQ',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function CheckDriverIsExist(query) {
  return request({
    url: '/Driver/CheckDriverIsExist',
    method: 'get',
    params: query
  })
}

export function GetReceivablesDriver(query) {
  return request({
    url: '/Driver/GetReceivablesDriver',
    method: 'get',
    params: query
  })
}
export function GetPayablesDriver(query) {
  return request({
    url: '/Driver/GetPayablesDriver',
    method: 'get',
    params: query
  })
}

export function GetActiveDriver(query) {
  return request({
    url: '/Driver/GetActiveDriver',
    method: 'get',
    params: query
  })
}
export function GetDriverByStatus(query) {
  return request({
    url: '/Driver/GetDriverByStatus',
    method: 'get',
    params: query
  })
}

export function GetDriverById(query) {
  return request({
    url: '/Driver/GetDriverById',
    method: 'get',
    params:  query 
    
  })
}


export function Create(data) {
  return request({
    url: '/Driver/Create',
    method: 'post',
    data: qs.stringify(data)
  })
}


export function Edit(data) {
  return request({
    url: '/Driver/Edit',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function CheckDrivers() {
  return request({
    url: '/Driver/CheckDrivers',
    method: 'get',
  })
}
