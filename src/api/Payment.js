import request from '@/utils/RequestApi'
import qs from 'qs';
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

export function GetPaymentsByMemberID(query) {
  return request({
    url: '/Payment/GetPaymentsByMemberID',
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

export function CreatePayment(data) {
  return request({
    url: '/Payment/Create',
    method: 'post',
    data: qs.stringify(data)
  })
}
