import request from '@/utils/RequestApi'
import qs from 'qs';
export function GetMemberLog(query) {
  return request({
    url: '/MemberLog/GetMemberLog',
    method: 'get',
    params: query
  })
}

export function GetMemberLogByStatus(query) {
  return request({
    url: '/MemberLog/GetMemberLogByStatus',
    method: 'get',
    params:  query 
    
  })
}
export function RemoveDuplicate(query) {
  return request({
    url: '/MemberLog/RemoveDuplicate',
    method: 'get',
    params:  query 
    
  })
}

export function GetlastLogByMemberId(query) {
  return request({
    url: '/MemberLog/GetlastLogByMemberId',
    method: 'get',
    params:  query 
    
  })
}
export function CheckMemberLog(query) {
  return request({
    url: '/MemberLog/CheckMemberLog',
    method: 'get',
    params:  query 
    
  })
}

export function GetEmployeeLogById(query) {
  return request({
    url: '/EmployeeLog/GetEmployeeLogById',
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

export function Create(data) {
  return request({
    url: '/EmployeeLog/Create',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function Logout(data) {
  return request({
    url: '/EmployeeLog/Logout',
    method: 'post',
    data: qs.stringify(data)
  })
}

