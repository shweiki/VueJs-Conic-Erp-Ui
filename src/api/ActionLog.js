import request from '@/utils/requestApi'
import qs from 'qs'

export function GetLogByObjTable(data) {
  return request({
    url: '/ActionLog/GetLogByObjTable',
    method: 'get',
    params: data
  })
}
