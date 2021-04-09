import Vue from 'vue'
import VueRouter from 'vue-router'
import RipaFormContainer from '@/components/features/RipaFormContainer.vue'
import RipaHomeContainer from '@/components/features/RipaHomeContainer.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: RipaHomeContainer,
  },
  {
    path: '/form',
    name: 'Form',
    component: RipaFormContainer,
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/components/features/RipaAdminContainer.vue'),
  },
  {
    path: '/stops',
    name: 'Stops',
    component: () => import('@/components/features/RipaStopsContainer.vue'),
  },
  {
    path: '/user',
    name: 'User',
    component: () => import('@/components/features/RipaUserContainer.vue'),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
