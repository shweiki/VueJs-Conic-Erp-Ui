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
      path: 'DeliveryHistory',
      component: () => import('@/views/OrderDelivery/DeliveryHistory'),
      name: 'DeliveryHistory',
      meta: {
        title: 'DeliveryHistory', icon: 'accounts'
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

  ]
}

export default OrderDeliveryRouter
