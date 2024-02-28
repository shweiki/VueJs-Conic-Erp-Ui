import request from '@/utils/requestApi'
import qs from 'qs'
export function GetWorkShop(query) {
    return request({
        url: '/WorkShop/GetWorkShop',
        method: 'get',
        params: query
    })
}
export function GetByListQ(data) {
    return request({
        url: '/WorkShop/GetByListQ',
        method: 'post',
        data: qs.stringify(data)
    })
}

export function GetWorkShopById(query) {
    return request({
        url: '/WorkShop/GetWorkShopById',
        method: 'get',
        params: query
    })
}
export function GetByItem(query) {
    return request({
        url: '/WorkShop/GetByItem',
        method: 'get',
        params: query
    })
}

export function Create(data) {
    return request({
        url: '/WorkShop/Create',
        method: 'post',
        data: qs.stringify(data)
    })
}

export function Edit(data) {
    return request({
        url: '/WorkShop/Edit',
        method: 'post',
        data: qs.stringify(data)
    })
}
