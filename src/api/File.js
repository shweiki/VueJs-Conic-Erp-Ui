import request from '@/utils/RequestApi'
import qs from 'qs';


export function Create(data) {
  return request({
    url: '/Files/Create',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function SetTypeByObjId(data) {
  return request({
    url: '/Files/SetTypeByObjId',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function GetProfilePictureByObjId(query) {
  return request({
    url: '/Files/GetProfilePictureByObjId',
    method: 'get',
    params:  query 
    
  })
}
export function GetFileByObjId(query) {
  return request({
    url: '/Files/GetFileByObjId',
    method: 'get',
    params:  query 
    
  })
}
export function GetFilesByObjId(query) {
  return request({
    url: '/Files/GetFilesByObjId',
    method: 'get',
    params:  query 
    
  })
}
