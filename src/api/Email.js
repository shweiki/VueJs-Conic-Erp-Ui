import request from '@/utils/RequestApi'
import qs from 'qs';
export function Send(data) {
  return request({
    url: '/Email/Send',
    method:'post',
    data: qs.stringify(data)
  })
}
