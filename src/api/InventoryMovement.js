import request from '@/utils/RequestApi'
import qs from 'qs';


export function GetInventoryMovementsBySalesInvoiceId(query) {
    return request({
        url: '/InventoryMovement/GetInventoryMovementsBySalesInvoiceId',
        method: 'get',
        params: query
    })
}