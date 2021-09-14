import request from '@/utils/RequestApi'
import qs from 'qs';
export function GetAdjustments(query) {
  return request({
    url: '/Adjustment/GetAdjustments',
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

