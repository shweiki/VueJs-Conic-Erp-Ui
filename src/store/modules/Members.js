import { GetMember, GetActiveMember, CheckMembers } from "@/api/Member";
import { CheckMembershipMovement } from "@/api/MembershipMovement";
import { CheckMemberLog, GetMemberLogByStatus } from "@/api/MemberLog";
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
            CheckMembers().then(response => {
                CheckMembershipMovement().then(response => {
                    CheckMemberLog().then(response => {
                        store.state.settings.triger.CheckMembers.LastRun = "" + Date() + ""
                        store.dispatch("settings/changeSetting", {
                            key: "triger",
                            value: store.getters.settings.triger,
                        });
                        resolve(response)
                    }).catch(error => {
                        reject(error)
                    })
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