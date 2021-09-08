import request from '@/utils/RequestApi'
import qs from 'qs';
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

export function Create(data) {
  return request({
    url: store.getters.settings.PointOfSale.DeliveryUrl,
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