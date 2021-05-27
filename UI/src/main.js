import Vue from 'vue'
import App from './App.vue'
import wb from './registerServiceWorker'
import router from './router'
import store from './store'
import './plugins/tailwind'
import vuetify from './plugins/vuetify'
import VueConfirmDialog from 'vue-confirm-dialog'
import authentication from './authentication'

Vue.config.productionTip = false

Vue.prototype.$workbox = wb

Vue.use(VueConfirmDialog)
Vue.component('vue-confirm-dialog', VueConfirmDialog.default)

authentication.initialize().then(_ => {
  /* eslint-disable no-new */
  new Vue({
    router,
    store,
    vuetify,
    render: h => h(App),
  }).$mount('#app')
})
