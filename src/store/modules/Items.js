import { GetItem, GetActiveItem } from "@/api/Item";

const state = {
    AllItems: [],
    ActiveItems: []

}
const mutations = {
    SET_ALLITEMS: (state, response) => {
        state.AllItems = response.reverse()
    },
    SET_ACTIVEITEMS: (state, response) => {
        state.ActiveItems = response.reverse()
    }
}
const actions = {

    GetItem({ commit }) {
        return new Promise((resolve, reject) => {
            GetItem().then(response => {
                console.log(response)

                commit('SET_ALLITEMS', response)
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

                commit('SET_ACTIVEITEMS', response)
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