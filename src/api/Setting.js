import request from '@/utils/RequestApi'
import qs from 'qs';
export function GetSetting(query) {
  return request({
    url: '/Setting/GetSetting',
    method: 'get',
    params: query
  })
}

export function GetActiveSetting(query) {
  return request({
    url: '/Setting/GetActiveSetting',
    method: 'get',
    params: query
  })
}


export function Create(data) {
  return request({
    url: '/Setting/Create',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function Edit(data) {
  return request({
    url: '/Setting/Edit',
    method: 'post',
    data: qs.stringify(data)
  })
}