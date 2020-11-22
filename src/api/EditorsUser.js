import request from '@/utils/RequestApi'
import qs from 'qs';
export function GetEditorsUser(query) {
  return request({
    url: '/EditorsUser/GetEditorsUser',
    method: 'get',
    params: query
  })
}

export function Create(data) {
  return request({
    url: '/EditorsUser/Create',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function Edit(data) {
  return request({
    url: '/EditorsUser/Edit',
    method: 'post',
    data: qs.stringify(data)
  })
}