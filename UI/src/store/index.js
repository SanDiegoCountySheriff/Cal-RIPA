import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { formatDate } from '@/components/utilities/dates'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isDark: true,
    isAdmin: true,
    beats: [],
    cities: [],
    schools: [],
    statutes: [],
    stops: [],
  },

  getters: {
    mappedBeats: state => {
      return state.beats
    },
    mappedCities: state => {
      return state.cities.map(item => {
        return {
          ...item,
          deactivationDate: formatDate(item.deactivationDate),
        }
      })
    },
    mappedSchools: state => {
      return state.schools.map(item => {
        return {
          ...item,
          county: item.county ? item.county.toUpperCase() : '',
          district: item.district ? item.district.toUpperCase() : '',
          name: item.name ? item.name.toUpperCase() : '',
          status: item.status ? item.status.toUpperCase() : '',
        }
      })
    },
    mappedStatutes: state => {
      return state.statutes.map(item => {
        return {
          ...item,
          offenseEnacted: formatDate(item.offenseEnacted),
          offenseRepealed: formatDate(item.offenseRepealed),
        }
      })
    },
    mappedSubmissions: state => {
      return state.submissions
    },
    isOnline: () => {
      return navigator.onLine
    },
  },

  mutations: {
    updateBeats(state, items) {
      state.beats = items
    },
    updateCities(state, items) {
      state.cities = items
    },
    updateSchools(state, items) {
      state.schools = items
    },
    updateStatutes(state, items) {
      state.statutes = items
    },
    updateStops(state, items) {
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
      const items = localStorage.getItem('ripa_beats')
      if (items !== null) {
        return new Promise(resolve => {
          commit('updateBeats', JSON.parse(items))
          resolve()
        })
      } else {
        axios
          .get('https://sdsd-ripa-d-apim.azure-api.us/domain/GetBeats', {
            headers: {
              'Ocp-Apim-Subscription-Key': 'f142a7cd1c0d40279ada26a42c319c94',
              'Cache-Control': 'no-cache',
            },
          })
          .then(response => {
            commit('updateBeats', response.data)
            localStorage.setItem('ripa_beats', JSON.stringify(response.data))
          })
          .catch(() => {
            commit('updateBeats', [])
          })
      }
    },

    getCities({ commit }) {
      const items = localStorage.getItem('ripa_cities')
      if (items !== null) {
        return new Promise(resolve => {
          commit('updateCities', JSON.parse(items))
          resolve()
        })
      } else {
        axios
          .get('https://sdsd-ripa-d-apim.azure-api.us/domain/GetCities', {
            headers: {
              'Ocp-Apim-Subscription-Key': 'f142a7cd1c0d40279ada26a42c319c94',
              'Cache-Control': 'no-cache',
            },
          })
          .then(response => {
            commit('updateCities', response.data)
            localStorage.setItem('ripa_cities', JSON.stringify(response.data))
          })
          .catch(() => {
            commit('updateCities', [])
          })
      }
    },

    getSchools({ commit }) {
      const items = localStorage.getItem('ripa_schools')
      if (items !== null) {
        return new Promise(resolve => {
          commit('updateSchools', JSON.parse(items))
          resolve()
        })
      } else {
        axios
          .get('https://sdsd-ripa-d-apim.azure-api.us/domain/GetSchools', {
            headers: {
              'Ocp-Apim-Subscription-Key': 'f142a7cd1c0d40279ada26a42c319c94',
              'Cache-Control': 'no-cache',
            },
          })
          .then(response => {
            commit('updateSchools', response.data)
            localStorage.setItem('ripa_schools', JSON.stringify(response.data))
          })
          .catch(() => {
            commit('updateSchools', [])
          })
      }
    },

    getStatutes({ commit }) {
      const items = localStorage.getItem('ripa_statutes')
      if (items !== null) {
        return new Promise(resolve => {
          commit('updateStatutes', JSON.parse(items))
          resolve()
        })
      } else {
        axios
          .get('https://sdsd-ripa-d-apim.azure-api.us/domain/GetStatutes', {
            headers: {
              'Ocp-Apim-Subscription-Key': 'f142a7cd1c0d40279ada26a42c319c94',
              'Cache-Control': 'no-cache',
            },
          })
          .then(response => {
            commit('updateStatutes', response.data)
            localStorage.setItem('ripa_statutes', JSON.stringify(response.data))
          })
          .catch(() => {
            commit('UPDATE_STATUES', [])
          })
      }
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
          commit('updateStops', response.data)
        })
        .catch(() => {
          commit('updateStops', [])
        })
      // axios.get('http://localhost:3004/stops').then(response => {
      //   commit('updateStops', response.data)
      // })
    },

    getUsers({ commit }) {
      axios
        .get('https://sdsd-ripa-d-apim.azure-api.us/userProfile/GetUsers', {
          headers: {
            'Ocp-Apim-Subscription-Key': 'f142a7cd1c0d40279ada26a42c319c94',
            'Cache-Control': 'no-cache',
          },
        })
        .then(response => {
          console.log('getUsers', response.data)
          commit('UPDATE_USERS', response.data)
        })
        .catch(() => {
          commit('UPDATE_USERS', [])
        })
    },
  },
  modules: {},
})
