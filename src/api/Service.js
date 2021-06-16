import request from '@/utils/RequestApi'

import qs from 'qs';
export function GetService(query) {
  return request({
    url: '/Service/GetService',
    method: 'get',
    params: query
  })
}

export function GetActiveService(query) {
  return request({
    url: '/Service/GetActiveService',
    method: 'get',
    params: query
  })
}

export function Create(data) {
  return request({
    url: '/Service/Create',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function Edit(data) {
  return request({
    url: '/Service/Edit',
    method: 'post',
    data: qs.stringify(data)
  })
}
