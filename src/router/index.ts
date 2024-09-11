import { route } from 'quasar/wrappers'
import { createMemoryHistory, createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

import routes from './routes'
import { axios } from 'src/boot/axios'

export default route(function () {
  const createHistory = process.env.SERVER ? createMemoryHistory : process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory

  const Router = createRouter({
    history: createHistory(process.env.VUE_ROUTER_BASE),
    routes: routes
  })

  const isValidToken = async (token: any): Promise<boolean> => {
    const res = await axios.post('/member/verify-token', token)
    return res?.data
  }

  Router.beforeEach(async (to, from, next) => {
    const token = localStorage.getItem('token')

    if ((!token || !(await isValidToken(token))) && !to.meta.noRequireAuth) {
      return next({ name: 'Login' })
    }
    return next()
  })
  return Router
})
