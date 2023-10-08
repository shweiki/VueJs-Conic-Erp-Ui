import request from '@/utils/requestApi'
import qs from 'qs'

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
export function Delete(data) {
  return request({
    url: '/MembershipMovement/Delete',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function GetMembershipMovementByMemberId(query) {
  return request({
    url: '/MembershipMovement/GetMembershipMovementByMemberId',
    method: 'get',
    params: query
  })
}
export function GetMembershipMovementById(query) {
  return request({
    url: '/MembershipMovement/GetMembershipMovementById',
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
export function GetMembershipMovementByMembershipId(query) {
  return request({
    url: '/MembershipMovement/GetMembershipMovementByMembershipId',
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