import request from '@/utils/RequestApi'
import qs from 'qs';
export function GetOrderInventory(query) {
  return request({
    url: '/OrderInventory/GetOrderInventory',
    method: 'get',
    params: query
  })
}
export function GetOrderInventoryById(query) {
  return request({
    url: '/OrderInventory/GetOrderInventoryById',
    method: 'get',
    params: query
  })
}
export function Create(data) {
  return request({
    url: '/OrderInventory/Create',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function Edit(data) {
  return request({
    url: '/OrderInventory/Edit',
    method: 'post',
    data: qs.stringify(data)
  })
}