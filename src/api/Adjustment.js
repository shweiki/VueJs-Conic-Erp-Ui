import request from '@/utils/requestApi'
import qs from 'qs';
export function GetAdjustments(query) {
  return request({
    url: '/Adjustment/GetAdjustments',
    method: 'get',
    params: query
  })
}
export function GetPAdjustments(query) {
  return request({
    url: '/Adjustment/GetPAdjustments',
    method: 'get',
    params: query
  })
}
export function GetRAdjustments(query) {
  return request({
    url: '/Adjustment/GetRAdjustments',
    method: 'get',
    params: query
  })
}

export function Create(data) {
  return request({
    url: '/Adjustment/Create',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function GetAdjustmentLabel(query) {
  return request({
    url: '/Adjustment/GetAdjustmentLabel',
    method: 'get',
    params: query
  })
}


