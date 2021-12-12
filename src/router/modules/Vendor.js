import Layout from '@/layout'

const VendorRouter = {
  path: '/Vendor',
  component: Layout,
  redirect: '/Vendor/List',
  meta: {
    title: 'Vendors', icon: 'customer-service'
  },
  children: [
    // {
    //   path: 'Create',
    //   component: () => import('@/views/Vendor/Create'),
    //   name: 'NewVendor',
    //   meta: { title: 'NewVendor', icon: 'edit' }
    // },
    {
      path: 'Edit/:id(\\d+)',
      component: () => import('@/views/Vendor/Edit'),
      name: 'EditVendor',
      meta: {
        title: 'Edit Vendor', noCache: true, activeMenu: '/Vendor/List'
      },
      hidden: true,
    },
    {
      path: 'ListVendor',
      component: () => import('@/views/Vendor/List'),
      name: 'ListVendor',
      meta: {
        title: 'Vendors', icon: 'customer-service'
      },
    },
  ]
}

export default VendorRouter
