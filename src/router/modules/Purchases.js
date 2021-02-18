import Layout from '@/layout'

const PurchasesRouter = {
  path: '/Purchase',
  name: 'Purchase',

  component: Layout,
  redirect: '/Purchase/PurchaseInvoice/List',
  meta: { title: 'Purchases', icon: 'shopping-cart' },
  children: [
    {
      path: 'Create',
      component: () => import('@/views/Purchase/PurchaseInvoice/Create'),
      name: 'NewPurchaseInvoice',
      meta: { title: 'NewPurchaseInvoice', icon: 'edit' }
    },
    {
      path: 'Edit/:id(\\d+)',
      component: () => import('@/views/Purchase/PurchaseInvoice/Edit'),
      name: 'EditPurchaseInvoice',
      meta: {
         title: 'EditInvoice', noCache: true, activeMenu: '/Purchase/PurchaseInvoice/List'
      },
      hidden: true,
    },
    {
      path: 'List',
      component: () => import('@/views/Purchase/PurchaseInvoice/List'),
      name: 'ListPurchaseInvoice',
      meta: {
        title: 'ListPurchaseInvoice', icon: 'cost'
      },
    },
    {
      path: 'PurchaseItems',
      component: () => import('@/views/Purchase/PurchaseItems'),
      name: 'PurchaseItems',
      meta: {
        title: 'PurchaseItems', icon: 'shopping-cart (1)'
      },
    }
  ]
}

export default PurchasesRouter
