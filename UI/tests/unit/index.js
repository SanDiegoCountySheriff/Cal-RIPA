import Vue from 'vue'
import Vuetify from 'vuetify'

Vue.config.productionTip = false
Vue.use(Vuetify)

HTMLCanvasElement.prototype.getContext = () => {
  const App = document.createElement('div')
  App.setAttribute('data-app', true)
  document.body.appendChild(App)
}
