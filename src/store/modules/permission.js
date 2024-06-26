import { asyncRoutes, constantRoutes } from '@/router'
import path from 'path'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  // console.log(route)
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, basePath, checkedKeys, roles) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    // console.log(hasPermission(roles, tmp))
    if (hasPermission(roles, tmp)) {
      // console.log("tmp", tmp)
      const routePath = path.resolve(basePath, tmp.path)
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(
          tmp.children,
          routePath,
          checkedKeys,
          roles
        )
      }
      if (checkedKeys.includes(routePath) || (tmp.children && tmp.children.length > 0)) {
        res.push(tmp)
      }
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: [],
  redirect: '/'
}
const mutations = {
  SET_ROUTES: (state, routes) => {
    // 404 page must be placed at the end !!!
    routes.push({ path: '*', redirect: '/404', hidden: true })
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_REDIRECT: (state, redirect) => {
    // defualte redirect for user !!!
    state.redirect = redirect
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('systemadmin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        if (roles.userrouter) {
          accessedRoutes = filterAsyncRoutes(asyncRoutes, '/', JSON.parse(roles.userrouter), roles)
        } else { accessedRoutes = [] }
      }
      commit('SET_REDIRECT', roles.defulateRedirect)
      commit('SET_ROUTES', accessedRoutes)

      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
