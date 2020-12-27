import variables from '@/styles/element-variables.scss'
import defaultSettings from '@/Settings'
import { Edit, GetSetting } from '@/api/Setting'
import store from '@/store'

let Settings = {}
const {size, title, BusinessType, language, showSettings, tagsView, fixedHeader, sidebarLogo
  , defaultpickerOptions, defaulttimeQuery, defaultdatepickerQuery, sidebarOpen, loginBackground, showSidebar, showNavbar, CashDrawerCOM } = Settings

const state = {
  title: title,
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
  size : size
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }
}

const actions = {
  GetSetting({ commit }) {
    return new Promise((resolve, reject) => {
      GetSetting().then(response => {
        if (response.length != Object.keys(defaultSettings).length
        ) actions.SetSettingDefault(response)

        response.map(x => {
          commit('CHANGE_SETTING', {
            key: x.Name,
            value: (x.Type != "string" ? JSON.parse(x.Value) : x.Value)
          })
        })

        resolve(response)

      }).catch(error => {
        reject(error)
      })
    })
  },
  changeSetting({ commit }, data) {
    Edit({
      Id: 0,
      Name: data.key,
      value: (typeof data.value == 'object' ? JSON.stringify(data.value) : data.value),
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
  },
  SetSettingDefault(DBSettings) {
    Object.keys(defaultSettings).map(key => {
      const found = DBSettings.find(
        element => element.Name == key
      );
      if (!found) store.dispatch("Settings/changeSetting", {
        key: key,
        value: defaultSettings['' + key + '']
      });
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

