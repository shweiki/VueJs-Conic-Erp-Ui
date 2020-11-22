import request from '@/utils/RequestApi'
import qs from 'qs';
export function GetEntryAccounting(query) {
  return request({
    url: '/EntryAccounting/GetEntryAccounting',
    method: 'get',
    params: query
  })
}


export function CreateEntry(data) {
  return request({
    url: '/EntryAccounting/Create',
    method: 'post',
    data: qs.stringify(data)
  })
}
