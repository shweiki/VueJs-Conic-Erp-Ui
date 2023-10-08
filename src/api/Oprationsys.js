import request from '@/utils/requestApi'
import qs from 'qs';
export function GetOpration(query) {
  return request({
    url: '/Oprationsys/GetOpration',
    method: 'get',
    params: query
  })
}
export function GetOprationByTable(data) {
  return request({
    url: '/Oprationsys/GetOprationByTable',
    method: 'get',
    params: data
  })
}
export function GetOprationByStatusTable(data) {
  return request({
    url: '/Oprationsys/GetOprationByStatusTable',
    method: 'get',
    params: data
  })
}
export function GetNextOprationByStatusTable(data) {
  return request({
    url: '/Oprationsys/GetNextOprationByStatusTable',
    method: 'get',
    params: data
  })
}
export function ChangeObjStatusByTableName(data) {
  return request({
    url: '/Oprationsys/ChangeObjStatusByTableName',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function ChangeObjStatus(data) {
  return request({
    url: '/Oprationsys/ChangeObjStatus',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function ChangeArrObjStatus(data) {
  return request({
    url: '/Oprationsys/ChangeArrObjStatus',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function Create(data) {
  return request({
    url: '/Oprationsys/Create',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function Edit(data) {
  return request({
    url: '/Oprationsys/Edit',
    method: 'post',
    data: qs.stringify(data)
  })
}