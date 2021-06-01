import Layout from '@/layout'

const SettingsRouter = {
  path: '/Settings',
  component: Layout,
  redirect: '/Settings/CompanyInfo',
  name: 'Settings',
  meta: {
    title: 'Settings',
    icon: 'setting',
  },
  children: [

    {
      path: 'Oprationsys',
      component: () => import('@/views/Settings/Oprationsys/index'),
      name: 'Oprationsys',
      meta: {
        title: 'Oprationsys', icon: 'execution'
      },
    },
    {
      path: 'Discount',
      component: () => import('@/views/Settings/Discount/index'),
      name: 'Discount',
      meta: {
        title: 'Discount', icon: 'company'
      },
    },
    {
      path: 'Drivers',
      component: () => import('@/views/Driver/List'),
      name: 'Drivers',
      meta: {
        title: 'Drivers', icon: 'cost'
      },
    },
    {
      path: 'Editors',
      component: () => import('@/views/Settings/EditorsUsers/index'),
      name: 'Editors',
      meta: {
        title: 'Editors', icon: 'company'
      },
    },
    {
      path: 'BackupRestore',
      component: () => import('@/views/Settings/BackupRestore/index'),
      name: 'BackupRestore',
      meta: {
        title: 'BackupRestore', icon: 'company'
      },
    },
    {
      path: 'Device',
      component: () => import('@/views/Settings/Device/index'),
      name: 'Devices',
      meta: {
        title: 'Devices', icon: 'company'
      },
    },
    {
      path: 'CompanyInfo',
      component: () => import('@/views/Settings/CompanyInfo/index'),
      name: 'CompanyInfo',
      meta: {
        title: 'CompanyInfo', icon: 'company'
      },
    },
    {
      path: 'Permission',
      component: () => import('@/views/Settings/Permission/index'),
      name: 'Permission',
      meta: {
        title: 'Permissions',
        icon: 'key',
      },
    },
    {
      path: 'ApplicationSetting',
      component: () => import('@/views/Settings/ApplicationSetting/index'),
      name: 'ApplicationSetting',
      meta: {
        title: 'ApplicationSetting',
        icon: 'key',
      },
    }
    

  ]
}

export default SettingsRouter
