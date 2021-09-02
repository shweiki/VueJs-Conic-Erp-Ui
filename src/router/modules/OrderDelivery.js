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
      path: 'List',
      component: () => import('@/views/OrderDelivery/List'),
      name: 'ListDelivery',
      meta: {
        title: 'ListDelivery', icon: 'accounts'
      },
    },

  ]
}

export default OrderDeliveryRouter
