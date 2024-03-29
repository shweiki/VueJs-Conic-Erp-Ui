import Layout from '@/layout'

const SettingsRouter = {
  path: '/Settings',
  component: Layout,
  redirect: '/Settings/CompanyInfo',
  name: 'Settings',
  meta: {
    title: 'Settings',
    icon: 'setting'
  },
  children: [

    {
      path: 'Oprationsys',
      component: () => import('@/views/Settings/Oprationsys/index'),
      name: 'Oprationsys',
      meta: {
        title: 'Oprationsys', icon: 'execution'
      }
    },
    {
      path: 'Discount',
      component: () => import('@/views/Settings/Discount/index'),
      name: 'Discount',
      meta: {
        title: 'Discount', icon: 'company'
      }
    },
    {
      path: 'Area',
      component: () => import('@/views/Settings/Areas/index'),
      name: 'Areas',
      meta: {
        title: 'Areas', icon: 'company'
      }
    },
    {
      path: 'BackupRestore',
      component: () => import('@/views/Settings/BackupRestore/index'),
      name: 'BackupRestore',
      meta: {
        title: 'BackupRestore', icon: 'company'
      }
    },
    {
      path: 'Device',
      component: () => import('@/views/Settings/Device/index'),
      name: 'Devices',
      meta: {
        title: 'Devices', icon: 'company'
      }
    },
    {
      path: 'CompanyInfo',
      component: () => import('@/views/Settings/CompanyInfo/index'),
      name: 'CompanyInfo',
      meta: {
        title: 'CompanyInfo', icon: 'company'
      }
    },
    {
      path: 'Permission',
      component: () => import('@/views/Settings/Permission/index'),
      name: 'Permission',
      meta: {
        title: 'Permissions',
        icon: 'key'
      }
    },
    {
      path: 'ApplicationSetting',
      component: () => import('@/views/Settings/ApplicationSetting/index'),
      name: 'ApplicationSetting',
      meta: {
        title: 'ApplicationSetting',
        icon: 'key'
      }
    },
    {
      path: 'JsonEditorSetting',
      component: () => import('@/views/Settings/ApplicationSetting/JsonEditor'),
      name: 'JsonEditorSetting',
      meta: {
        title: 'JsonEditorSetting',
        icon: 'key'
      }
    }

  ]
}

export default SettingsRouter
