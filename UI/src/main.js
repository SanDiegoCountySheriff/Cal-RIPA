import Vue from 'vue'
import App from './App.vue'
import wb from './registerServiceWorker'
import router from './router'
import store from './store'
import './plugins/tailwind'
import vuetify from './plugins/vuetify'
import './plugins/auth'

Vue.config.productionTip = false

Vue.prototype.$workbox = wb

const tryAuthentication = () => {}

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
  created: tryAuthentication,
}).$mount('#app')
