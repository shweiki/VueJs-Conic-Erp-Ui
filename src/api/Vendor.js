import request from '@/utils/requestApi'
import qs from 'qs';
export function GetVendor(query) {
  return request({
    url: '/Vendor/GetVendor',
    method: 'get',
    params: query
  })
}

export function GetActiveVendor(query) {
  return request({
    url: '/Vendor/GetActiveVendor',
    method: 'get',
    params: query
  })
}

export function GetById(query) {
  return request({
    url: '/Vendor/GetById',
    method: 'get',
    params: query
  })
}
export function GetVendorByAny(query) {
  return request({
    url: '/Vendor/GetVendorByAny',
    method: 'get',
    params: query
  })
}
export function CheckIsExist(query) {
  return request({
    url: '/Vendor/CheckIsExist',
    method: 'get',
    params: query
  })
}
export function GetByListQ(data) {
  return request({
    url: '/Vendor/GetByListQ',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function Create(data) {
  return request({
    url: '/Vendor/Create',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function Edit(data) {
  return request({
    url: '/Vendor/Edit',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function GetVendorCheque(query) {
    return request({
      url: '/Vendor/GetVendorCheque',
      method: 'get',
      params: query
    })
  }
  
  export function CreateCustomer(data) {
    return request({
      url: '/Vendor/CreateCustomer',
      method: 'post',
      data: qs.stringify(data)
    })
  }
  export function GetVendorByUserId(query) {
    return request({
      url: '/Vendor/GetVendorByUserId',
      method: 'get',
      params: query
    })
  }
