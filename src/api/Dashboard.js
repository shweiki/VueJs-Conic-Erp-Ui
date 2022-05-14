import request from '@/utils/RequestApi'
import qs from 'qs';
export function GetTotal(query) {
  return request({
    url: '/Dashbord/GetTotal',
    method: 'get',
    params: query
  })
}
export function GetStatistics(query) {
  return request({
    url: '/Dashbord/GetStatistics',
    method: 'get',
    params: query
  })
}
