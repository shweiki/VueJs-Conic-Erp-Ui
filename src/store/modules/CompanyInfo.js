import { GetCompanyInfo } from '@/api/CompanyInfo'
import { GetOpration } from '@/api/Oprationsys'

const state = {
  CompanyInfo: {},
  Oprations: []
}
const mutations = {
  SET_CompanyInfo: (state, response) => {
    localStorage.setItem('CompanyInfo', JSON.stringify(response))
    state.CompanyInfo = response
  },
  SET_GetOpration: (state, response) => {
    localStorage.setItem('Oprations', JSON.stringify(response))
    state.Oprations = response
  }
}
const actions = {
  GetCompanyInfo({ commit }) {
    return new Promise((resolve, reject) => {
      var companyInfo = JSON.parse(localStorage.getItem('CompanyInfo') || null)
      if (companyInfo) {
        commit('SET_CompanyInfo', companyInfo)
        resolve(companyInfo)
      } else {
        GetCompanyInfo().then(response => {
          commit('SET_CompanyInfo', response)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      }
    })
  },
  GetOpration({ commit }) {
    return new Promise((resolve, reject) => {
      var opration = JSON.parse(localStorage.getItem('Oprations') || null)
      if (opration) {
        commit('SET_GetOpration', opration)
        resolve(opration)
      } else {
        GetOpration().then(response => {
          commit('SET_GetOpration', response)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      }
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
