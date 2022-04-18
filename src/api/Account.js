import request from '@/utils/RequestApi'
import qs from 'qs';
export function GetAccount(query) {
  return request({
    url: '/Account/GetAccount',
    method: 'get',
    params: query
  })
}
export function GetById(query) {
  return request({
    url: '/Account/GetById',
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
export function GetMainAccount(query) {
  return request({
    url: '/Account/GetMainAccount',
    method: 'get',
    params: query
  })
} export function CheckIsExist(query) {
  return request({
    url: '/Account/CheckIsExist',
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
export function EditParent(data) {
  return request({
    url: '/Account/EditParent',
    method: 'post',
    data: qs.stringify(data)
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
export function GetPayables(query) {
  return request({
    url: '/Account/GetPayables',
    method: 'get',
    params: query
  })
}
export function GetReceivables(query) {
  return request({
    url: '/Account/GetReceivables',
    method: 'get',
    params: query
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
export function Delete(data) {
  return request({
    url: '/Account/Delete',
    method: 'post',
    data: qs.stringify(data)
  })
}