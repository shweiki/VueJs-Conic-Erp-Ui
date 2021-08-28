import defaultSettings from '@/settings'
import { Edit, GetSetting } from '@/api/Setting'
import store from '@/store'
import { toggleClass } from "@/utils";

let Settings = {}

const state = defaultSettings

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
                //  console.log(response.length, Object.keys(defaultSettings).length)
                if (response.length != Object.keys(defaultSettings).length) actions.SetSettingDefault(response)
                else {
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
                        if (obj.key === "customtheme" && obj.value) {
                            toggleClass(document.body, "custom-theme")
                        }

                        commit('CHANGE_SETTING', obj)
                    })
                }
                resolve(response)

            }).catch(error => {
                console.log("response")
                reject(error)
            })
        })
    },
    changeSetting({ commit }, data) {
        return new Promise((resolve, reject) => {
            console.log("setting data",data)
            Edit({
                Id: 0,
                Name: data.key,
                value: typeof data.value !="object"? data.value : JSON.stringify(data.value),
                Type: typeof data.value,
                state: 0,
                Description: JSON.stringify(data)
            }).then(response => {
                //  console.log(response)
                commit('CHANGE_SETTING', data)

                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })

    },
    SetSettingDefault(DBSettings) {
        Object.keys(defaultSettings).forEach(key => {
            const found = DBSettings.find(
                element => element.Name == key
            );
            if (!found) {
                store.dispatch("settings/changeSetting", {
                    key: key,
                    value: defaultSettings['' + key + '']
                });
                location.reload()
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