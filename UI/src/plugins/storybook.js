import Vue from 'vue'
import VueConfirmDialog from 'vue-confirm-dialog'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'
import '../assets/vuetify.css'

Vue.use(VueConfirmDialog)
Vue.component('vue-confirm-dialog', VueConfirmDialog.default)

Vue.use(Vuetify)

Vue.component('vue-json-pretty', VueJsonPretty)
