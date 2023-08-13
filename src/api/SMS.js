import request from '@/utils/RequestApi'
import store from '@/store'
import qs from 'qs';

export function SendSMS(data) {
  return request({
    url: '/Sms/SendTo',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function SendMultiSMS(data) {
  return request({
    url: '/Sms/SendToMulti',
    method: 'post',
    data: qs.stringify(data)
  })
}
