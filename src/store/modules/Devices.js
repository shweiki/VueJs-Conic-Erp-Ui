import { FeelDevice } from "@/api/Device";

const state = {
    FeelDevice: true
}
const mutations = {
    SET_FEEl_DEVICE: (state, response) => {
        state.FeelDevice = !response
    }
}
const actions = {
    FeelDevice({ commit }) {
        return new Promise((resolve, reject) => {
            FeelDevice().then(response => {
                commit('SET_FEEl_DEVICE', response)
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