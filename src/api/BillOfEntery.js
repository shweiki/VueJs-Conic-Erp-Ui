import request from '@/utils/RequestApi'
import qs from 'qs';

export function GetByListQ(data) {
  return request({
    url: '/BillOfEntery/GetByListQ',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function GetBillOfEnteryById(query) {
  return request({
    url: '/BillOfEntery/GetBillOfEnteryById',
    method: 'get',
    params: query
  })
}


export function Create(data) {
  return request({
    url: '/BillOfEntery/Create',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function Edit(data) {
  return request({
    url: '/BillOfEntery/Edit',
    method: 'post',
    data: qs.stringify(data)
  })
}
