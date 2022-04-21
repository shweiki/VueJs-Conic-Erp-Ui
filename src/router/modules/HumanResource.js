import Layout from '@/layout'

const HumanResource = {
  path: '/HumanResource',
  component: Layout,
  redirect: '/HumanResource/ListEmployee/index',
  name: 'HumanResource',
  meta: {
    title: 'HumanResource', icon: 'acc'
  },
  children: [
    {
      path: 'ListEmployee',
      component: () => import('@/views/HumanResource/ListEmployee/index'),
      name: 'ListEmployee',
      meta: {
        title: 'ListEmployee', icon: 'cost'
      },
    },
    {
      path: 'Edit/:id(\\d+)',
      component: () => import('@/views/HumanResource/ListEmployee/Edit'),
      name: 'EditEmployee',
      meta: {
        title: 'Edit Employee', noCache: true, activeMenu: '/HumanResource/ListEmployee/index'
      },
      hidden: true,
    },
    {
      path: 'Employees',
      component: () => import('@/views/HumanResource/Employees/List'),
      name: 'Employees',
      meta: {
        title: 'Employees', icon: 'cost'
      },
    },
    {
      path: 'Adjustment',
      component: () => import('@/views/HumanResource/Adjustment/List'),
      name: 'Adjustment',
      meta: {
        title: 'Adjustment', icon: 'cost'
      },
    },
    {
      path: 'EditSalary/:id(\\d+)',
      component: () => import('@/views/HumanResource/Salary/Edit'),
      name: 'EditSalary',
      meta: {
        title: 'EditSalary', noCache: true, activeMenu: '/HumanResource/ListEmployee/index'
      },
      hidden: true,
    },
   
   


  ]
}

export default HumanResource
