import { GetCompanyInfo } from "@/api/CompanyInfo";

const state = {
    CompanyInfo: {},

}
const mutations = {
    SET_CompanyInfo: (state, response) => {
        state.CompanyInfo = response
    }
}
const actions = {

    GetCompanyInfo({ commit }) {
        return new Promise((resolve, reject) => {
            GetCompanyInfo().then(response => {
                console.log(response)

                commit('SET_CompanyInfo', response)
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