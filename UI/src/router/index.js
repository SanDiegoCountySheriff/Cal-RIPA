import Vue from 'vue'
import VueRouter from 'vue-router'
import RipaFormContainer from '@/components/features/RipaFormContainer'
import RipaAdminContainer from '@/components/features/RipaAdminContainer'
import store from '@/store/index'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: RipaFormContainer,
    meta: {
      requiresAuthentication: true,
    },
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () =>
      import(
        /* webpackChunkName: "ripa-admin" */ '@/components/features/RipaAdminContainer'
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
        /* webpackChunkName: "ripa-stops" */ '@/components/features/RipaOfficerStopsContainer'
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
