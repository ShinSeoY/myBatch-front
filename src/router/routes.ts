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
      // {
      //   name: 'MyHome',
      //   path: 'myHome',
      //   component: () => import('pages/MyHome.vue')
      // },
      // {
      //   name: 'TestBar',
      //   path: 'testBar',
      //   component: () => import('components/TestBar.vue')
      // },
      // {
      //   path: 'question',
      //   component: () => import('pages/question/Question.vue'),
      //   children: [
      //     {
      //       name: 'QuestionList',
      //       path: '',
      //       component: () => import('pages/question/QuestionList.vue')
      //     },
      //     {
      //       name: 'QuestionDetail',
      //       path: ':seq',
      //       component: () => import('pages/question/QuestionDetail.vue')
      //     },
      //     {
      //       name: 'QuestionCreate',
      //       path: 'create',
      //       component: () => import('pages/question/QuestionDetail.vue')
      //     }
      //   ]
      // }
    ]
  }
]

export default routes
