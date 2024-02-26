import request from '@/utils/requestApi'
import qs from 'qs'
export function GetDiscount(query) {
  return request({
    url: '/Discount/GetDiscount',
    method: 'get',
    params: query
  })
}

export function GetActiveDiscount(query) {
  return request({
    url: '/Discount/GetActiveDiscount',
    method: 'get',
    params: query
  })
}

export function Create(data) {
  return request({
    url: '/Discount/Create',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function Edit(data) {
  return request({
    url: '/Discount/Edit',
    method: 'post',
    data: qs.stringify(data)
  })
}
