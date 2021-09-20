import request from '@/utils/RequestApi'
import qs from 'qs';


export function Create(data) {
  return request({
    url: '/StaticAdjustment/Create',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function GetStaticAdjustmentsById(query) {
  return request({
    url: '/StaticAdjustment/GetStaticAdjustmentsById',
    method: 'get',
    params:  query 
    
  })
}