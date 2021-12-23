import Layout from '@/layout'

const OrderRestaurantRouter = {
  path: '/OrderRestaurant',
  component: Layout,
  redirect: '/OrderRestaurant/List',
  meta: {
    title: 'OrderRestaurant', icon: 'accounts'
  },
  children: [
   
    // {
    //   path: 'Edit/:id(\\d+)',
    //   component: () => import('@/views/OrderRestaurant/Edit'),
    //   name: 'EditDelivery',
    //   meta: {
    //     title: 'EditDelivery', noCache: true, activeMenu: '/OrderRestaurant/List'
    //   },
    //   hidden: true,
    // },
    {
      path: 'OrderList',
      component: () => import('@/views/OrderRestaurant/OrderRestaurantList'),
      name: 'OrderRestaurantList',
      meta: {
        title: 'OrderRestaurantList', icon: 'accounts'
      },
    },
    {
      path: 'OrderRestaurantManager',
      component: () => import('@/views/OrderRestaurant/OrderRestaurantManager'),
      name: 'OrderRestaurantManager',
      meta: {
        title: 'OrderRestaurantManager', icon: 'accounts'
      },
    },
  
    {
      path: 'CustomerPage',
      component: () => import('@/views/OrderRestaurant/CustomerPage'),
      name: 'CustomerPage',
      meta: {
        title: 'CustomerPage', icon: 'cost'
      },
    },
    {
      path: 'CustomerOrderList',
      component: () => import('@/views/OrderRestaurant/CustomerOrderList'),
      name: 'CustomerOrderList',
      meta: {
        title: 'CustomerOrderList', icon: 'accounts'
      },
    },

  ]
}

export default OrderRestaurantRouter
