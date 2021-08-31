import Layout from '@/layout'

const PaymentRouter = {
  path: '/Payment',
  component: Layout,
  redirect: '/Payment/List',
  meta: {
    title: 'Payment', icon: 'accounts'
  },
  children: [
    {
      path: 'Create',
      component: () => import('@/views/Payment/Create'),
      name: 'NewPayment',
      meta: { title: 'NewPayment', icon: 'edit' }
    },
    {
      path: 'Edit/:id(\\d+)',
      component: () => import('@/views/Payment/Edit'),
      name: 'EditPayment',
      meta: {
        title: 'EditPayment', noCache: true, activeMenu: '/Payment/List'
      },
      hidden: true,
    },
    {
      path: 'List',
      component: () => import('@/views/Payment/List'),
      name: 'ListPayment',
      meta: {
        title: 'ListPayment', icon: 'accounts'
      },
    },

  ]
}

export default PaymentRouter
