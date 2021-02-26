import Layout from '@/layout'

const GymRouter = {
  path: '/Gym',
  component: Layout,
  redirect: '/Gym/ListMember/index',
  name: 'Gym',
  meta: {
    title: 'Gym', icon: 'acc'
  },
  children: [
    {
      path: 'ListMember',
      component: () => import('@/views/Gym/ListMember/index'),
      name: 'ListMember',
      meta: {
        title: 'ListMember', icon: 'cost'
      },
    },
    {
      path: 'Edit/:id(\\d+)',
      component: () => import('@/views/Gym/ListMember/Edit'),
      name: 'EditMember',
      meta: {
         title: 'Edit Member', noCache: true, activeMenu: '/Gym/ListMember/index'
      },
      hidden: true,
    },

    {
      path: 'Members',
      component: () => import('@/views/Gym/Members/List'),
      name: 'Members',
      meta: {
        title: 'Members', icon: 'cost'
      },
    },
    {
      path: 'Memberships',
      component: () => import('@/views/Gym/Memberships/index'),
      name: 'Memberships',
      meta: {
        title: 'Memberships', icon: 'accounts'
      },
    },
    {
      path: 'MembershipMovements',
      component: () => import('@/views/Gym/MembershipMovements/index'),
      name: 'MembershipMovements',
      meta: {
        title: 'MembershipMovements', icon: 'accounts'
      },
    },
    {
      path: 'Services',
      component: () => import('@/views/Gym/Services/index'),
      name: 'Services',
      meta: {
        title: 'Services', icon: 'accounts'
      },
    }


  ]
}

export default GymRouter
