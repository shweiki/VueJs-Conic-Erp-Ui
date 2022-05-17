import Layout from '@/layout'

const PurchasesRouter = {
  path: '/Purchases',
  component: Layout,
  redirect: '/Purchases/List',
  meta: { title: 'Purchase', icon: 'shopping-cart' },
  children: [
    {
      path: 'Create',
      component: () => import('@/views/Purchases/PurchaseInvoice/Create'),
      name: 'NewPurchaseInvoice',
      meta: { title: 'NewPurchaseInvoice', icon: 'edit' }
    },
    {
      path: 'Edit/:id(\\d+)',
      component: () => import('@/views/Purchases/PurchaseInvoice/Edit'),
      name: 'EditPurchaseInvoice',
      meta: {
         title: 'EditInvoice', noCache: true, activeMenu: '/Purchases/PurchaseInvoice/List'
      },
      hidden: true,
    },
    {
      path: 'List',
      component: () => import('@/views/Purchases/PurchaseInvoice/List'),
      name: 'ListPurchaseInvoice',
      meta: {
        title: 'ListPurchaseInvoice', icon: 'cost'
      },
    },
    {
      path: 'PurchaseItems',
      component: () => import('@/views/Purchases/PurchaseItems'),
      name: 'PurchaseItems',
      meta: {
        title: 'PurchaseItems', icon: 'shopping-cart (1)'
      },
    },
    {
      path: 'BillOfEnteryList',
      component: () => import('@/views/Purchases/BillOfEntery/List'),
      name: 'ListBillOfEntery',
      meta: {
        title: 'ListBillOfEntery', icon: 'cost'
      },
    },{
      path: 'EditBillOfEntery/:id(\\d+)',
      component: () => import('@/views/Purchases/BillOfEntery/Edit'),
      name: 'EditBillOfEntery',
      meta: {
         title: 'EditBillOfEntery', noCache: true, activeMenu: '/Purchases/BillOfEntery/List'
      },
      hidden: true,
    },
  ]
}

export default PurchasesRouter
