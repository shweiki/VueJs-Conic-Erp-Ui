import Layout from '@/layout'

const ReceiveRouter = {
  path: '/Receive',
  component: Layout,
  redirect: '/Receive/List',
  meta: {
    title: 'Receive', icon: 'accounts'
  },
  children: [
    {
      path: 'Create',
      component: () => import('@/views/Receive/Create'),
      name: 'NewReceive',
      meta: { title: 'NewReceive', icon: 'edit' }
    },
    {
      path: 'Edit/:id(\\d+)',
      component: () => import('@/views/Receive/Edit'),
      name: 'EditReceive',
      meta: {
        title: 'EditReceive', noCache: true, activeMenu: '/Receive/List'
      },
      hidden: true,
    },
    {
      path: 'List',
      component: () => import('@/views/Receive/List'),
      name: 'ListReceive',
      meta: {
        title: 'ListReceive', icon: 'accounts'
      },
    },

  ]
}

export default ReceiveRouter
