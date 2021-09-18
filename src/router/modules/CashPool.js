import Layout from '@/layout'

const CashPoolRouter = {
  path: '/CashPool',
  component: Layout,
  redirect: '/CashPool/List',
  meta: {
    title: 'CashPools', icon: 'machine'
  },
  children: [
    {
      path: 'Create/SaleInvoice',
      component: () => import('@/views/CashPool/components/SaleInvoice'),
      name: 'NewSaleInvoiceCashPool',
      meta: { title: 'NewSaleInvoiceCashPool', icon: 'machine' }
    },
    {
      path: 'Edit/SaleInvoice/:id(\\d+)',
      component: () => import('@/views/CashPool/components/SaleInvoice'),
      name: 'EditSaleInvoiceCashPool',
      meta: {
        title: 'EditSaleInvoiceCashPool', noCache: true, activeMenu: '/CashPool/List'
      },
      hidden: true,
    },
    {
      path: 'Create/Payment',
      component: () => import('@/views/CashPool/components/Payment'),
      name: 'NewPaymentCashPool',
      meta: { title: 'NewPaymentCashPool', icon: 'machine' }
    },
    {
      path: 'Edit/Payment/:id(\\d+)',
      component: () => import('@/views/CashPool/components/Payment'),
      name: 'EditPaymentCashPool',
      meta: {
        title: 'EditPaymentCashPool', noCache: true, activeMenu: '/CashPool/List'
      },
      hidden: true,
    },
    {
      path: 'Create/Visit',
      component: () => import('@/views/CashPool/components/Visit'),
      name: 'NewVisitCashPool',
      meta: { title: 'NewVisitCashPool', icon: 'machine' }
    },
    {
      path: 'Edit/Visit/:id(\\d+)',
      component: () => import('@/views/CashPool/components/Visit'),
      name: 'EditVisitCashPool',
      meta: {
        title: 'EditVisitCashPool', noCache: true, activeMenu: '/CashPool/List'
      },
      hidden: true,
    },
    {
      path: 'List',
      component: () => import('@/views/CashPool/List'),
      name: 'ListCashPools',
      meta: {
        title: 'ListCashPools', icon: 'machine'
      },
    },

  ]
}

export default CashPoolRouter
