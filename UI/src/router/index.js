import Vue from 'vue'
import VueRouter from 'vue-router'
import RipaHomeContainer from '@/components/features/RipaHomeContainer.vue'
import authentication from '@/authentication'

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
  if (navigator.onLine) {
    if (to.matched.some(record => record.meta.requiresAuthentication)) {
      // this route requires auth, check if logged in
      if (authentication.isAuthenticated()) {
        debugger
        // only proceed if authenticated.
        next()
      } else {
        debugger
        authentication.signIn()
      }
    } else {
      next()
    }
  }
  next()
})

export default router
