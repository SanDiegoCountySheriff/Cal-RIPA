import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isAdmin: true,
    beats: [],
    cities: [],
    schools: [],
    statutes: [],
  },
  mutations: {
    UPDATE_BEATS(state, items) {
      state.beats = items
    },
    UPDATE_CITIES(state, items) {
      state.cities = items
    },
    UPDATE_SCHOOLS(state, items) {
      state.schools = items
    },
    UPDATE_STATUTES(state, items) {
      state.statutes = items
    },
  },
  actions: {
    getBeats({ commit }) {
      axios.get('http://localhost:3004/beats').then(response => {
        commit('UPDATE_BEATS', response.data)
      })
    },
    getCities({ commit }) {
      axios.get('http://localhost:3004/cities').then(response => {
        commit('UPDATE_CITIES', response.data)
      })
    },
    getSchools({ commit }) {
      axios.get('http://localhost:3004/schools').then(response => {
        commit('UPDATE_SCHOOLS', response.data)
      })
    },
    getStatutes({ commit }) {
      axios.get('http://localhost:3004/statutes').then(response => {
        commit('UPDATE_STATUTES', response.data)
      })
    },
  },
  modules: {},
})
