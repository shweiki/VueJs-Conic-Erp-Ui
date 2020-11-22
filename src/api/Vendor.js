import request from '@/utils/RequestApi'
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
