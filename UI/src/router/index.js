import Vue from 'vue'
import VueRouter from 'vue-router'
import RipaHomeContainer from '@/components/features/RipaHomeContainer.vue'
import RipaAdminContainer from '@/components/features/RipaAdminContainer.vue'
import store from '@/store/index'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: RipaHomeContainer,
    meta: {
      requiresAuthentication: true,
    },
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () =>
      import(
        /* webpackChunkName: "ripa-admin" */ '@/components/features/RipaAdminContainer.vue'
      ),
    meta: {
      requiresAuthentication: true,
    },
    beforeEnter(to, from, next) {
      if (store.getters.isOnlineAndAuthenticated && store.state.user.isAdmin) {
        next()
      } else {
        next('/')
      }
    },
    children: [
      {
        path: 'submissions',
        component: RipaAdminContainer,
        props: true,
        children: [
          {
            path: ':submissionId',
            component: RipaAdminContainer,
            props: true,
          },
        ],
      },
      {
        path: 'users',
        component: RipaAdminContainer,
        props: true,
      },
      {
        path: 'stops',
        component: RipaAdminContainer,
        props: true,
      },
      {
        path: 'domains',
        component: RipaAdminContainer,
        props: true,
      },
    ],
  },
  {
    path: '/stops',
    name: 'Stops',
    component: () =>
      import(
        /* webpackChunkName: "ripa-stops" */ '@/components/features/RipaOfficerStopsContainer.vue'
      ),
    meta: {
      requiresAuthentication: true,
    },
    beforeEnter(to, from, next) {
      if (store.getters.isOnlineAndAuthenticated) {
        next()
      } else {
        next('/')
      }
    },
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
