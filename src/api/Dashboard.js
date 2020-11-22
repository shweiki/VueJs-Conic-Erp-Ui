import request from '@/utils/RequestApi'
import qs from 'qs';
export function GetTotal(query) {
  return request({
    url: '/Dashbord/GetTotal',
    method: 'get',
    params: query
  })
}

