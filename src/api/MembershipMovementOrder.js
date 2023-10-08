import request from '@/utils/requestApi'
import qs from 'qs';

export function Create(data) {
  return request({
    url: '/MembershipMovementOrder/Create',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function Edit(data) {
  return request({
    url: '/MembershipMovementOrder/Edit',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function CreateMulti(data) {
  return request({
    url: '/MembershipMovementOrder/CreateMulti',
    method: 'post',
    data: qs.stringify(data)
  })
}
 export function Delete(data) {
  return request({
    url: '/MembershipMovementOrder/Delete',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function GetById(query) {
  return request({
    url: '/MembershipMovementOrder/GetById',
    method: 'get',
    params: query
  })
}
export function GetMembershipMovementOrderByMemberShipID(query) {
  return request({
    url: '/MembershipMovementOrder/GetMembershipMovementOrderByMemberShipID',
    method: 'get',
    params: query
  })
}
export function GetMembershipMovementOrderByStatus(query) {
  return request({
    url: '/MembershipMovementOrder/GetMembershipMovementOrderByStatus',
    method: 'get',
    params: query
  })
}
