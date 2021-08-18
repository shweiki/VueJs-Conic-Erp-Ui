import request from '@/utils/RequestApi'
import qs from 'qs';
export function GetMember(query) {
  return request({
    url: '/Member/GetMember',
    method: 'get',
    params: query
  })
}
export function GetMemberByAny(query) {
  return request({
    url: '/Member/GetMemberByAny',
    method: 'get',
    params: query
  })
}
export function FixPhoneNumber(query) {
  return request({
    url: '/Member/FixPhoneNumber',
    method: 'get',
    params: query
  })
}
export function GetByListQ(data) {
  return request({
    url: '/Member/GetByListQ',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function CheckMemberIsExist(query) {
  return request({
    url: '/Member/CheckMemberIsExist',
    method: 'get',
    params: query
  })
}

export function GetReceivablesMember(query) {
  return request({
    url: '/Member/GetReceivablesMember',
    method: 'get',
    params: query
  })
}
export function GetPayablesMember(query) {
  return request({
    url: '/Member/GetPayablesMember',
    method: 'get',
    params: query
  })
}

export function GetActiveMember(query) {
  return request({
    url: '/Member/GetActiveMember',
    method: 'get',
    params: query
  })
}
export function GetMemberByStatus(query) {
  return request({
    url: '/Member/GetMemberByStatus',
    method: 'get',
    params: query
  })
}

export function GetMemberById(query) {
  return request({
    url: '/Member/GetMemberById',
    method: 'get',
    params:  query 
    
  })
}


export function Create(data) {
  return request({
    url: '/Member/Create',
    method: 'post',
    data: qs.stringify(data)
  })
}


export function Edit(data) {
  return request({
    url: '/Member/Edit',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function CheckMembers() {
  return request({
    url: '/Member/CheckMembers',
    method: 'get',
  })
}
export function CheckLastActionLogMembers() {
  return request({
    url: '/Member/CheckLastActionLogMembers',
    method: 'get',
  })
}
