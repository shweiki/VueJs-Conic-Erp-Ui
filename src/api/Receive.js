import request from '@/utils/RequestApi'
import qs from 'qs';
export function GetReceive(query) {
  return request({
    url: '/Receive/GetReceive',
    method: 'get',
    params: query
  })
}
export function GetByListQ(data) {
  return request({
    url: '/Receive/GetByListQ',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function GetById(query) {
  return request({
    url: '/Receive/GetById',
    method: 'get',
    params: query
  })
}
export function GetReceivesByMemberId(query) {
  return request({
    url: '/Receive/GetReceivesByMemberId',
    method: 'get',
    params: query
  })
}
export function GetReceivesByVendorId(query) {
  return request({
    url: '/Receive/GetReceivesByVendorId',
    method: 'get',
    params: query
  })
}
export function GetReceiveByListId(query) {
  return request({
    url: '/Receive/GetReceiveByListId',
    method: 'get',
    params: query
  })
}

export function GetReceiveByStatus(query) {
  return request({
    url: '/Receive/GetReceiveByStatus',
    method: 'get',
    params: query
  })
}

export function Create(data) {
  return request({
    url: '/Receive/Create',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function Edit(data) {
  return request({
    url: '/Receive/Edit',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function EditReceiveMethod(data) {
  return request({
    url: '/Receive/EditReceiveMethod',
    method: 'post',
    data: qs.stringify(data)
  })
}
