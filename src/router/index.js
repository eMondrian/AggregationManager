import { createRouter, createWebHistory } from 'vue-router'
import AggregateListView from '@/pages/AggregateList/Page.vue'
import config from '@/app.config'
import { ROUTES } from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: ROUTES.home.path,
      name: ROUTES.home.name,
      component: AggregateListView
    },
    {
      path: ROUTES.processes.path,
      name: ROUTES.processes.name,
      component: () => import('@/pages/ProcessList/Page.vue')
    },
    {
      path: ROUTES.settings.path,
      name: ROUTES.settings.name,
      component: () => import('@/pages/Settings/Page.vue')
    },
    {
      path: ROUTES.users.path,
      name: ROUTES.users.name,
      component: () => import('@/pages/Users/Page.vue')
    },
    {
      path: '/:catchAll(.*)',
      redirect: { name: ROUTES.home.name }
    }
  ]
})

// NOTE: redirect if no access to admin routes
// router.beforeEach(async (to, from) => {
//   if (
//     config.auth.isKeycloakAuthActive === false &&
//     to.name === ROUTES.users.name
//   ) {
//     return { name: ROUTES.home.name }
//   }
// })

export default router
