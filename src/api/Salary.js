import request from '@/utils/RequestApi'
import qs from 'qs';
export function GetSalaries(query) {
  return request({
    url: '/Salary/GetSalaries',
    method: 'get',
    params: query
  })
}


export function Create(data) {
  return request({
    url: '/Salary/Create',
    method: 'post',
    data: qs.stringify(data)
  })
}

