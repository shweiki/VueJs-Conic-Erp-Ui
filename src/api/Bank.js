import request from '@/utils/RequestApi'
import qs from 'qs';

export function Get(query) {
  return request({
    url: '/Bank/Get',
    method: 'get',
    params: query
  })
}
export function GetActive(query) {
  return request({
    url: '/Bank/GetActive',
    method: 'get',
    params: query
  })
}


export function Create(data) {
  return request({
    url: '/Bank/Create',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function Edit(data) {
  return request({
    url: '/Bank/Edit',
    method: 'post',
    data: qs.stringify(data)
  })
}