import request from '@/utils/RequestApi'
import qs from 'qs';
export function GetCompanyInfo(query) {
  return request({
    url: '/CompanyInfo/GetCompanyInfo',
    method: 'get',
    params: query
  })
}

export function Edit(data) {
  return request({
    url: '/CompanyInfo/EditCompanyInfo',
    method: 'post',
    data: qs.stringify(data)
  })
}