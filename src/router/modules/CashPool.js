import Layout from '@/layout'

const CashPoolRouter = {
  path: '/CashPool',
  component: Layout,
  redirect: '/CashPool/List',
  meta: {
    title: 'CashPools', icon: 'machine'
  },
  children: [
    {
      path: 'Create',
      component: () => import('@/views/CashPool/Create'),
      name: 'NewCashPool',
      meta: { title: 'NewCashPool', icon: 'machine' }
    },
    {
      path: 'Edit/:id(\\d+)',
      component: () => import('@/views/CashPool/Edit'),
      name: 'EditCashPool',
      meta: {
        title: 'EditCashPool', noCache: true, activeMenu: '/CashPool/List'
      },
      hidden: true,
    },
    {
      path: 'List',
      component: () => import('@/views/CashPool/List'),
      name: 'ListCashPools',
      meta: {
        title: 'ListCashPools', icon: 'machine'
      },
    },

  ]
}

export default CashPoolRouter
