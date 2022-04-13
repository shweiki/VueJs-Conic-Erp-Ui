import Cookies from 'js-cookie'
import JSPM from "jsprintmanager";
import store from '@/store'
const state = {
  baseUrl : window.location.protocol + "//" + window.location.host + "/",
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop',
  size: Cookies.get('size'),
  printers: []
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  SET_LANGUAGE: (state, language) => {
    state.language = language
    Cookies.set('language', language)
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_SIZE: (state, size) => {
    state.size = size
    Cookies.set('size', size)
  },
  SET_PRINTERS: (state, printers) => {
    state.printers = printers
    store.dispatch("settings/changeSetting", {
      key: "printers",
      value: printers,
    });
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setLanguage({ commit }, language) {
    commit('SET_LANGUAGE', language)
  },
  setSize({ commit }, size) {
    commit('SET_SIZE', size)
  },
  setPrinters({ commit }) {
    return new Promise((resolve, reject) => {
      if (JSPM.JSPrintManager.websocket_status == JSPM.WSStatus.Open) {
        JSPM.JSPrintManager.getPrinters()
          .then((myPrinters) => {
            commit('SET_PRINTERS', myPrinters)
            resolve(myPrinters);
          })
          .catch(e => reject(e));
      } else {
        console.warn("JSPM WS not open");
        //   commit('SET_PRINTERS', printers)

        resolve(myPrinters);
      }
    });
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
