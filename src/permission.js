import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { OpenCashDrawer } from "@/api/Device";
import getPrinterDevice from "@/utils/get-printers";

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
    // start progress bar
    NProgress.start()
    // set page title
    document.title = getPageTitle(to.meta.title)
    // determine whether the user has logged in
    const hasToken = getToken()
    if (hasToken) {
        if (to.path === '/login') {
            // if is logged in, redirect to the home page
            next({ path: '/' })
            NProgress.done()
        } else {
            // determine whether the user has obtained his permission roles through getInfo
            const hasRoles = store.getters.roles && store.getters.roles.length > 0
            if (hasRoles) {
                next()
            } else {
                try {
                    store.dispatch("CompanyInfo/GetOpration");

                    // get user info
                    // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
                    const { roles, userrouter, defulateRedirect } = await store.dispatch('user/getInfo')
                    // generate accessible routes map based on roles
                    roles.userrouter = userrouter
                    roles.defulateRedirect = defulateRedirect == null ? '/index' : defulateRedirect

                    const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
                    // dynamically add accessible routes  
                    router.addRoutes(accessRoutes)

                    // hack method to ensure that addRoutes is complete
                    // set the replace: true, so the navigation will not leave a history record
                    store.dispatch("CompanyInfo/GetCompanyInfo");
                    if (store.state.settings.BusinessType == 'GymManagment') {
                        var now = new Date();
                        var d = new Date(store.state.settings.triger.CheckMembers.LastRun)
                        d.setTime(d.getTime() + (store.state.settings.triger.CheckMembers.OnClock * 60 * 60 * 1000))
                        if (d.getTime() < now.getTime()) {
                            const CheckMembers = await store.dispatch("Members/CheckMembers")
                        }
                        store.dispatch("Devices/GetDevice");
                        store.dispatch("Devices/ConnectZtkDoor");
                    }
                    
                    document.onkeydown = capturekey;
                    document.onkeypress = capturekey;
                    document.onkeyup = capturekey;

                    function capturekey(e) {
                        e = e || window.event;
                        //debugger
                        if (e.code == store.state.settings.CashDrawerCOM.OpenKeyBoard) {
                        //    window.event.code = 9;
                            OpenCashDrawer({ Com: store.state.settings.CashDrawerCOM.COM })
                                .then(response => { console.log("OpenCashDrawer", response) })
                                .catch(err => {
                                    console.log(err);
                                });
                        }
                        if (window.event && window.event.keyCode == 13) {
                          //  console.log(window)
                          //  window.event.code = 9;
                            //   $event.target.nextElementSibling.focus()
                            // e.target.nextElementSibling.focus()
                            //   e.code = 9;
                        }

                        /*
                        if (e.code == store.state.settings.KeyBoard.key) {
                          store.state.settings.KeyBoard.ref
                          OpenCashDrawer({ Com: store.state.settings.CashDrawerCOM.COM })
                            .then(response => { console.log("OpenCashDrawer", response) })
                            .catch(err => {
                              console.log(err);
                            });
                        }*/
                    }
                    getPrinterDevice();

                    console.log("to : ", defulateRedirect)
                    //  to.path = store.settings.defulateRedirect
                    // next({ ...to, replace: true })
                    /*  if (defulateRedirect != null) {
                        next(defulateRedirect);
                      }
                      else {
                        next({ ...to, replace: true })
                      }*/
                    next({ ...to, replace: true })

                    // run First Project
                } catch (error) {
                    // remove token and go to login page to re-login
                    await store.dispatch('user/resetToken')
                    Message.error(error || 'Has Error')
                    //next(`/login?redirect=${to.path}`)
                    next(`/login?redirect=${to.path}`)
                    NProgress.done()
                }
            }
        }
    } else {
        /* has no token*/

        if (whiteList.indexOf(to.path) !== -1) {
            // in the free login whitelist, go directly
            next()
        } else {
            // other pages that do not have permission to access are redirected to the login page.
            //next(`/login?redirect=${to.path}`)
            next(`/login?redirect=${to.path}`)
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    // finish progress bar

    NProgress.done()
})