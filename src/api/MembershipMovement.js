import request from '@/utils/RequestApi'
import qs from 'qs';

export function Create(data) {
  return request({
    url: '/MembershipMovement/Create',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function Edit(data) {
  return request({
    url: '/MembershipMovement/Edit',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function GetMembershipMovementByMemberID(query) {
  return request({
    url: '/MembershipMovement/GetMembershipMovementByMemberID',
    method: 'get',
    params: query
  })
}
export function GetMembershipMovementByID(query) {
  return request({
    url: '/MembershipMovement/GetMembershipMovementByID',
    method: 'get',
    params: query
  })
}
export function GetMembershipMovementByStatus(query) {
  return request({
    url: '/MembershipMovement/GetMembershipMovementByStatus',
    method: 'get',
    params: query
  })
}
export function GetMembershipMovementByDateIn(query) {
  return request({
    url: '/MembershipMovement/GetMembershipMovementByDateIn',
    method: 'get',
    params: query
  })
}

export function CheckMembershipMovement() {
  return request({
    url: '/MembershipMovement/CheckMembershipMovement',
    method: 'get',
  })
}