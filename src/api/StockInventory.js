import request from '@/utils/requestApi'
import qs from 'qs'
export function GetStockInventory(query) {
  return request({
    url: '/StockInventory/GetStockInventory',
    method: 'get',
    params: query
  })
}

export function Create(data) {
  return request({
    url: '/StockInventory/Create',
    method: 'post',
    data: qs.stringify(data)
  })
}
