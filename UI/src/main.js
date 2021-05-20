import Vue from 'vue'
import App from './App.vue'
import wb from './registerServiceWorker'
import router from './router'
import store from './store'
import './plugins/tailwind'
import vuetify from './plugins/vuetify'
import VueConfirmDialog from 'vue-confirm-dialog'
import AuthService from './services/auth'

Vue.config.productionTip = false

Vue.prototype.$workbox = wb

Vue.use(VueConfirmDialog)
Vue.component('vue-confirm-dialog', VueConfirmDialog.default)

appStartup()

async function appStartup() {
  const isAuthenticated = await AuthService.getIsAuthenticated()
  if (!isAuthenticated && navigator.onLine) {
    const loginAttempt = await AuthService.tryLogin()
    if (loginAttempt) {
      new Vue({
        router,
        store,
        vuetify,
        render: h => h(App),
      }).$mount('#app')
    }
  } else {
    new Vue({
      router,
      store,
      vuetify,
      render: h => h(App),
    }).$mount('#app')
  }
}
