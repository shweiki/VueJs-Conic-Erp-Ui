import request from '@/utils/RequestApi'
import qs from 'qs';


export function Create(data) {
  return request({
    url: '/WorkingAdjustment/Create',
    method: 'post',
    data: qs.stringify(data)
  })
}

