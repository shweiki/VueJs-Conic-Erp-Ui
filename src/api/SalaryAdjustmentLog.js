import request from '@/utils/requestApi'
import qs from 'qs'


export function Create(data) {
  return request({
    url: '/SalaryAdjustmentLog/Create',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function Edit(data) {
  return request({
    url: '/SalaryAdjustmentLog/Edit',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function Delete(data) {
  return request({
    url: '/SalaryAdjustmentLog/Delete',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function GetById(query) {
  return request({
    url: '/SalaryAdjustmentLog/GetById',
    method: 'get',
    params:  query
  })
}
export function GetWorkingAdjustmentBySalaryId(query) {
  return request({
    url: '/SalaryAdjustmentLog/GetSalaryAdjustmentLogBySalaryId',
    method: 'get',
    params:  query

  })
}
export function GetByListQ(data) {
  return request({
    url: '/SalaryAdjustmentLog/GetByListQ',
    method: 'post',
    data: qs.stringify(data)
  })
}
