import request from '@/utils/RequestApi'
import qs from 'qs';
export function GetAccount(query) {
  return request({
    url: '/Account/GetAccount',
    method: 'get',
    params: query
  })
}
export function GetTreeAccount(query) {
  return request({
    url: '/Account/GetTreeAccount',
    method: 'get',
    params: query
  })
}

export function GetActiveAccounts(query) {
  return request({
    url: '/Account/GetActiveAccounts',
    method: 'get',
    params: query
  })
}
export function GetAccountByAny(query) {
  return request({
    url: '/Account/GetAccountByAny',
    method: 'get',
    params: query
  })
}

export function GetByListQ(data) {
  return request({
    url: '/Account/GetByListQ',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function GetInComeAccounts() {
  return request({
    url: '/Account/GetInComeAccounts',
    method: 'get',
  })
}

export function Create(data) {
  return request({
    url: '/Account/Create',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function Edit(data) {
  return request({
    url: '/Account/Edit',
    method: 'post',
    data: qs.stringify(data)
  })
}