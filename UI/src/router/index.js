import Vue from 'vue'
import VueRouter from 'vue-router'
import RipaFormContainer from '@/components/features/RipaFormContainer.vue'
import RipaHomeContainer from '@/components/features/RipaHomeContainer.vue'
import RipaLoginCheckContainer from '@/components/features/RipaLoginCheckContainer'
import store from '@/store/index'
import AuthService from '../services/auth'

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
    path: '/login',
    name: 'Login',
    component: RipaLoginCheckContainer,
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
        /* webpackChunkName: "ripa-stops" */ '@/components/features/RipaStopsContainer.vue'
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
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

// if you ever hit the app and the access token
// isn't set and the user is online, start login flow and are offline
router.beforeEach(async (to, from, next) => {
  if (!sessionStorage.getItem('ripa-accessToken') && store.state.isOnline) {
    const loginAttempt = await AuthService.tryLogin()
    if (loginAttempt) {
      next()
    }
  } else {
    next()
  }
})

export default router
