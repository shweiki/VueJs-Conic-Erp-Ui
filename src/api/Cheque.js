import request from '@/utils/requestApi'
import qs from 'qs'
export function GetCheques(query) {
  return request({
    url: '/Cheques/GetCheques',
    method: 'get',
    params: query
  })
}


export function Create(data) {
  return request({
    url: '/Cheques/Create',
    method: 'post',
    data: qs.stringify(data)
  })
}

