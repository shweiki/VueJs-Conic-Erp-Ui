import request from '@/utils/RequestApi'
import qs from 'qs';
export function GetSalaries(query) {
  return request({
    url: '/Salary/GetSalaries',
    method: 'get',
    params: query
  })
}


export function Update(data) {
  return request({
    url: '/Salary/Update',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function GetSalaryById(query) {
  return request({
    url: '/Salary/GetSalaryById',
    method: 'get',
    params: query
  })
}

export function GetSalaryByIds(query) {
  return request({
    url: '/Salary/GetSalaryByIds',
    method: 'get',
    params: query
  })
}