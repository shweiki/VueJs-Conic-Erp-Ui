import variables from '@/styles/element-variables.scss'
import defaultSettings from '@/Settings'

const {language, showSettings, tagsView, fixedHeader, sidebarLogo
  , defaultpickerOptions, defaulttimeQuery, defaultdatepickerQuery ,sidebarOpen ,loginBackground ,showSidebar ,showNavbar ,CashDrawerCOM} = defaultSettings

const state = {
  theme: variables.theme,
  showSettings: showSettings,
  tagsView: tagsView,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,
  BusinessType: "SuperMarket",
  pickerOptions: defaultpickerOptions,
  timeQuery: defaulttimeQuery,
  datepickerQuery: defaultdatepickerQuery,
  sidebarOpen : sidebarOpen,
  loginBackground : loginBackground,
  showSidebar:showSidebar,
  showNavbar:showNavbar,
  CashDrawerCOM:CashDrawerCOM,
  language:language,
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

