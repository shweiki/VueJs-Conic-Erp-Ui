import request from '@/utils/RequestApi'
import store from '@/store'

export function SendSMS(number, msg) {
    return request({
        method: 'get',
        params: {
            numbers: '962' + number,
            senderid: store.getters.settings.Sms.senderid,
            AccName: store.getters.settings.Sms.AccName,
            AccPass: store.getters.settings.Sms.AccPass,
            msg: msg,
            requesttimeout: 5000000
        },
        baseURL: 'http://josmsservice.com/smsonline/msgservicejo.cfm'

    })
}