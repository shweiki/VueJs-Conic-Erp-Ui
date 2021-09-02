import request from '@/utils/RequestApi'
import qs from 'qs';

export function GetOrderDeliveryByListQ(data) {
  return request({
    url: '/OrderDelivery/GetOrderDeliveryByListQ',
    method: 'post',
    data: qs.stringify(data)
  })
}



export function CreateDelivery(data) {
  return request({
    url: '/OrderDelivery/CreateDelivery',
    method: 'post',
    data: qs.stringify(data)
  })
}
