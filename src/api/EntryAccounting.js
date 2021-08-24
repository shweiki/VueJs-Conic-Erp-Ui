import request from '@/utils/RequestApi'
import qs from 'qs';

export function GetEntryAccounting(query) {
    return request({
        url: '/EntryAccounting/GetEntryAccounting',
        method: 'get',
        params: query
    })
}
export function GetByListQ(data) {
    return request({
        url: '/EntryAccounting/GetByListQ',
        method: 'post',
        data: qs.stringify(data)
    })
}
export function GetEntryById(query) {
    return request({
        url: '/EntryAccounting/GetEntryById',
        method: 'get',
        params: query
    })
}
export function Edit(data) {
    return request({
        url: '/EntryAccounting/Edit',
        method: 'post',
        data: qs.stringify(data)
    })
}
export function CreateEntry(data) {
    return request({
        url: '/EntryAccounting/Create',
        method: 'post',
        data: qs.stringify(data)
    })
}