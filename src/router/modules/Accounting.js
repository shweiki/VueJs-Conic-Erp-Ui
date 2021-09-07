import Layout from '@/layout'

const AccountingRouter = {
  path: '/Accounting',
  component: Layout,
  redirect: '/Accounting/TreeAccount',
  name: 'Accounting',
  meta: {
    title: 'Accounting', icon: 'acc'
  },
  children: [
    {
      path: '/EntryAccounting',
      component: () => import('@/views/Accounting/EntryAccounting/index'),
      redirect: '/EntryAccounting/List',
      name: 'EntryAccounting',
      meta: { title: 'EntryAccounting', icon: 'orderinv' },
      children: [
        {
          path: 'Create',
          component: () => import('@/views/Accounting/EntryAccounting/Create'),
          name: 'NewEntryAccounting',
          meta: { title: 'NewEntryAccounting', icon: 'edit' }
        },
        {
          path: 'Edit/:id(\\d+)',
          component: () => import('@/views/Accounting/EntryAccounting/Edit'),
          name: 'EditEntryAccounting',
          meta: {
            title: 'EditEntryAccounting', noCache: true, activeMenu: '/Accounting/EntryAccounting/List'
          },
          hidden: true,
        },
        {
          path: 'List',
          component: () => import('@/views/Accounting/EntryAccounting/List'),
          name: 'ListEntryAccounting',
          meta: {
            title: 'ListEntryAccounting', icon: 'cost'
          },
        }
      ]
    },
    {
      path: 'AccountReceivablesPayables',
      component: () => import('@/views/Accounting/AccountReceivablesPayables'),
      name: 'AccountReceivablesPayables',
      meta: {
        title: 'AccountReceivablesPayables', icon: 'cost'
      },
    },
    {
      path: 'AccountStatement',
      component: () => import('@/views/Accounting/AccountStatement'),
      name: 'AccountStatement',
      meta: {
        title: 'AccountStatement', icon: 'cost'
      },
    },
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
      name: 'TableAccount',
      meta: {
        title: 'TableAccount', icon: 'cost'
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
