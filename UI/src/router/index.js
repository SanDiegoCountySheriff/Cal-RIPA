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

// if you ever hit the app and the login config
// isn't set, start login flow
router.beforeEach(async (to, from, next) => {
  console.log(sessionStorage.getItem('ripa-accessToken'))
  if (!sessionStorage.getItem('ripa-accessToken')) {
    await AuthService.tryLogin()
    next()
  } else {
    console.log(store.state.user)
    next()
  }
})

export default router
