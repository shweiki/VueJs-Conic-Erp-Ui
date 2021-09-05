import Layout from '@/layout'

const VisitsRouter = {
  path: '/Visit',
  name: 'Visit',
  component: Layout,
  redirect: '/List',
  meta: { title: 'Visits', icon: 'ticket-alt-solid' },
  children: [
    {
      path: 'Create',
      component: () => import('@/views/Visit/Create'),
      name: 'NewVisit',
      meta: { title: 'NewVisit', icon: 'ticket-alt-solid' }
    },
    {
      path: 'Edit/:id(\\d+)',
      component: () => import('@/views/Visit/Edit'),
      name: 'EditVisit',
      meta: {
         title: 'Edit', noCache: true, activeMenu: '/Visit/List'
      },
      hidden: true,
    },
    {
      path: 'List',
      component: () => import('@/views/Visit/List'),
      name: 'ListVisit',
      meta: {
        title: 'ListVisit', icon: 'cost'
      },
    },

  ]
}

export default VisitsRouter
