import request from '@/utils/requestApi'
import qs from 'qs'

export function SendTo(data) {
  return request({
    url: '/Email/SendTo',
    method:'post',
    data: qs.stringify(data)
  })
}
