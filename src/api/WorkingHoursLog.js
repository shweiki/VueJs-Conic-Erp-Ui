import request from '@/utils/RequestApi'
import qs from 'qs';

export function GetEmployeeLogById(query) {
  return request({
    url: '/WorkingHourLog/GetEmployeeLogById',
    method: 'get',
    params:  query 
    
  })
}

export function GetWorkingHourId(query) {
  return request({
    url: '/WorkingHourLog/GetWorkingHourId',
    method: 'get',
    params:  query 
    
  })
}
export function GetEmployeeMounthLog(query) {
  return request({
    url: '/WorkingHourLog/GetEmployeeMounthLog',
    method: 'get',
    params:  query 
    
  })
}
export function Create(data) {
  return request({
    url: '/WorkingHourLog/Create',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function Logout(data) {
  return request({
    url: '/WorkingHourLog/Logout',
    method: 'post',
    data: qs.stringify(data)
  })
}

