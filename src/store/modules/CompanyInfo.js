import { GetCompanyInfo } from "@/api/CompanyInfo";
import { GetOpration } from "@/api/Oprationsys";

const state = {
    CompanyInfo: {},
    Oprations: []

}
const mutations = {
    SET_CompanyInfo: (state, response) => {
        state.CompanyInfo = response
    },
    SET_GetOpration: (state, response) => {
        state.Oprations = response
    },
}
const actions = {

    GetCompanyInfo({ commit }) {
        return new Promise((resolve, reject) => {
            GetCompanyInfo().then(response => {
                //   console.log(response)

                commit('SET_CompanyInfo', response)
                resolve(response)

            }).catch(error => {
                reject(error)
            })
        })
    },
    GetOpration({ commit }) {
        return new Promise((resolve, reject) => {
            GetOpration().then(response => {
                commit('SET_GetOpration', response)
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