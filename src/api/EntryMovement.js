import request from '@/utils/RequestApi'
import qs from 'qs';

export function Create(data) {
  return request({
    url: '/EntryMovement/Create',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function GetEntryMovementsByAccountId(query) {
  return request({
    url: '/EntryMovement/GetEntryMovementsByAccountId',
    method: 'get',
    params: query
  })
}
