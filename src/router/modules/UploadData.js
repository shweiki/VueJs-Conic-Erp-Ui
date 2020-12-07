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
      path: 'Upload/Item',
      component: () => import('@/views/UploadData/Item'),
      name: 'UploadItem',
      meta: {
        title: 'UploadItem', icon: 'execution'
      },
    },
    {
      path: 'Upload/Service',
      component: () => import('@/views/UploadData/Service'),
      name: 'UploadService',
      meta: {
        title: 'UploadService', icon: 'execution'
      },
    },
    {
      path: 'Upload/MemberShip',
      component: () => import('@/views/UploadData/MemberShip'),
      name: 'UploadMembership',
      meta: {
        title: 'UploadMemberShip', icon: 'execution'
      },
    },
    {
      path: 'Upload/Member',
      component: () => import('@/views/UploadData/Member'),
      name: 'UploadMember',
      meta: {
        title: 'UploadMember', icon: 'execution'
      },
    },
    {
      path: 'Upload/MembershipMovement',
      component: () => import('@/views/UploadData/MembershipMovement'),
      name: 'UploadMembershipMovement',
      meta: {
        title: 'UploadMembershipMovement', icon: 'execution'
      },
    }
  ]
}

export default UploadData
