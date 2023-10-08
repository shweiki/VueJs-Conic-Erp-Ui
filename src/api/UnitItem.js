import request from '@/utils/requestApi'
import qs from 'qs';
export function GetUnitItem(query) {
  return request({
    url: '/UnitItem/GetUnitItem',
    method: 'get',
    params: query
  })
}

export function GetActiveUnitItem(query) {
  return request({
    url: '/UnitItem/GetActiveUnitItem',
    method: 'get',
    params: query
  })
}

export function Create(data) {
  return request({
    url: '/UnitItem/Create',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function Edit(data) {
  return request({
    url: '/UnitItem/Edit',
    method: 'post',
    data: qs.stringify(data)
  })
}