import request from '@/utils/requestApi'
import qs from 'qs';
export function GetCash(query) {
  return request({
    url: '/Cash/GetCash',
    method: 'get',
    params: query
  })
}
export function GetActive(query) {
  return request({
    url: '/Cash/GetActive',
    method: 'get',
    params: query
  })
}

export function Create(data) {
  return request({
    url: '/Cash/Create',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function Edit(data) {
  return request({
    url: '/Cash/Edit',
    method: 'post',
    data: qs.stringify(data)
  })
}