import { GetItem, GetActiveItem } from "@/api/Item";

const state = {
    AllItems: [],
    ActiveItems: []

}
const mutations = {
    SET_ALLItem: (state, response) => {
        state.AllItems = response.reverse()
    },
    SET_ACTIVEItem: (state, response) => {
        state.ActiveItems = response.reverse()
    }
}
const actions = {

    GetItem({ commit }) {
        return new Promise((resolve, reject) => {
            GetItem().then(response => {
                console.log(response)

                commit('SET_ALLItem', response)
                resolve(response)

            }).catch(error => {
                reject(error)
            })
        })
    },
    GetActiveItem({ commit }) {
        return new Promise((resolve, reject) => {
            GetActiveItem().then(response => {
                console.log(response)

                commit('SET_ACTIVEItem', response)
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