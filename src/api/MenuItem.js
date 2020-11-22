import request from '@/utils/RequestApi'
import qs from 'qs';
export function GetMenuItem(query) {
  return request({
    url: '/MenuItem/GetMenuItem',
    method: 'get',
    params: query
  })
}

export function GetActiveMenuItem(query) {
  return request({
    url: '/MenuItem/GetActiveMenuItem',
    method: 'get',
    params: query
  })
}

export function Create(data) {
  return request({
    url: '/MenuItem/Create',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function Edit(data) {
  return request({
    url: '/MenuItem/Edit',
    method: 'post',
    data: qs.stringify(data)
  })
}