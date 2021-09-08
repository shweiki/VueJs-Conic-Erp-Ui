import Layout from '@/layout'

const OrderDeliveryRouter = {
  path: '/OrderDelivery',
  component: Layout,
  redirect: '/OrderDelivery/List',
  meta: {
    title: 'OrderDelivery', icon: 'accounts'
  },
  children: [
   
    // {
    //   path: 'Edit/:id(\\d+)',
    //   component: () => import('@/views/OrderDelivery/Edit'),
    //   name: 'EditDelivery',
    //   meta: {
    //     title: 'EditDelivery', noCache: true, activeMenu: '/OrderDelivery/List'
    //   },
    //   hidden: true,
    // },
    {
      path: 'DeliveryList',
      component: () => import('@/views/OrderDelivery/DeliveryList'),
      name: 'DeliveryList',
      meta: {
        title: 'DeliveryList', icon: 'accounts'
      },
    },
    {
      path: 'DeliveryManager',
      component: () => import('@/views/OrderDelivery/DeliveryManager'),
      name: 'DeliveryManager',
      meta: {
        title: 'DeliveryManager', icon: 'accounts'
      },
    },
    {
      path: 'Drivers',
      component: () => import('@/views/Driver/List'),
      name: 'Drivers',
      meta: {
        title: 'AddDrivers', icon: 'cost'
      },
    },
    {
      path: 'DriverPage',
      component: () => import('@/views/OrderDelivery/DriverPage'),
      name: 'DriverPage',
      meta: {
        title: 'DriverPage', icon: 'cost'
      },
    },

  ]
}

export default OrderDeliveryRouter
