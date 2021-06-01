import defaultSettings from '@/settings'
import { Edit, GetSetting } from '@/api/Setting'
import store from '@/store'
import { toggleClass } from "@/utils";

let Settings = {}

const state = {
  title: defaultSettings.title,
  theme: defaultSettings.theme,
  customtheme: defaultSettings.customtheme,
  language: defaultSettings.language,
  size: defaultSettings.size,
  showSettings: defaultSettings.showSettings,
  BusinessType: defaultSettings.BusinessType,
  tagsView: defaultSettings.tagsView,
  CashDrawerCOM: defaultSettings.CashDrawerCOM,
  fixedHeader: defaultSettings.fixedHeader,
  SidebarImage: defaultSettings.SidebarImage,
  loginBackground: defaultSettings.loginBackground,
  showSidebar: defaultSettings.showSidebar,
  sidebarLogo: defaultSettings.sidebarLogo,
  sidebarOpen: defaultSettings.sidebarOpen,
  showNavbar: defaultSettings.showNavbar,
  showBarcode: defaultSettings.showBarcode,
  showRestOfBill: defaultSettings.showRestOfBill,
  BarcodeIsId: defaultSettings.BarcodeIsID,
  WithOutCheckItemIsExist: defaultSettings.WithOutCheckItemIsExist,
  errorLog: defaultSettings.errorLog,
  StatusQuery: defaultSettings.StatusQuery,
  DateTimeFormat: defaultSettings.DateTimeFormat,
  DateFormat: defaultSettings.DateFormat,
  datepickerQuery: defaultSettings.datepickerQuery,
  timeQuery: defaultSettings.timeQuery,
  pickerOptions: defaultSettings.pickerOptions,
  PointOfSaleLayout: defaultSettings.PointOfSaleLayout,
  ToFixed: defaultSettings.ToFixed,
  LimitQurey: defaultSettings.LimitQurey,
  triger: defaultSettings.triger,
  windowStyle: defaultSettings.windowStyle,
  LimitGetInvoice: defaultSettings.LimitGetInvoice,
  ItemMoveDec: defaultSettings.ItemMoveDec,
  printers: defaultSettings.printers
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
        //  console.log(response.length, Object.keys(defaultSettings).length)
        if (response.length != Object.keys(defaultSettings).length
        ) actions.SetSettingDefault(response)
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
            } if (obj.key === "customtheme" && obj.value) {
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
      Edit({
        Id: 0,
        Name: data.key,
        value: data.value,
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

