import request from '@/utils/requestApi'
import qs from 'qs';
export function GetAreas(query) {
  return request({
    url: '/Area/GetAreas',
    method: 'get',
    params: query
  })
}
export function GetAreasLabel(query) {
  return request({
    url: '/Area/GetAreasLabel',
    method: 'get',
    params: query
  })
}


export function Create(data) {
  return request({
    url: '/Area/Create',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function Edit(data) {
  return request({
    url: '/Area/Edit',
    method: 'post',
    data: qs.stringify(data)
  })
}