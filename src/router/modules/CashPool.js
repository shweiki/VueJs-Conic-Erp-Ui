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
      path: 'Create/Payment',
      component: () => import('@/views/CashPool/components/Payment'),
      name: 'NewPaymentCashPool',
      meta: { title: 'NewPaymentCashPool', icon: 'machine' }
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
