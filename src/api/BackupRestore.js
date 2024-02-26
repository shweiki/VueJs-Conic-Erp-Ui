import request from '@/utils/requestApi'
import qs from 'qs'
export function GetBackUp(query) {
  return request({
    url: '/BackupRestore/GetBackUp',
    method: 'get',
    params: query
  })
}
export function BackUp(query) {
  return request({
    url: '/BackupRestore/BackUp',
    method: 'get',
    params: query
  })
}
export function Restore(query) {
  return request({
    url: '/BackupRestore/Restore',
    method: 'get',
    params: query
  })
}
