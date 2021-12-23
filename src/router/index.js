import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

import VendorRouter from './modules/Vendor'
import GymRouter from './modules/Gym'
import AccountingRouter from './modules/Accounting'
import InventoryRouter from './modules/inventory'
import PurchasesRouter from './modules/Purchases'
import VisitsRouter from './modules/Visit'
import SalesRouter from './modules/Sales'
import PaymentRouter from './modules/Payment'
import ReceiveRouter from './modules/Receive'
import CashPoolRouter from './modules/CashPool'
import WorkShopsRouter from './modules/WorkShops'
import SettingsRouter from './modules/Settings'
import UploadData from './modules/UploadData'
import OrderDeliveryRouter from './modules/OrderDelivery'
import HumanResource from './modules/HumanResource'
import OrderRestaurantRouter from './modules/OrderRestaurant'

/* Router Modules */
//import componentsRouter from './modules/components'
//import chartsRouter from './modules/charts'
//import tableRouter from './modules/table'
//import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [{
        path: '/redirect/:path(.*)',
        component: () =>
            import('@/views/redirect/index')
    }]
},
{
    path: '/login',
    component: () =>
        import('@/views/login/index'),
    hidden: true
},
{
    path: '/auth-redirect',
    component: () =>
        import('@/views/login/auth-redirect'),
    hidden: true
},
{
    path: '/404',
    component: () =>
        import('@/views/error-page/404'),
    hidden: true
},
{
    path: '/401',
    component: () =>
        import('@/views/error-page/401'),
    hidden: true
},
{
    path: '/',
    component: Layout,
    redirect: '/index',
    hidden: true,
    children: [{
        path: 'index',
        component: () =>
            import('@/views/Profile/index'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'user', noCache: true }
    }]
}]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [{
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard/index',
    children: [{
        path: 'index',
        component: () =>
            import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard (1)', affix: true }
    }]
},
{
    path: '/Sales/PonitOfSale',
    component: () =>
        import('@/views/Sales/SaleInvoice/Create'),
    name: 'PonitOfSale',
    meta: {
        title: 'PonitOfSale',
        icon: 'bill'
    },
},
{
    path: '/Sales/CustomerPOS',
    component: () =>
        import('@/views/Sales/SaleInvoice/CustomerPOS'),
    name: 'CustomerPOS',
    meta: {
        title: 'CustomerPOS',
        icon: 'bill'
    },
},

    /** when your routing map is too long, you can split it into small modules **/
    //componentsRouter,
    VendorRouter,
    GymRouter,
    HumanResource,
    SalesRouter,
    PurchasesRouter,
    VisitsRouter,
    CashPoolRouter,
    WorkShopsRouter,
    InventoryRouter,
    PaymentRouter,
    ReceiveRouter,
    AccountingRouter,
    OrderDeliveryRouter,
    OrderRestaurantRouter,
    SettingsRouter,
    UploadData,
{
    path: '/Reports',
    component: Layout,
    redirect: '/Reports',
    meta: {
        title: 'Reports',
        icon: 'report',
        affix: true
    },
    children: [{
        path: 'Create',
        component: () =>
            import('@/views/Reports/Create'),
        name: 'NewReport',
        meta: { title: 'NewReport', icon: 'edit' }
    },
    {
        path: 'Edit/:id(\\d+)',
        component: () =>
            import('@/views/Reports/Edit'),
        name: 'EditReport',
        meta: {
            title: 'EditReport',
            noCache: true,
            activeMenu: '/Reports/List'
        },
        hidden: true,
    },
    {
        path: 'List',
        component: () =>
            import('@/views/Reports/List'),
        name: 'ListReport',
        meta: {
            title: 'ListReport',
            icon: 'cost'
        },
    }
    ]
},

//Guide
{
    path: '/Guide',
    component: Layout,
    redirect: '/Guide/index',
    children: [{
        path: 'index',
        component: () =>
            import('@/views/Guide/index'),
        name: 'Guide',
        meta: {
            title: 'Guide',
            icon: 'guide',
            noCache: true
        },
    }]
},


]

const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router