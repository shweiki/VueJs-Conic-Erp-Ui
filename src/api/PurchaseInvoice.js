import request from '@/utils/RequestApi'
import qs from 'qs';
export function GetPurchaseInvoice(query) {
  return request({
    url: '/PurchaseInvoice/GetPurchaseInvoice',
    method: 'get',
    params: query
  })
}
export function GetByListQ(data) {
  return request({
    url: '/PurchaseInvoice/GetByListQ',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function GetPurchaseInvoiceById(query) {
  return request({
    url: '/PurchaseInvoice/GetPurchaseInvoiceById',
    method: 'get',
    params: query
  })
}
export function GetPurchaseItem(query) {
  return request({
    url: '/PurchaseInvoice/GetPurchaseItem',
    method: 'get',
    params: query
  })
}

export function Create(data) {
  return request({
    url: '/PurchaseInvoice/Create',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function Edit(data) {
  return request({
    url: '/PurchaseInvoice/Edit',
    method: 'post',
    data: qs.stringify(data)
  })
}
