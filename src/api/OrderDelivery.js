import request from '@/utils/requestApi'
import qs from 'qs'
import store from '@/store'

export function GetByListQ(data) {
  return request({
    url: '/OrderDelivery/GetByListQ',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function GetOrderDelivery(query) {
  return request({
    url: '/OrderDelivery/GetOrderDelivery',
    method: 'get',
    params: query
  })
}

export function GetDriverOrder(query) {
  return request({
    url: '/OrderDelivery/GetDriverOrder',
    method: 'get',
    params: query
  })
}

export function Create(data) {
  return request({
    url: store.getters.settings.PointOfSale.DeliveryUrl,
    method: 'post',
    data: qs.stringify(data)
  })
}
export function CreateWithDriver(data) {
  return request({
    url: '/OrderDelivery/CreateWithDriver',
    method: 'post',
    data: qs.stringify(data)
  })
}


export function SetDriver(data) {
  return request({
    url: '/OrderDelivery/SetDriver',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function OrderReceived(data) {
  return request({
    url: '/OrderDelivery/OrderReceived',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function OrderDelivered(data) {
  return request({
    url: '/OrderDelivery/OrderDelivered',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function OrderDone(data) {
  return request({
    url: '/OrderDelivery/OrderDone',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function GetByListQByDriver(data) {
  return request({
    url: '/OrderDelivery/GetByListQByDriver',
    method: 'post',
    data: qs.stringify(data)
  })
}
