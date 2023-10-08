import request from '@/utils/requestApi'
import qs from 'qs';
export function GetMembership(query) {
  return request({
    url: '/Membership/GetMembership',
    method: 'get',
    params: query
  })
}

export function GetActiveMembership(query) {
  return request({
    url: '/Membership/GetActiveMembership',
    method: 'get',
    params: query
  })
}

export function Create(data) {
  return request({
    url: '/Membership/Create',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function Edit(data) {
  return request({
    url: '/Membership/Edit',
    method: 'post',
    data: qs.stringify(data)
  })
}