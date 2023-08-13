import defaultSettings from '@/settings'
import { Edit, GetSetting } from '@/api/Setting'
import store from '@/store'
import { toggleClass } from "@/utils";
import variables from '@/styles/element-variables.scss'

const state = {}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {

    state[key] = value

    if (key === "theme") {
      variables.theme = value
    }
  }
}
const actions = {
  GetSetting({ commit }) {
    return new Promise((resolve, reject) => {
      var setting = JSON.parse(localStorage.getItem("Application_Setting") || "null") || null;
      if (setting && setting !== {}) {
        Object.keys(setting).forEach(key => {
          commit('CHANGE_SETTING', {
            key: key,
            value: setting[key]
          });
        })
        resolve(setting)

      } else {
        GetSetting().then(response => {
          localStorage.removeItem("Application_Setting")
          if (response.length > 0) {
            response.map(x => {
              let obj = JSON.parse(x.Description);
              if (obj.key === "pickerOptions") {
                obj.value.shortcuts.map(OP => {
                  OP.onClick = function (picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * OP.days);
                    picker.$emit("pick", [start.setHours(0, 0, 0, 0), end.setHours(23, 59, 59, 999)]);
                  }
                })
              }
              if (obj.key === "customtheme" && obj.value) {
                toggleClass(document.body, "custom-theme")
              }
              commit('CHANGE_SETTING', obj)
            })
          }
          Object.keys(defaultSettings).forEach(key => {
            if (!state.hasOwnProperty(key)) {
              store.dispatch("settings/changeSetting", {
                key: key,
                value: defaultSettings[key]
              });
            }

            localStorage.setItem("Application_Setting", JSON.stringify(state))
            resolve(response)
          }).catch(error => {
            localStorage.removeItem("Application_Setting")
            console.log(error)
            reject(error)
          })
        })
      }
    })
  },
  changeSetting({ commit }, data) {
    return new Promise((resolve, reject) => {
      Edit({
        Id: 0,
        Name: data.key,
        value: typeof data.value != "object" ? data.value : JSON.stringify(data.value),
        Type: typeof data.value,
        state: 0,
        Description: JSON.stringify(data)
      }).then(response => {
        commit('CHANGE_SETTING', data)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })

  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
