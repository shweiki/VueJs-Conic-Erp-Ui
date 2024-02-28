import request from '@/utils/requestApi'
import qs from 'qs'
export function GetSalaries(query) {
  return request({
    url: '/Salary/GetSalaries',
    method: 'get',
    params: query
  })
}


export function Edit(data) {
  return request({
    url: '/Salary/Edit',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function Create(data) {
  return request({
    url: '/Salary/Create',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function GetSalaryByEmployeeId(query) {
  return request({
    url: '/Salary/GetSalaryByEmployeeId',
    method: 'get',
    params: query
  })
}

export function GetLastSalaryById(query) {
  return request({
    url: '/Salary/GetLastSalaryById',
    method: 'get',
    params: query
  })
}
export function GetById(query) {
  return request({
    url: '/Salary/GetById',
    method: 'get',
    params: query
  })
}
export function GetSalaryId(query) {
  return request({
    url: '/Salary/GetSalaryId',
    method: 'get',
    params: query
  })
}
