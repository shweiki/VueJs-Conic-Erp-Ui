import Cookies from 'js-cookie'
import defaultSettings from '@/settings'
import { Edit, GetSetting } from '@/api/Setting'
import store from '@/store'
import { toggleClass } from "@/utils";
import variables from '@/styles/element-variables.scss'

const state = {}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    /* if (Cookies.get(key)) {
       state[key] = JSON.parse(Cookies.get(key) || null)
     } else {
       state[key] = value
     }*/
    state[key] = value
    //  Cookies.set(key, JSON.stringify(value))

    if (key === "theme") {
      variables.theme = value
    }
  }
}
const actions = {
  GetSetting({ commit }) {
    return new Promise((resolve, reject) => {
      GetSetting().then(response => {
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

          /*  if (!Cookies.get(obj.key)) {
              //    console.log(obj.key)
              commit('CHANGE_SETTING', obj)
            }*/
        })
        Object.keys(defaultSettings).forEach(key => {
          if (!state.hasOwnProperty(key)) {
            console.log(defaultSettings[key])
            store.dispatch("settings/changeSetting", {
              key: key,
              value: defaultSettings[key]
            });
          }
        })
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
        value: typeof data.value != "object" ? data.value : JSON.stringify(data.value),
        Type: typeof data.value,
        state: 0,
        Description: JSON.stringify(data)
      }).then(response => {
        commit('CHANGE_SETTING', data)
        store.dispatch("settings/GetSetting");
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })

  },
}
/*const state = {
  theme: JSON.parse(Cookies.get('theme') || null) || defaultSettings["theme"],
  size: JSON.parse(Cookies.get('size') || null) || defaultSettings["size"],
  customtheme: JSON.parse(Cookies.get('customtheme') || null) || defaultSettings["customtheme"],
  showSettings: JSON.parse(Cookies.get('showSettings') || null) || defaultSettings["showSettings"],
  tagsView: JSON.parse(Cookies.get('tagsView') || null) || defaultSettings["tagsView"],
  CashDrawerCOM: JSON.parse(Cookies.get('CashDrawerCOM') || null) || defaultSettings["CashDrawerCOM"],
  fixedHeader: JSON.parse(Cookies.get('fixedHeader') || null) || defaultSettings["fixedHeader"],
  SidebarImage: JSON.parse(Cookies.get('SidebarImage') || null) || defaultSettings["SidebarImage"],
  loginBackground: JSON.parse(Cookies.get('loginBackground') || null) || defaultSettings["loginBackground"],
  showSidebar: JSON.parse(Cookies.get('showSidebar') || null) || defaultSettings["showSidebar"],
  sidebarLogo: JSON.parse(Cookies.get('sidebarLogo') || null) || defaultSettings["sidebarLogo"],
  sidebarOpen: JSON.parse(Cookies.get('sidebarOpen') || null) || defaultSettings["sidebarOpen"],
  showNavbar: JSON.parse(Cookies.get('showNavbar') || null) || defaultSettings["showNavbar"],
  showBarcode: JSON.parse(Cookies.get('showBarcode') || null) || defaultSettings["showBarcode"],
  showRestOfBill: JSON.parse(Cookies.get('showRestOfBill') || null) || defaultSettings["showRestOfBill"],
  BarcodeIsId: JSON.parse(Cookies.get('BarcodeIsId') || null) || defaultSettings["BarcodeIsId"],
  WithOutCheckItemIsExist: JSON.parse(Cookies.get('WithOutCheckItemIsExist') || null) || defaultSettings["WithOutCheckItemIsExist"],
  OrderIsAutomatic: JSON.parse(Cookies.get('OrderIsAutomatic') || null) || defaultSettings["OrderIsAutomatic"],
  ToFixed: JSON.parse(Cookies.get('ToFixed') || null) || defaultSettings["ToFixed"],
  LimitQurey: JSON.parse(Cookies.get('LimitQurey') || null) || defaultSettings["LimitQurey"],
  LimitGetInvoice: JSON.parse(Cookies.get('LimitGetInvoice') || null) || defaultSettings["LimitGetInvoice"],
  PaymentMethods: JSON.parse(Cookies.get('PaymentMethods') || null) || defaultSettings["PaymentMethods"],
  Sms: JSON.parse(Cookies.get('Sms') || null) || defaultSettings["Sms"],
  OutgoingMailServer: JSON.parse(Cookies.get('OutgoingMailServer') || null) || defaultSettings["OutgoingMailServer"],
  errorLog: JSON.parse(Cookies.get('errorLog') || null) || defaultSettings["errorLog"],
  DateTimeFormat: JSON.parse(Cookies.get('DateTimeFormat') || null) || defaultSettings["DateTimeFormat"],
  StatusQuery: JSON.parse(Cookies.get('StatusQuery') || null) || defaultSettings["StatusQuery"],
  Member: JSON.parse(Cookies.get('Member') || null) || defaultSettings["Member"],
  Employee: JSON.parse(Cookies.get('Employee') || null) || defaultSettings["Employee"],
  Dashboard: JSON.parse(Cookies.get('Dashboard') || null) || defaultSettings["Dashboard"],
  PointOfSale: JSON.parse(Cookies.get('PointOfSale') || null) || defaultSettings["PointOfSale"],
  Purchase: JSON.parse(Cookies.get('Purchase') || null) || defaultSettings["Purchase"],
  CashPoolLayout: JSON.parse(Cookies.get('CashPoolLayout') || null) || defaultSettings["CashPoolLayout"],
  WorkShopLayout: JSON.parse(Cookies.get('WorkShopLayout') || null) || defaultSettings["WorkShopLayout"],
  Payment: JSON.parse(Cookies.get('Payment') || null) || defaultSettings["Payment"],
  Receive: JSON.parse(Cookies.get('Receive') || null) || defaultSettings["Receive"],
  MembershipMovement: JSON.parse(Cookies.get('MembershipMovement') || null) || defaultSettings["MembershipMovement"],
  Visit: JSON.parse(Cookies.get('Visit') || null) || defaultSettings["Visit"],
  timeQuery: JSON.parse(Cookies.get('timeQuery') || null) || defaultSettings["timeQuery"],
  printers: JSON.parse(Cookies.get('printers') || null) || defaultSettings["printers"],
  triger: JSON.parse(Cookies.get('triger') || null) || defaultSettings["triger"],
  windowStyle: JSON.parse(Cookies.get('windowStyle') || null) || defaultSettings["windowStyle"],
  pickerOptions: JSON.parse(Cookies.get('pickerOptions') || null) || defaultSettings["pickerOptions"],
  ItemMoveDec: JSON.parse(Cookies.get('ItemMoveDec') || null) || defaultSettings["ItemMoveDec"]
}*/
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
