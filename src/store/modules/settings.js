import defaultSettings from '@/Settings'
import { Edit, GetSetting } from '@/api/Setting'
import store from '@/store'
let Settings = {}
const {WithOutCheckItemIsExist,  errorLog, theme, size, title, BusinessType, language, showSettings, tagsView, fixedHeader, sidebarLogo
  , showBarcode, pickerOptions, timeQuery, datepickerQuery, sidebarOpen, loginBackground, showSidebar, showNavbar, CashDrawerCOM } = Settings

const state = {
  title: title,
  theme: theme,
  language: language,
  size: size,
  showSettings: showSettings,
  BusinessType: BusinessType,
  tagsView: tagsView,
  CashDrawerCOM: CashDrawerCOM,
  fixedHeader: fixedHeader,
  loginBackground: loginBackground,
  showSidebar: showSidebar,
  sidebarLogo: sidebarLogo,
  sidebarOpen: sidebarOpen,
  showNavbar: showNavbar,
  showBarcode: showBarcode,
  WithOutCheckItemIsExist : WithOutCheckItemIsExist,
  errorLog: errorLog,
  datepickerQuery: datepickerQuery,
  timeQuery: timeQuery,
  pickerOptions: pickerOptions
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
        console.log(response.length , Object.keys(defaultSettings).length)
        if (response.length != Object.keys(defaultSettings).length
        ) actions.SetSettingDefault(response)

        response.map(x => {
          var obj = JSON.parse(x.Description);
          if (obj.key === "pickerOptions") {
            obj.value.shortcuts.map(OP => {
              OP.onClick = function (picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * OP.days);
                picker.$emit("pick", [start, end]);
              }
            })
          }
          commit('CHANGE_SETTING', obj)
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

