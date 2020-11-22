import Layout from '@/layout'

const UploadData = {
  path: '/UploadData',
  component: Layout,
  redirect: '/Member',
  name: 'UploadData',
  meta: {
    title: 'UploadData',
    icon: 'setting',
    roles: ['developer']
  },
  children: [
    {
      path: '/Item',
      component: () => import('@/views/UploadData/Item'),
      name: 'Item',
      meta: {
        title: 'Item', icon: 'execution'
      },
    },
    {
      path: '/Service',
      component: () => import('@/views/UploadData/Service'),
      name: 'Service',
      meta: {
        title: 'Service', icon: 'execution'
      },
    },
    {
      path: '/MemberShip',
      component: () => import('@/views/UploadData/MemberShip'),
      name: 'Membership',
      meta: {
        title: 'MemberShip', icon: 'execution'
      },
    },
    {
      path: '/Member',
      component: () => import('@/views/UploadData/Member'),
      name: 'Member',
      meta: {
        title: 'Member', icon: 'execution'
      },
    },
    {
      path: '/MembershipMovement',
      component: () => import('@/views/UploadData/MembershipMovement'),
      name: 'MembershipMovement',
      meta: {
        title: 'MembershipMovement', icon: 'execution'
      },
    }
  ]
}

export default UploadData
