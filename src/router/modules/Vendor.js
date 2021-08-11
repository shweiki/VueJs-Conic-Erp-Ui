import Layout from '@/layout'

const VendorRouter = {
  path: '/Vendor',
  component: Layout,
  redirect: '/Vendor/List',
  name: 'Vendors',
  meta: {
    title: 'Vendors', icon: 'customer-service'
  },
  children: [
    {
      path: 'ListVendor',
      component: () => import('@/views/Vendor/List'),
      name: 'ListVendor',
      meta: {
        title: 'Vendors', icon: 'customer-service'
      },
    },
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
