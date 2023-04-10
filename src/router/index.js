import { createRouter, createWebHistory } from 'vue-router'
import AggregateListView from '@/views/AggregateListView.vue'
import { ROUTES } from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: ROUTES.aggregations.path,
      name: ROUTES.aggregations.name,
      component: AggregateListView
    },
    {
      path: ROUTES.processes.path,
      name: ROUTES.processes.name,
      component: () => import('@/views/ProcessListView.vue')
    },
    { 
      path: '/:catchAll(.*)',
      redirect: { name: ROUTES.aggregations.name }
    }
  ]
})

export default router
