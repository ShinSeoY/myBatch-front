import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: { name: 'Login' }
  },
  {
    path: '/',
    name: 'emptyLayout',
    component: () => import('layouts/EmptyLayout.vue'),
    children: [
      {
        name: 'Login',
        path: 'login',
        component: () => import('pages/Login.vue'),
        meta: { noRequireAuth: true }
      },
      {
        name: 'Signup',
        path: 'signup',
        component: () => import('pages/Signup.vue'),
        meta: { noRequireAuth: true }
      }
    ]
  },
  {
    path: '/',
    name: 'defaultLayout',
    component: () => import('layouts/DefaultLayout.vue'),
    meta: { requiredAuth: true },
    children: [
      {
        name: 'Bookmarks',
        path: 'bookmarks',
        component: () => import('pages/Bookmarks.vue')
      },
      {
        name: 'Calculator',
        path: 'calculator',
        component: () => import('pages/Calculator.vue')
      },
      {
        name: 'Notification',
        path: 'notification',
        component: () => import('pages/Notification.vue')
      }
    ]
  }
]

export default routes
