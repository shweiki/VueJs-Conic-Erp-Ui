import Layout from '@/layout'

const AccountingRouter = {
  path: '/Accounting',
  component: Layout,
  redirect: 'Accounting/TreeAccount',
  name: 'Accounting',
  meta: {
    title: 'Accounting', icon: 'acc'
  },
  children: [
    {
      path: 'TreeAccount',
      component: () => import('@/views/Accounting/TreeAccount/index'),
      name: 'TreeAccount',
      meta: {
        title: 'TreeAccount', icon: 'cost'
      },
    },
    {
      path: 'TableAccount',
      component: () => import('@/views/Accounting/TreeAccount/TableAccount'),
      meta: {
        title: 'TableAccount', icon: 'cost'
      },
    },
    {
      path: 'Payment',
      component: () => import('@/views/Accounting/Payment/index'),
      name: 'Payment',
      meta: {
        title: 'Payment', icon: 'accounts'
      },
    },
    {
      path: 'EntryAccounting',
      component: () => import('@/views/Accounting/EntryAccounting/index'),
      name: 'EntryAccounting',
      meta: {
        title: 'EntryAccounting', icon: 'accounts'
      },
    },
    {
      path: 'NewAccountingEntry',
      component: () => import('@/views/Accounting/EntryAccounting/NewAccountingEntry'),
      name: 'NewAccountingEntry',
      meta: {
        title: 'NewAccountingEntry', icon: 'accounting (1)'
      },
    },
    {
      path: 'Banks',
      component: () => import('@/views/Accounting/Bank/index'),
      name: 'Bank',
      meta: {
        title: 'Banks', icon: 'accounting (1)'
      },
    },
    {
      path: 'Cheque',
      component: () => import('@/views/Accounting/Cheque/index'),
      name: 'Cheque',
      meta: {
        title: 'Cheques', icon: 'accounting (1)'
      },
    },
    {
      path: 'Cash',
      component: () => import('@/views/Accounting/Cash/index'),
      name: 'Cash',
      meta: {
        title: 'Cash', icon: 'accounting (1)'
      },
    },
  ]
}

export default AccountingRouter
