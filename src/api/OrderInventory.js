import request from '@/utils/requestApi'
import qs from 'qs'

export function GetByListQ(data) {
  return request({
    url: '/OrderInventory/GetByListQ',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function GetOrderInventoryById(query) {
  return request({
    url: '/OrderInventory/GetOrderInventoryById',
    method: 'get',
    params: query
  })
}
export function GetByItem(query) {
  return request({
    url: '/OrderInventory/GetByItem',
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
