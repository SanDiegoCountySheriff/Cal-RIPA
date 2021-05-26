import Vue from 'vue'
import VueRouter from 'vue-router'
import RipaHomeContainer from '@/components/features/RipaHomeContainer.vue'
import RipaAdminContainer from '@/components/features/RipaAdminContainer.vue'
import store from '@/store/index'
import AuthService from '../services/auth'
import RipaAdminContainerStories from '../stories/containers/RipaAdminContainer.stories'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: RipaHomeContainer,
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
    path: '/admin/submission/:submissionId',
    component: RipaAdminContainer,
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
  // check for log in here
  const isTokenValid = await AuthService.checkToken()
  if (!isTokenValid) {
    // if the token ISN'T valid, check to see if the user manually logged out
    const didManualLogOut = AuthService.checkManualLogOut()
    // if they DID manually logout, don't auto try to login again
    // if they did NOT manually logout, auto try the login again
    if (!didManualLogOut) {
      const loginAttempt = await AuthService.tryLogin()
      if (loginAttempt) {
        next()
      }
    } else {
      next()
    }
  } else {
    // if the token IS valid, clear any log out attempt
    AuthService.clearManualLogOut()
    next()
  }
})

export default router
