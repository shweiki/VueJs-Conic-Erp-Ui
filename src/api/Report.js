import request from '@/utils/RequestApi'
import qs from 'qs';

export function GetReport(query) {
  return request({
    url: '/Report/GetReport',
    method: 'get',
    params: query
  })
}
export function GetByListQ(data) {
  return request({
    url: '/Report/GetByListQ',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function GetReportByID(query) {
  return request({
    url: '/Report/GetReportByID',
    method: 'get',
    params: query
  })
}


export function Create(data) {
  return request({
    url: '/Report/Create',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function Edit(data) {
  return request({
    url: '/Report/Edit',
    method: 'post',
    data: qs.stringify(data)
  })
}
