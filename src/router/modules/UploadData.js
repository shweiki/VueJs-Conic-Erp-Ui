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
      path: 'Upload/GenerateQr',
      component: () => import('@/views/UploadData/GenerateQr'),
      name: 'GenerateQr',
      meta: {
        title: 'GenerateQr', icon: 'execution'
      },
    },
    {
      path: 'Upload/Item',
      component: () => import('@/views/UploadData/Item'),
      name: 'UploadItem',
      meta: {
        title: 'UploadItem', icon: 'execution'
      },
    },
    {
      path: 'Upload/Vendor',
      component: () => import('@/views/UploadData/Vendor'),
      name: 'UploadVendor',
      meta: {
        title: 'UploadVendor', icon: 'execution'
      },
    },
    {
      path: 'Upload/SaleInvoice',
      component: () => import('@/views/UploadData/SaleInvoice'),
      name: 'UploadSaleInvoice',
      meta: {
        title: 'UploadSaleInvoice', icon: 'execution'
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
    },
    {
      path: 'Upload/Oprationsys',
      component: () => import('@/views/UploadData/Oprationsys'),
      name: 'UploadOprationsys',
      meta: {
        title: 'UploadOprationsys', icon: 'execution'
      },
    },
    {
      path: 'Upload/ForUploadBioLab',
      component: () => import('@/views/UploadData/ForUploadBioLab/index'),
      name: 'ForUploadBioLab',
      meta: {
        title: 'ForUploadBioLab', icon: 'execution'
      },
    }
  ]
}

export default UploadData
