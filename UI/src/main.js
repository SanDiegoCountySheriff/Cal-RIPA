import Vue from 'vue'
import App from './App.vue'
import wb from './registerServiceWorker'
import router from './router'
import store from './store'
import './plugins/tailwind'
import vuetify from './plugins/vuetify'
// import { msal, msalInstance } from './plugins/auth'

Vue.config.productionTip = false

Vue.prototype.$workbox = wb

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app')
