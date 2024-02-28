import request from '@/utils/requestApi'
import qs from 'qs'
export function GetOriginItem(query) {
  return request({
    url: '/OriginItem/GetOriginItem',
    method: 'get',
    params: query
  })
}

export function GetActiveOriginItem(query) {
  return request({
    url: '/OriginItem/GetActiveOriginItem',
    method: 'get',
    params: query
  })
}

export function Create(data) {
  return request({
    url: '/OriginItem/Create',
    method: 'post',
     data
  })
}

export function Edit(data) {
  return request({
    url: '/OriginItem/Edit',
    method: 'post',
    data: qs.stringify(data)
  })
}
