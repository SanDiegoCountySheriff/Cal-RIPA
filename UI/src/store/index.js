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
      axios
        .get('https://sdsd-ripa-d-apim.azure-api.us/domain/GetBeats', {
          headers: {
            'Ocp-Apim-Subscription-Key': 'f142a7cd1c0d40279ada26a42c319c94',
            'Cache-Control': 'no-cache',
          },
        })
        .then(response => {
          commit('UPDATE_BEATS', response.data)
        })
      // axios.get('http://localhost:3004/beats').then(response => {
      //   commit('UPDATE_BEATS', response.data)
      // })
    },
    getCities({ commit }) {
      axios
        .get('https://sdsd-ripa-d-apim.azure-api.us/domain/GetCities', {
          headers: {
            'Ocp-Apim-Subscription-Key': 'f142a7cd1c0d40279ada26a42c319c94',
            'Cache-Control': 'no-cache',
          },
        })
        .then(response => {
          commit('UPDATE_CITIES', response.data)
        })
      // axios.get('http://localhost:3004/cities').then(response => {
      //   commit('UPDATE_CITIES', response.data)
      // })
    },
    getSchools({ commit }) {
      axios
        .get('https://sdsd-ripa-d-apim.azure-api.us/domain/GetSchools', {
          headers: {
            'Ocp-Apim-Subscription-Key': 'f142a7cd1c0d40279ada26a42c319c94',
            'Cache-Control': 'no-cache',
          },
        })
        .then(response => {
          commit('UPDATE_SCHOOLS', response.data)
        })
      // axios.get('http://localhost:3004/schools').then(response => {
      //   commit('UPDATE_SCHOOLS', response.data)
      // })
    },
    getStatutes({ commit }) {
      // axios
      //   .get('https://sdsd-ripa-d-apim.azure-api.us/domain/GetStatutes', {
      //     headers: {
      //       'Ocp-Apim-Subscription-Key': 'f142a7cd1c0d40279ada26a42c319c94',
      //       'Cache-Control': 'no-cache',
      //     },
      //   })
      //   .then(response => {
      //     commit('UPDATE_STATUTES', response.data)
      //   })
      axios.get('http://localhost:3004/statutes').then(response => {
        commit('UPDATE_STATUTES', response.data)
      })
    },
  },
  modules: {},
})
