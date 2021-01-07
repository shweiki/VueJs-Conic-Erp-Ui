import { GetMember, GetActiveMember, CheckMembers } from "@/api/Member";
import { CheckMembershipMovement } from "@/api/MembershipMovement";
import { CheckMemberLog, GetMemberLogByStatus } from "@/api/MemberLog";


const state = {
    AllMembers: [],
    ActiveMembers: [],

}

const mutations = {
    SET_ALLMEMBERS: (state, response) => {
        state.AllMembers = response.reverse()
    },
    SET_ACTIVEMEMBER: (state, response) => {
        state.ActiveMembers = response.reverse()
    }
}
const actions = {

    CheckMembers() {
        return new Promise((resolve, reject) => {

            CheckMembershipMovement().then(response => {
                console.log(response)
                CheckMemberLog().then(response => {
                    console.log(response)

                    resolve(response)

                }).catch(error => {
                    reject(error)
                })
                resolve(response)
                CheckMembers().then(response => {
                    console.log(response)

                    resolve(response)

                }).catch(error => {
                    reject(error)
                })

            }).catch(error => {
                reject(error)
            })
        })
    },
    GetMember({ commit }) {
        return new Promise((resolve, reject) => {
            GetMember().then(response => {
                console.log(response)

                commit('SET_ALLMEMBERS', response)
                resolve(response)

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