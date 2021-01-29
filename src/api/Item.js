import request from '@/utils/RequestApi'
import qs from 'qs';
export function GetItem(query) {
  return request({
    url: '/Item/GetItem',
    method: 'get',
    params: query
  })
}

export function GetActiveItem(query) {
  return request({
    url: '/Item/GetActiveItem',
    method: 'get',
    params: query
  })
}
export function GetItemByID(query) {
  return request({
    url: '/Item/GetItemByID',
    method: 'get',
    params: query
  })
}
export function GetItemByBarcode(query) {
  return request({
    url: '/Item/GetItemByBarcode',
    method: 'get',
    params: query
  })
}
export function GetIsPrimeItem(query) {
  return request({
    url: '/Item/GetIsPrimeItem',
    method: 'get',
    params: query
  })
}
export function GetItemMove(query) {
  return request({
    url: '/Item/GetItemMove',
    method: 'get',
    params: query
  })
}
export function CreateItem(data) {
  return request({
    url: '/Item/Create',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function Edit(data) {
  return request({
    url: '/Item/Edit',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function CalculateInventoryItemQty(data) {
  return request({
    url: '/Item/CalculateInventoryItemQty',
    method: 'post',
    data: qs.stringify(data)
  })
}