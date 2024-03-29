import Layout from '@/layout'

const SalesRouter = {
  path: '/Sales',
  component: Layout,
  redirect: '/Sales/List',
  meta: {
    title: 'Sales', icon: 'income'
  },
  children: [
    {
      path: 'Create',
      component: () => import('@/views/Sales/SaleInvoice/Create'),
      name: 'NewSaleInvoice',
      meta: { title: 'NewSaleInvoice', icon: 'edit' }
    },
    {
      path: 'Edit/:id(\\d+)',
      component: () => import('@/views/Sales/SaleInvoice/Edit'),
      name: 'EditSaleInvoice',
      meta: {
        title: 'EditSaleInvoice', noCache: true, activeMenu: '/Sales/SalesInvoice/List'
      },
      hidden: true,
    },
    {
      path: 'List',
      component: () => import('@/views/Sales/SaleInvoice/List'),
      name: 'ListSalesInvoice',
      meta: {
        title: 'ListSalesInvoice', icon: 'cost'
      },
    },
    {
      path: 'SalesItems',
      component: () => import('@/views/Sales/SalesItems'),
      name: 'SalesItems',
      meta: {
        title: 'SalesItems', icon: 'shopping-cart (1)'
      },
    },

  ]
}

export default SalesRouter
