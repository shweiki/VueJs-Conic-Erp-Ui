import Layout from '@/layout'

const WorkShopsRouter = {
    path: '/WorkShop',
    name: 'WorkShop',
    component: Layout,
    redirect: '/WorkShop/List',
    meta: { title: 'WorkShops', icon: 'shopping-cart' },
    children: [{
            path: 'Create',
            component: () =>
                import ('@/views/WorkShop/WorkShop/Create'),
            name: 'NewWorkShop',
            meta: { title: 'NewWorkShop', icon: 'edit' }
        },
        {
            path: 'Edit/:id(\\d+)',
            component: () =>
                import ('@/views/WorkShop/WorkShop/Edit'),
            name: 'EditWorkShop',
            meta: {
                title: 'EditInvoice',
                noCache: true,
                activeMenu: '/WorkShop/WorkShop/List'
            },
            hidden: true,
        },
        {
            path: 'List',
            component: () =>
                import ('@/views/WorkShop/WorkShop/List'),
            name: 'ListWorkShop',
            meta: {
                title: 'ListWorkShop',
                icon: 'cost'
            },
        }
    ]
}

export default WorkShopsRouter