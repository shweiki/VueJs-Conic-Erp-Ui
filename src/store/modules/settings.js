import variables from '@/styles/element-variables.scss'
import defaultSettings from '@/Settings'
import { Edit , GetSetting } from '@/api/Setting'
GetSetting().then(response => {
  defaultSettings = response;
})
const {BusinessType, language, showSettings, tagsView, fixedHeader, sidebarLogo
  , defaultpickerOptions, defaulttimeQuery, defaultdatepickerQuery, sidebarOpen, loginBackground, showSidebar, showNavbar, CashDrawerCOM } = defaultSettings

const state = {
  theme: variables.theme,
  showSettings: showSettings,
  tagsView: tagsView,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,
  BusinessType: BusinessType,
  pickerOptions: defaultpickerOptions,
  timeQuery: defaulttimeQuery,
  datepickerQuery: defaultdatepickerQuery,
  sidebarOpen: sidebarOpen,
  loginBackground: loginBackground,
  showSidebar: showSidebar,
  showNavbar: showNavbar,
  CashDrawerCOM: CashDrawerCOM,
  language: language,
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
    Edit({
      Id: 0,
      Name: data.key,
      value: data.value,
      Type: typeof data.value,
      state: 0,
      Description: JSON.stringify(data)
    }).then(response => {
      console.log(response)

      // resolve(response)

    }).catch(error => {
      reject(error)
    })
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

