import request from '@/utils/RequestApi'
import qs from 'qs';
export function GetItem(query) {
  return request({
    url: '/Item/GetItem',
    method: 'get',
    params: query
  })
}
export function GetItemByAny(query) {
  return request({
    url: '/Item/GetItemByAny',
    method: 'get',
    params: query
  })
}
export function CalculateCostPrice(query) {
  return request({
    url: '/Item/CalculateCostPrice',
    method: 'get',
    params: query
  })
}

export function GetByListQ(data) {
  return request({
    url: '/Item/GetByListQ',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function CheckItemIsExist(query) {
  return request({
    url: '/Item/CheckItemIsExist',
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
export function GetItemById(query) {
  return request({
    url: '/Item/GetItemById',
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