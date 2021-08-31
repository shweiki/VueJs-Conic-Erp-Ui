import request from '@/utils/RequestApi'
import qs from 'qs';

export function GetByListQ(data) {
  return request({
    url: '/SaleInvoice/GetByListQ',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function GetByAny(data) {
  return request({
    url: '/SaleInvoice/GetByAny',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function GetByItem(query) {
  return request({
    url: '/SaleInvoice/GetByItem',
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
export function EditPaymentMethod(data) {
  return request({
    url: '/SaleInvoice/EditPaymentMethod',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function GetSaleInvoiceById(query) {
  return request({
    url: '/SaleInvoice/GetSaleInvoiceById',
    method: 'get',
    params: query
  })
}
export function GetSaleInvoiceByListId(query) {
  return request({
    url: '/SaleInvoice/GetSaleInvoiceByListId',
    method: 'get',
    params: query
  })
}
export function GetSaleInvoiceByVendorId(query) {
  return request({
    url: '/SaleInvoice/GetSaleInvoiceByVendorId',
    method: 'get',
    params: query
  })
}
export function GetSaleInvoiceByMemberId(query) {
  return request({
    url: '/SaleInvoice/GetSaleInvoiceByMemberId',
    method: 'get',
    params: query
  })
}

