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

export function CheckMemberLog(query) {
  return request({
    url: '/MemberLog/CheckMemberLog',
    method: 'get',
    params:  query 
    
  })
}

export function GetMemberLogByID(query) {
  return request({
    url: '/MemberLog/GetMemberLogByID',
    method: 'get',
    params:  query 
    
  })
}

export function Create(data) {
  return request({
    url: '/MemberLog/Create',
    method: 'post',
    data: qs.stringify(data)
  })
}

