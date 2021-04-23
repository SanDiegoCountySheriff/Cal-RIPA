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
    stops: [],
  },

  getters: {
    mappedStatutes: state => {
      return state.statutes
    },

    isOnline: () => {
      return navigator.onLine
    },
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
    UPDATE_STOPS(state, items) {
      state.stops = items
    },
  },

  actions: {
    deleteBeat({ dispatch }, beat) {
      axios
        .put(
          `https://sdsd-ripa-d-apim.azure-api.us/domain/DeleteBeat/${beat.id}`,
          {
            headers: {
              'Ocp-Apim-Subscription-Key': 'f142a7cd1c0d40279ada26a42c319c94',
              'Cache-Control': 'no-cache',
            },
          },
        )
        .then(() => {
          dispatch('getBeats')
        })
    },

    deleteCity({ dispatch }, city) {
      axios
        .put(
          `https://sdsd-ripa-d-apim.azure-api.us/domain/DeleteCity/${city.id}`,
          {
            headers: {
              'Ocp-Apim-Subscription-Key': 'f142a7cd1c0d40279ada26a42c319c94',
              'Cache-Control': 'no-cache',
            },
          },
        )
        .then(() => {
          dispatch('getCities')
        })
    },

    deleteSchool({ dispatch }, school) {
      axios
        .put(
          `https://sdsd-ripa-d-apim.azure-api.us/domain/DeleteSchool/${school.id}`,
          {
            headers: {
              'Ocp-Apim-Subscription-Key': 'f142a7cd1c0d40279ada26a42c319c94',
              'Cache-Control': 'no-cache',
            },
          },
        )
        .then(() => {
          dispatch('getSchools')
        })
    },

    deleteStatute({ dispatch }, statute) {
      axios
        .put(
          `https://sdsd-ripa-d-apim.azure-api.us/domain/DeleteStatute/${statute.id}`,
          {
            headers: {
              'Ocp-Apim-Subscription-Key': 'f142a7cd1c0d40279ada26a42c319c94',
              'Cache-Control': 'no-cache',
            },
          },
        )
        .then(() => {
          dispatch('getStatutes')
        })
    },

    editBeat({ dispatch }, beat) {
      axios
        .put(
          `https://sdsd-ripa-d-apim.azure-api.us/domain/PutBeat/${beat.id}`,
          beat,
          {
            headers: {
              'Content-Type': 'application/json',
              'Ocp-Apim-Subscription-Key': 'f142a7cd1c0d40279ada26a42c319c94',
              'Cache-Control': 'no-cache',
            },
          },
        )
        .then(() => {
          dispatch('getBeats')
        })
    },

    editCity({ dispatch }, city) {
      axios
        .put(
          `https://sdsd-ripa-d-apim.azure-api.us/domain/PutCity/${city.rowKey}`,
          city,
          {
            headers: {
              'Content-Type': 'application/json',
              'Ocp-Apim-Subscription-Key': 'f142a7cd1c0d40279ada26a42c319c94',
              'Cache-Control': 'no-cache',
            },
          },
        )
        .then(() => {
          dispatch('getCities')
        })
    },

    editSchool({ dispatch }, school) {
      axios
        .put(
          `https://sdsd-ripa-d-apim.azure-api.us/domain/PutCity/${school.rowKey}`,
          school,
          {
            headers: {
              'Content-Type': 'application/json',
              'Ocp-Apim-Subscription-Key': 'f142a7cd1c0d40279ada26a42c319c94',
              'Cache-Control': 'no-cache',
            },
          },
        )
        .then(() => {
          dispatch('getSchools')
        })
    },

    editStatute({ dispatch }, statute) {
      axios
        .put(
          `https://sdsd-ripa-d-apim.azure-api.us/domain/PutStatute/${statute.rowKey}`,
          statute,
          {
            headers: {
              'Content-Type': 'application/json',
              'Ocp-Apim-Subscription-Key': 'f142a7cd1c0d40279ada26a42c319c94',
              'Cache-Control': 'no-cache',
            },
          },
        )
        .then(() => {
          dispatch('getSchools')
        })
    },

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
          const mappedData = response.data.map(item => {
            return {
              ...item,
              county: item.county ? item.county.toUpperCase() : '',
              district: item.district ? item.district.toUpperCase() : '',
              name: item.name ? item.name.toUpperCase() : '',
              status: item.status ? item.status.toUpperCase() : '',
            }
          })
          commit('UPDATE_SCHOOLS', mappedData)
        })
    },

    getStatutes({ commit }) {
      axios
        .get('https://sdsd-ripa-d-apim.azure-api.us/domain/GetStatutes', {
          headers: {
            'Ocp-Apim-Subscription-Key': 'f142a7cd1c0d40279ada26a42c319c94',
            'Cache-Control': 'no-cache',
          },
        })
        .then(response => {
          commit('UPDATE_STATUTES', response.data)
        })
    },

    getStops({ commit }) {
      axios
        .get('https://sdsd-ripa-d-apim.azure-api.us/stop/GetStops', {
          headers: {
            'Ocp-Apim-Subscription-Key': 'f142a7cd1c0d40279ada26a42c319c94',
            'Cache-Control': 'no-cache',
          },
        })
        .then(response => {
          commit('UPDATE_STOPS', response.data)
        })
      // axios.get('http://localhost:3004/stops').then(response => {
      //   commit('UPDATE_STOPS', response.data)
      // })
    },
  },
  modules: {},
})
