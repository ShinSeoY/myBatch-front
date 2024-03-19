import { route } from 'quasar/wrappers'
import { createMemoryHistory, createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

import routes from './routes'
import { axios } from 'src/boot/axios'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER ? createMemoryHistory : process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory

  const Router = createRouter({
    history: createHistory(process.env.VUE_ROUTER_BASE),
    routes: routes
  })

  const verifyToken = async (token: string): Promise<boolean> => {
    const isAuth = await axios.post('/verify-token', { token: token })
    return isAuth.data;
  }

  Router.beforeEach(async (to, from, next) => {
    const token = localStorage.getItem('token');

    if ((!token || (await verifyToken(token))) && !to.meta.noRequireAuth) {
        return next({ name: 'Login' })
    }
    return next()
  })
  return Router
})

