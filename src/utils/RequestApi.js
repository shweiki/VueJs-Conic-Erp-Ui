import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({

//  baseURL: 'http://192.168.1.106', // url = base url + request url
  baseURL: 'https://localhost:44376', // url = base url + request url

  //baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url

timeout: 20000000 ,// request timeout
withCredentials: true,

})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent    "Content-Type": "application/json"
   // console.log("config" , config);

    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
   // config.headers['Cache-Control'] ='no-cache'

  // config.['withCredentials'] = true

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
  //  config.headers['Authorization'] = getToken()
      
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
    const res = response.data
 //  console.log(response);

    // if the custom code is not 20000, it is judged as an error.
  //  console.log("x",response)
      return res
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
