import request from '@/utils/RequestApi'
import qs from 'qs';
import store from '@/store'

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
    url: store.getters.settings.PointOfSale.DeliveryUrl,
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
export function OrderDelivered(data) {
  return request({
    url: '/OrderRestaurant/OrderDelivered',
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
export function GetByListQByCustomer(data) {
  return request({
    url: '/OrderRestaurant/GetByListQByCustomer',
    method: 'post',
    data: qs.stringify(data)
  })
}