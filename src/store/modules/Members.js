import { GetActiveMember, CheckMembers } from "@/api/Member";
import { CheckDeviceLog } from "@/api/DeviceLog";
import { Notification } from 'element-ui';

import store from '@/store'

const state = {
    Members: [],
    ActiveMembers: [],

}
const mutations = {
    SET_ACTIVEMEMBER: (state, response) => {
        state.ActiveMembers = response.reverse()
    }
}
const actions = {
    CheckMembers() {
        return new Promise((resolve, reject) => {
            Notification.success({
                type: 'info',
                title: 'Info',
                message: 'بدء النظام في عملية فحص المشتركين ',
                showClose: false,
                duration: 5000
            });
            CheckMembers().then(response => {
                    CheckDeviceLog().then(response => {
                        store.state.settings.triger.CheckMembers.LastRun = "" + Date() + ""
                        store.dispatch("settings/changeSetting", {
                            key: "triger",
                            value: store.getters.settings.triger,
                        });
                        Notification.success({
                            type: 'success',
                            title: 'Info',
                            message: 'تم انتهاء من عملية فحص المشتركين ',
                            showClose: false,
                            duration: 5000
                        });
                        resolve(response)
                    }).catch(error => {
                        reject(error)
                    })
            }).catch(error => {
                reject(error)
            })
        })
    },
    GetActiveMember({ commit }) {
        return new Promise((resolve, reject) => {
            GetActiveMember().then(response => {
                console.log(response)

                commit('SET_ACTIVEMEMBER', response)
                resolve(response)

            }).catch(error => {
                reject(error)
            })
        })
    }
}
export default {
    namespaced: true,
    state,
    mutations,
    actions

}