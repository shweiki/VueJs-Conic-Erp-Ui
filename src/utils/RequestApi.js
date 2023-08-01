import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
 import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.NODE_ENV == "development" ? process.env.VUE_APP_BASE_API : window.location.protocol + "//" + window.location.host + "/",//'http://localhost:5000'
  // baseUrl || url = base url + request url
  timeout: 100000,// request timeout
 // withCredentials: true,
})
// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent    "Content-Type": "application/json"
    // console.log("config" , config);
    //   config.headers['X-Requested-With']= 'XMLHttpRequest',
    // config.headers['Cache-Control'] ='no-cache'
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
        config.headers['Authorization'] = getToken()

    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response


    if (res.status !== 200 && res.status !== 201 ) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.status === 508 || res.status === 512 || res.status === 514) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res.data
    }
  },
  error => {
    console.log('err --  ' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
