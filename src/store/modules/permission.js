import { asyncRoutes, constantRoutes } from '@/router'
import path from "path";

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
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
export function filterAsyncRoutes(routes, basePath, checkedKeys) {
  const res = []

  routes.forEach(route => {
    // console.log("route" , route)

    const tmp = { ...route }
    const routePath = path.resolve(basePath, tmp.path);

    ///  console.log("tmp", tmp)
    if (tmp.children) {
      tmp.children = filterAsyncRoutes(
        tmp.children,
        routePath,
        checkedKeys
      );
    }
    if (checkedKeys.includes(routePath) ||
      (tmp.children && tmp.children.length >= 1)) {


      res.push(tmp);
    }

  })

  return res
}



const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {

    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('Admin')) {
        console.log("hi", roles);
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, "/", JSON.parse(roles[0].routes))
      }
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
