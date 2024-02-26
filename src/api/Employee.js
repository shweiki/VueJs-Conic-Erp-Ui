import request from '@/utils/requestApi'
import qs from 'qs'
export function GetEmployee(query) {
  return request({
    url: '/Employee/GetEmployee',
    method: 'get',
    params: query
  })
}
export function GetEmployeeByAny(query) {
  return request({
    url: '/Employee/GetEmployeeByAny',
    method: 'get',
    params: query
  })
}

export function GetByListQ(data) {
  return request({
    url: '/Employee/GetByListQ',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function CheckEmployeeIsExist(query) {
  return request({
    url: '/Employee/CheckEmployeeIsExist',
    method: 'get',
    params: query
  })
}

export function GetReceivablesEmployee(query) {
  return request({
    url: '/Employee/GetReceivablesEmployee',
    method: 'get',
    params: query
  })
}
export function GetPayablesEmployee(query) {
  return request({
    url: '/Employee/GetPayablesEmployee',
    method: 'get',
    params: query
  })
}

export function GetActiveEmployee(query) {
  return request({
    url: '/Employee/GetActiveEmployee',
    method: 'get',
    params: query
  })
}
export function GetEmployeeByStatus(query) {
  return request({
    url: '/Employee/GetEmployeeByStatus',
    method: 'get',
    params: query
  })
}

export function GetEmployeeById(query) {
  return request({
    url: '/Employee/GetEmployeeById',
    method: 'get',
    params:  query

  })
}


export function Create(data) {
  return request({
    url: '/Employee/Create',
    method: 'post',
    data: qs.stringify(data)
  })
}


export function Edit(data) {
  return request({
    url: '/Employee/Edit',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function CheckEmployees() {
  return request({
    url: '/Employee/CheckEmployees',
    method: 'get',
  })
}
export function CheckBlackListActionLogEmployees() {
  return request({
    url: '/Employee/CheckBlackListActionLogEmployees',
    method: 'get',
  })
}

export function GetEmployeeLog(query) {
  return request({
    url: '/Employee/GetEmployeeLog',
    method: 'get',
    params: query
  })
}
