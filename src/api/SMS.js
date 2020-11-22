import request from '@/utils/RequestApi'

export function SendSMS(number, msg) {
    return request({
        method: 'get',
        params: {
            numbers: '962' + number,
            senderid: 'High Fit',
            AccName: 'highfit',
            AccPass: 'D7!cT5!SgU0',
            msg: msg,
            requesttimeout: 5000000
        },
        baseURL: 'http://josmsservice.com/smsonline/msgservicejo.cfm'

    })
}