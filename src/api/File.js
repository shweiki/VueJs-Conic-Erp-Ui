import request from '@/utils/RequestApi'
import qs from 'qs';


export function Create(data) {
  return request({
    url: '/Files/Create',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function GetFileByObjId(query) {
  return request({
    url: '/Files/GetFileByObjId',
    method: 'get',
    params:  query 
    
  })
}
