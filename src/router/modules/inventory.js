import Layout from '@/layout'

const InventoryRouter = {
  path: '/Inventorys',
  component: Layout,
  redirect: '/Inventory/index',
  name: 'Inventorys',
  meta: {
    title: 'Inventories', icon: 'inventory'
  },
  children: [
    {
      path: 'Items',
      component: () => import('@/views/Inventory/Item/List'),
      name: 'Items',
      meta: {
        title: 'Items', icon: 'item'
      },
    },
    {
      path: 'ItemMove',
      component: () => import('@/views/Inventory/Item/ItemMove'),
      name: 'ItemMove',
      meta: {
        title: 'ItemMove', icon: 'item'
      },
    },
    {
      path: 'index',
      component: () => import('@/views/Inventory/index'),
      name: 'Inventory',
      meta: {
        title: 'Inventory', icon: 'inventory (1)'
      },
    },
    {
      path: '/OrderInventories',
      component: () => import('@/views/Inventory/OrderInventories/index'),
      redirect: '/OrderInventories/List',
      name: 'OrderInventory',
      meta: { title: 'OrderInventory', icon: 'orderinv' },
      children: [
        {
          path: 'Create',
          component: () => import('@/views/Inventory/OrderInventories/Create'),
          name: 'NewOrderInventory',
          meta: { title: 'NewOrderInventory', icon: 'box2' }
        },

        {
          path: 'Edit/:id(\\d+)',
          component: () => import('@/views/Inventory/OrderInventories/Edit'),
          name: 'EditOrderInventory',
          meta: {
            title: 'Edit Order Inventory', noCache: true, activeMenu: '/Inventory/OrderInventories/List'
          },
          hidden: true,
        },
        {
          path: 'List',
          component: () => import('@/views/Inventory/OrderInventories/List'),
          name: 'ListOrderInventory',
          meta: {
            title: 'ListOrderInventory', icon: 'orderinv'
          },
        }
      ]
    },
    {
      path: '/Classifications',
      redirect: '/MenuItem',
      component: () => import('@/views/Inventory/Classifications/index'),
      meta: { title: 'Classifications', icon: 'technical-support' },
      children: [
        {
          path: 'MenuItem',
          component: () => import('@/views/Inventory/Classifications/MenuItem/index'),
          name: 'MenuItem',
          meta: {
            title: 'MenuItem', icon: 'maintenance'
          },
        },
        {
          path: 'OriginItem',
          component: () => import('@/views/Inventory/Classifications/OriginItem/index'),
          name: 'OriginItem',
          meta: {
            title: 'OriginItem', icon: 'flags'
          },
        },
        {
          path: 'UnitItem',
          component: () => import('@/views/Inventory/Classifications/UnitItem/index'),
          name: 'UnitItem',
          meta: {
            title: 'UnitItem', icon: 'design-tool'
          },
        }
      ]
    },
    {
      path: 'Stocktaking',
      redirect: '/StockItem',
      component: () => import('@/views/Inventory/Stocktaking/index'),
      meta: {
        title: 'Stocktaking', icon: 'stocktake'
      },
      children: [
        {
          path: 'StockItem',
          component: () => import('@/views/Inventory/Stocktaking/StockItem/index'),
          name: 'StockItem',
          meta: {
            title: 'StockItem', icon: 'stockitem'
          },
        },
        {
          path: 'NewStock',
          component: () => import('@/views/Inventory/Stocktaking/NewStock/index'),
          name: 'NewStock',
          meta: {
            title: 'NewStock', icon: 'newstock'
          },
        }
      ]
    }

  ]
}

export default InventoryRouter
