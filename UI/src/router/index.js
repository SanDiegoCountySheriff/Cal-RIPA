import Vue from 'vue'
import VueRouter from 'vue-router'
import RipaHomeContainer from '@/components/features/RipaHomeContainer.vue'
import store from '@/store/index'
import AuthService from '../services/auth'
import { isValidOfficer } from '@/utilities/officer'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: RipaHomeContainer,
    beforeEnter(to, from, next) {
      if (isValidOfficer()) {
        next()
      } else if (!store.state.user.isAuthenticated) {
        next()
      } else {
        next('/user')
      }
    },
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () =>
      import(
        /* webpackChunkName: "ripa-admin" */ '@/components/features/RipaAdminContainer.vue'
      ),
    beforeEnter(to, from, next) {
      if (store.state.user.isAdmin) {
        next()
      } else {
        next('/')
      }
    },
  },
  {
    path: '/stops',
    name: 'Stops',
    component: () =>
      import(
        /* webpackChunkName: "ripa-stops" */ '@/components/features/RipaOfficerStopsContainer.vue'
      ),
  },
  {
    path: '/user',
    name: 'User',
    component: () =>
      import(
        /* webpackChunkName: "ripa-user" */ '@/components/features/RipaUserContainer.vue'
      ),
  },
  {
    path: '/checkUser',
    name: 'Check User',
    component: () =>
      import(
        /* webpackChunkName: "ripa-user" */ '@/components/features/RipaUserCheckContainer.vue'
      ),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

// if you ever hit the app and the access token
// isn't set and the user is online, start login flow and are offline
router.beforeEach(async (to, from, next) => {
  const isAuthenticated = await AuthService.getIsAuthenticated()
  if (!isAuthenticated && navigator.onLine) {
    if (!sessionStorage.getItem('ripa-logOutAttempt')) {
      const loginAttempt = await AuthService.tryLogin()
      if (loginAttempt) {
        next()
      }
    } else {
      // ONLY if the user has explicity logged out
      // don't automatically try the redirect. Clear the flag
      // and wait for the user to click "Log In" (or submit a form, etc.)
      sessionStorage.removeItem('ripa-logOutAttempt')
      next()
    }
  } else {
    next()
  }
})

export default router
