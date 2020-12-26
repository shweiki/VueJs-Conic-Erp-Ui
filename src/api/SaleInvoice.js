import request from '@/utils/RequestApi'
import qs from 'qs';
export function GetSaleInvoice(query) {
  return request({
    url: '/SaleInvoice/GetSaleInvoice',
    method: 'get',
    params: query
  })
}

export function GetSaleItem(query) {
  return request({
    url: '/SaleInvoice/GetSaleItem',
    method: 'get',
    params: query
  })
}

export function GetSaleInvoiceByStatus(query) {
  return request({
    url: '/SaleInvoice/GetSaleInvoiceByStatus',
    method: 'get',
    params: query
  })
}

export function Create(data) {
  return request({
    url: '/SaleInvoice/Create',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function Edit(data) {
  return request({
    url: '/SaleInvoice/Edit',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function GetSaleInvoiceByID(query) {
  return request({
    url: '/SaleInvoice/GetSaleInvoiceByID',
    method: 'get',
    params: query
  })
}
