import request from '@/utils/requestApi'
import qs from 'qs';

export function GetByListQ(data) {
  return request({
    url: '/Visit/GetByListQ',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function GetByAny(data) {
  return request({
    url: '/Visit/GetByAny',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function GetByStatus(query) {
  return request({
    url: '/Visit/GetByStatus',
    method: 'get',
    params: query
  })
}
export function Create(data) {
  return request({
    url: '/Visit/Create',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function Edit(data) {
  return request({
    url: '/Visit/Edit',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function EditPaymentMethod(data) {
  return request({
    url: '/Visit/EditPaymentMethod',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function GetById(query) {
  return request({
    url: '/Visit/GetById',
    method: 'get',
    params: query
  })
}
export function GetByListId(query) {
  return request({
    url: '/Visit/GetByListId',
    method: 'get',
    params: query
  })
}

