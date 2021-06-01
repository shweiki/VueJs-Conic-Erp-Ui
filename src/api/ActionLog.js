import request from '@/utils/RequestApi'
import qs from 'qs';

export function GetLogByObjTable(data) {
  return request({
    url: '/ActionLog/GetLogByObjTable',
    method: 'get',
    params: data
  })
}
