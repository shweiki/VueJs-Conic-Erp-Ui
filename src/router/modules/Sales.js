import Layout from '@/layout'

const SalesRouter = {
  path: '/Sales',
  component: Layout,
  redirect: '/Sales/index',
  meta: {
    title: 'Sales', icon: 'income'
  },
  children: [
    {
      path: 'SalesInvoice',
      component: () => import('@/views/Sales/index'),
      name: 'SalesInvoice',
      meta: {
        title: 'SalesInvoice', icon: 'research'
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
    {
      path: 'CashPool',
      component: () => import('@/views/Sales/CashPool/index'),
      name: 'CashPool',
      meta: {
        title: 'CashPool', icon: 'machine'
      },
    }
  ]
}

export default SalesRouter
