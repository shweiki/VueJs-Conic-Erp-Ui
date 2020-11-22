import request from '@/utils/RequestApi'
import qs from 'qs';
export function GetBanks(query) {
  return request({
    url: '/Banks/GetBanks',
    method: 'get',
    params: query
  })
}


export function Create(data) {
  return request({
    url: '/Banks/Create',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function Edit(data) {
  return request({
    url: '/Banks/Edit',
    method: 'post',
    data: qs.stringify(data)
  })
}