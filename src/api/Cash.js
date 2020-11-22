import request from '@/utils/RequestApi'
import qs from 'qs';
export function GetCash(query) {
  return request({
    url: '/Cash/GetCash',
    method: 'get',
    params: query
  })
}
export function GetActiveCash(query) {
  return request({
    url: '/Cash/GetActiveCash',
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