import request from '@/utils/requestApi'
import qs from 'qs'
export function GetPayment(query) {
  return request({
    url: '/Payment/GetPayment',
    method: 'get',
    params: query
  })
}
export function GetByListQ(data) {
  return request({
    url: '/Payment/GetByListQ',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function GetById(query) {
  return request({
    url: '/Payment/GetById',
    method: 'get',
    params: query
  })
}
export function GetPaymentsByMemberId(query) {
  return request({
    url: '/Payment/GetPaymentsByMemberId',
    method: 'get',
    params: query
  })
}
export function GetPaymentsByVendorId(query) {
  return request({
    url: '/Payment/GetPaymentsByVendorId',
    method: 'get',
    params: query
  })
}
export function GetPaymentByListId(query) {
  return request({
    url: '/Payment/GetPaymentByListId',
    method: 'get',
    params: query
  })
}

export function GetPaymentByStatus(query) {
  return request({
    url: '/Payment/GetPaymentByStatus',
    method: 'get',
    params: query
  })
}

export function Create(data) {
  return request({
    url: '/Payment/Create',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function Edit(data) {
  return request({
    url: '/Payment/Edit',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function EditPaymentMethod(data) {
  return request({
    url: '/Payment/EditPaymentMethod',
    method: 'post',
    data: qs.stringify(data)
  })
}
