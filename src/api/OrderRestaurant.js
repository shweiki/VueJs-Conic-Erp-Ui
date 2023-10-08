import request from '@/utils/requestApi'
import qs from 'qs';

export function GetByListQ(data) {
  return request({
    url: '/OrderRestaurant/GetByListQ',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function GetOrderRestaurant(query) {
  return request({
    url: '/OrderRestaurant/GetOrderRestaurant',
    method: 'get',
    params: query
  })
}

export function GetCustomerOrder(query) {
  return request({
    url: '/OrderRestaurant/GetCustomerOrder',
    method: 'get',
    params: query
  })
}

export function Create(data) {
  return request({
    url: '/OrderResaurant/Create',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function OrderReceived(data) {
  return request({
    url: '/OrderRestaurant/OrderReceived',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function OrderOnTable(data) {
  return request({
    url: '/OrderRestaurant/OrderOnTable',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function OrderDelivered(data) {
  return request({
    url: '/OrderRestaurant/OrderDelivered',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function VendorDone(data) {
  return request({
    url: '/OrderRestaurant/VendorDone',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function OrderDone(data) {
  return request({
    url: '/OrderRestaurant/OrderDone',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function OrdrerCheckout(data) {
  return request({
    url: '/OrderRestaurant/OrdrerCheckout',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function GetByListQByVendor(data) {
  return request({
    url: '/OrderRestaurant/GetByListQByVendor',
    method: 'post',
    data: qs.stringify(data)
  })
}