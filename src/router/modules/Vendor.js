import Layout from '@/layout'

const VendorRouter = {
  path: '/Vendors',
  component: Layout,
  redirect: '/Vendors/List',
  meta: {
    title: 'Vendors', icon: 'customer-service'
  },
  children: [
    {
      path: 'List',
      component: () => import('@/views/Vendor/List'),
      name: 'ListVendor',
      meta: {
        title: 'ListVendor', icon: 'customer-service'
      },
    },
    /*{
      path: 'Create',
      component: () => import('@/views/Vendor/Create'),
      name: 'NewVendor',
      meta: { title: 'NewVendor', icon: 'edit' }
    },*/
    {
      path: 'Edit/:id(\\d+)',
      component: () => import('@/views/Vendor/Edit'),
      name: 'EditVendor',
      meta: {
        title: 'Edit Vendor', noCache: true, activeMenu: '/Vendor/List'
      },
      hidden: true,
    },

  ]
}

export default VendorRouter
