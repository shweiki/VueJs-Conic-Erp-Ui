import { GetUserLog, GetDevice, CheckDevice } from "@/api/Device";

const state = {
    AllDevices: [],
    ZtkDoor : true

}
const mutations = {
    SET_Devices: (state, response) => {
        state.AllDevices = response
    },
    SET_ZtkDoor: (state, response) => {
        state.ZtkDoor = !response
    }
}
const actions = {

    GetDevice({ commit }) {
        return new Promise((resolve, reject) => {
            GetDevice().then(response => {
                console.log(response)

                commit('SET_Devices', response)
                resolve(response)

            }).catch(error => {
                reject(error)
            })
        })
    },
    ConnectZtkDoor({ commit }) {
        return new Promise((resolve, reject) => {
            CheckDevice({ ID:3 }).then(response => {
                console.log(response)
                commit('SET_ZtkDoor', response)

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