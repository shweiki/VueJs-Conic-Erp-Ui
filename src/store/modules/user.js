import { login, logout, getInfo } from '@/api/User'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  Id: '',
  name: '',
  phone: '',
  avatar: '',
  introduction: '',
  roles: [],
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_ID: (state, Id) => {
    state.Id = Id
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_PHONE: (state, phone) => {
    state.phone = phone
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, rememberme } = userInfo
    return new Promise((resolve, reject) => {
      login({ Username: username.trim(), Password: password, RememberMe: rememberme }).then(response => {
        const data = response
        console.log("login", data)

        if (!response || response == 'User account locked out.' || response =='User Name Or PassWord Is Not Correct') {
          reject(response)
        }
        commit('SET_TOKEN', data.token_type + " " + data.access_token)
        setToken(data.token_type + " " + data.access_token)
        resolve()
      }).catch(error => {
        console.log("login", response)

        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      //console.log( 'HI : '+ state.token);
      getInfo().then(response => {
        const data = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { Id, phone, roles, name, avatar, introduction } = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', roles)
        commit('SET_ID', Id)
        commit('SET_NAME', name)
        commit('SET_PHONE', phone)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles, userrouter } = await dispatch('getInfo')
      roles.userrouter = userrouter
      resetRouter()
      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
      console.log("here 2 ", accessRoutes)

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
