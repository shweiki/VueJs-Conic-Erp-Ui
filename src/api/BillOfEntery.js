import request from '@/utils/requestApi'
import qs from 'qs'

export function GetByListQ(data) {
  return request({
    url: '/BillOfEntery/GetByListQ',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function GetBillOfEnteryById(query) {
  return request({
    url: '/BillOfEntery/GetBillOfEnteryById',
    method: 'get',
    params: query
  })
}
export function GetBillOfEnteryByPurchaseId(query) {
  return request({
    url: '/BillOfEntery/GetBillOfEnteryByPurchaseId',
    method: 'get',
    params: query
  })
}export function GetActiveBillOfEnteryForItemId(query) {
  return request({
    url: '/BillOfEntery/GetActiveBillOfEnteryForItemId',
    method: 'get',
    params: query
  })
}
export function CalBillOfEntery(query) {
  return request({
    url: '/BillOfEntery/CalBillOfEntery',
    method: 'get',
    params: query
  })
}


export function Create(data) {
  return request({
    url: '/BillOfEntery/Create',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function Edit(data) {
  return request({
    url: '/BillOfEntery/Edit',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function PinBillOfEntery(data) {
  return request({
    url: '/BillOfEntery/PinBillOfEntery',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function PinST9BillOfEntery(data) {
  return request({
    url: '/BillOfEntery/PinST9BillOfEntery',
    method: 'post',
    data: qs.stringify(data)
  })
}
