import Vue from 'vue'
import VueConfirmDialog from 'vue-confirm-dialog'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.use(VueConfirmDialog)
Vue.component('vue-confirm-dialog', VueConfirmDialog.default)

Vue.use(Vuetify)
