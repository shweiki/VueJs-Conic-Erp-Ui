import request from '@/utils/requestApi'
import qs from 'qs';

export function GetByListQ(data) {
  return request({
    url: '/CashPool/GetByListQ',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function Create(data) {
  return request({
    url: '/CashPool/Create',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function Edit(data) {
  return request({
    url: '/CashPool/Edit',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function GetCashPoolById(query) {
  return request({
    url: '/CashPool/GetCashPoolById',
    method: 'get',
    params: query
  })
}

