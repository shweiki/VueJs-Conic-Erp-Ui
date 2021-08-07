import request from '@/utils/RequestApi'
import store from '@/store'

export function SendSMS(numberPhone, msg) {
    if (numberPhone.length == 10) {
        numberPhone = numberPhone.slice(1);
    }
    if (numberPhone.length == 9 && store.getters.settings.Sms.baseURLSendSingleMessage)
        return request({
            method: 'get',
            params: {
                numbers: '962' + numberPhone,
                senderid: store.getters.settings.Sms.senderid,
                AccName: store.getters.settings.Sms.AccName,
                AccPass: store.getters.settings.Sms.AccPass,
                msg: msg,
                requesttimeout: 5000000
            },
            baseURL: store.getters.settings.Sms.baseURLSendSingleMessage
        })
    else return false
}
export function SendMultiSMS(numberPhones, msg) {
    numberPhones = numberPhones.map(element => {
        if (element.length == 10) {
            element = element.slice(1);
        }
        return "962" + element;
    });
    let numbers100 = [];
    for (var i = 0; i < numberPhones.length; i++) {
        if (numberPhones.length > 0) {
            numbers100.push(numberPhones.splice(0, 99));
        } else {
            break;
        }
    }
    console.log(numbers100)
    if (store.getters.settings.Sms.baseURLSendBulkMessages)
        numbers100.forEach((element) => {
            request({
                method: 'get',
                params: {
                    numbers: element,
                    senderid: store.getters.settings.Sms.senderid,
                    AccName: store.getters.settings.Sms.AccName,
                    AccPass: store.getters.settings.Sms.AccPass,
                    msg: msg,
                    requesttimeout: 5000000
                },
                baseURL: store.getters.settings.Sms.baseURLSendBulkMessages
            })
        });
    else return false
}