import Vue from 'vue'
import Cookies from 'js-cookie'
import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import Element from 'element-ui'
import './styles/element-variables.scss'
import '@/styles/index.scss' // global css
import App from './App'
import store from './store'
import router from './router'
import i18n from './lang' // internationalization
import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log
import * as filters from './filters' // global filters
import VueCurrencyInput from 'vue-currency-input'
import VueBarcodeScanner from 'vue-barcode-scanner'
import OpenCashSound from '@/assets/Sounds/PointOfSaleOpenCashDrawer.wav'
import BarCodeSound from '@/assets/Sounds/BarCode.wav'
import * as moment from 'moment';
import 'moment/locale/pt-br';

moment.locale('en');



store.dispatch("settings/GetSetting");

const pluginOptions = {
  /* see config reference */
  globalOptions: { currency: 'JOD' },
}
Vue.use(VueCurrencyInput, pluginOptions)
Vue.use(Element, {
  size: Cookies.get('size') || 'mini', // store.getters.settings.size, // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})
// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
Vue.config.productionTip = false

let options = {
  sound: true, // default is false
  soundSrc: BarCodeSound, // default is blank
  sensitivity: 300, // default is 100
  requiredAttr: true, // default is false
  controlSequenceKeys: ['NumLock', 'Clear'], // default is null
  callbackAfterTimeout: false // default is false
}
Vue.use(VueBarcodeScanner, options)



new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
