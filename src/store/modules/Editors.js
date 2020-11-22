import { GetEditorsUser } from "@/api/EditorsUser";

const state = {
    Editors: [],

}
const mutations = {
    SET_Editors: (state, response) => {
        state.Editors = response
    }
}
const actions = {

    GetEditorsUser({ commit }) {
        return new Promise((resolve, reject) => {
            GetEditorsUser().then(response => {
                console.log(response)

                commit('SET_Editors', response)
                resolve(response)

            }).catch(error => {
                reject(error)
            })
           
        })
    },



}

export default {
    namespaced: true,
    state,
    mutations,
    actions

}