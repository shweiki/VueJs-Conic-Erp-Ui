import request from '@/utils/RequestApi'
import qs from 'qs';


export function Create(data) {
  return request({
    url: '/SalaryAdjustmentLog/Create',
    method: 'post',
    data: qs.stringify(data)
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