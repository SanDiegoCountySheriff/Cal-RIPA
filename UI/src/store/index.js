import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { formatDate } from '@/utilities/dates'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isDark: true,
    isAdmin: true,
    adminBeats: [],
    adminCities: [],
    adminSchools: [],
    adminStatutes: [],
    adminStops: [],
    formBeats: [],
    formCities: [],
    formSchools: [],
    formStatutes: [],
    formStops: [],
  },

  getters: {
    mappedAdminBeats: state => {
      return state.adminBeats
    },
    mappedAdminCities: state => {
      return state.adminCities
    },
    mappedAdminSchools: state => {
      return state.adminSchools
    },
    mappedAdminStatutes: state => {
      return state.adminStatutes
    },
    mappedAdminStops: () => {
      return []
    },
    mappedAdminSubmissions: () => {
      return []
    },
    mappedFormBeats: state => {
      return state.formBeats
    },
    mappedFormCities: state => {
      return state.formCities
    },
    mappedFormSchools: state => {
      return state.formSchools
    },
    mappedFormStatutes: state => {
      return state.formStatutes
    },
    isOnline: () => {
      return navigator.onLine
    },
  },

  mutations: {
    updateAdminBeats(state, items) {
      state.adminBeats = items
    },
    updateAdminCities(state, items) {
      state.adminCities = items
    },
    updateAdminSchools(state, items) {
      state.adminSchools = items
    },
    updateAdminStatutes(state, items) {
      state.adminStatutes = items
    },
    updateFormBeats(state, items) {
      state.formBeats = items
    },
    updateFormCities(state, items) {
      state.formCities = items
    },
    updateFormSchools(state, items) {
      state.formSchools = items
    },
    updateFormStatutes(state, items) {
      state.formStatutes = items
    },
    updateStops(state, items) {
      state.stops = items
    },
  },

  actions: {
    deleteBeat({ dispatch }, beat) {
      return axios
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
          dispatch('getAdminBeats')
        })
    },

    deleteCity({ dispatch }, city) {
      return axios
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
          dispatch('getAdminCities')
        })
    },

    deleteSchool({ dispatch }, school) {
      return axios
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
          dispatch('getAdminSchools')
        })
    },

    deleteStatute({ dispatch }, statute) {
      return axios
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
          dispatch('getAdminStatutes')
        })
    },

    editBeat({ dispatch }, beat) {
      return axios
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
          dispatch('getAdminBeats')
        })
    },

    editCity({ dispatch }, city) {
      return axios
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
          dispatch('getAdminCities')
        })
    },

    editSchool({ dispatch }, school) {
      return axios
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
          dispatch('getAdminSchools')
        })
    },

    editStatute({ dispatch }, statute) {
      return axios
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
          dispatch('getAdminSchools')
        })
    },

    getAdminBeats({ commit }) {
      return axios
        .get('https://sdsd-ripa-d-apim.azure-api.us/domain/GetBeats', {
          headers: {
            'Ocp-Apim-Subscription-Key': 'f142a7cd1c0d40279ada26a42c319c94',
            'Cache-Control': 'no-cache',
          },
        })
        .then(response => {
          const data = response.data.sort((x, y) => {
            const beatA = x.command.toUpperCase()
            const beatB = y.command.toUpperCase()
            return beatA < beatB ? -1 : beatA > beatB ? 1 : 0
          })
          commit('updateAdminBeats', data)
        })
        .catch(() => {
          commit('updateAdminBeats', [])
        })
    },

    getFormBeats({ commit }) {
      const items = localStorage.getItem('ripa_beats')
      if (items !== null) {
        return new Promise(resolve => {
          commit('updateFormBeats', JSON.parse(items))
          resolve()
        })
      } else {
        return axios
          .get('https://sdsd-ripa-d-apim.azure-api.us/domain/GetBeats', {
            headers: {
              'Ocp-Apim-Subscription-Key': 'f142a7cd1c0d40279ada26a42c319c94',
              'Cache-Control': 'no-cache',
            },
          })
          .then(response => {
            const data = response.data
              .sort((x, y) => {
                const beatA = x.command.toUpperCase()
                const beatB = y.command.toUpperCase()
                return beatA < beatB ? -1 : beatA > beatB ? 1 : 0
              })
              .map(item => {
                return {
                  id: item.id,
                  fullName: `${item.command} ${item.id}`,
                }
              })
            commit('updateFormBeats', data)
            localStorage.setItem('ripa_beats', JSON.stringify(data))
          })
          .catch(() => {
            commit('updateFormBeats', [])
          })
      }
    },

    getAdminCities({ commit }) {
      return axios
        .get('https://sdsd-ripa-d-apim.azure-api.us/domain/GetCities', {
          headers: {
            'Ocp-Apim-Subscription-Key': 'f142a7cd1c0d40279ada26a42c319c94',
            'Cache-Control': 'no-cache',
          },
        })
        .then(response => {
          const data = response.data
            .sort((x, y) => {
              const cityA = x.name.toUpperCase()
              const cityB = y.name.toUpperCase()
              return cityA < cityB ? -1 : cityA > cityB ? 1 : 0
            })
            .map(item => {
              return {
                ...item,
                deactivationDate: formatDate(item.deactivationDate),
              }
            })
          commit('updateAdminCities', data)
        })
        .catch(() => {
          commit('updateAdminCities', [])
        })
    },

    getFormCities({ commit }) {
      const items = localStorage.getItem('ripa_cities')
      if (items !== null) {
        return new Promise(resolve => {
          commit('updateFormCities', JSON.parse(items))
          resolve()
        })
      } else {
        return axios
          .get('https://sdsd-ripa-d-apim.azure-api.us/domain/GetCities', {
            headers: {
              'Ocp-Apim-Subscription-Key': 'f142a7cd1c0d40279ada26a42c319c94',
              'Cache-Control': 'no-cache',
            },
          })
          .then(response => {
            const data = response.data
              .sort((x, y) => {
                const cityA = x.name.toUpperCase()
                const cityB = y.name.toUpperCase()
                return cityA < cityB ? -1 : cityA > cityB ? 1 : 0
              })
              .map(item => {
                return {
                  id: item.name.toUpperCase(),
                  fullName: item.name.toUpperCase(),
                }
              })
            commit('updateFormCities', data)
            localStorage.setItem('ripa_cities', JSON.stringify(data))
          })
          .catch(() => {
            commit('updateFormCities', [])
          })
      }
    },

    getAdminSchools({ commit }) {
      return axios
        .get('https://sdsd-ripa-d-apim.azure-api.us/domain/GetSchools', {
          headers: {
            'Ocp-Apim-Subscription-Key': 'f142a7cd1c0d40279ada26a42c319c94',
            'Cache-Control': 'no-cache',
          },
        })
        .then(response => {
          const data = response.data
            .sort((x, y) => {
              const schoolA = x.name.toUpperCase()
              const schoolB = y.name.toUpperCase()
              return schoolA < schoolB ? -1 : schoolA > schoolB ? 1 : 0
            })
            .map(item => {
              return {
                ...item,
                county: item.county ? item.county.toUpperCase() : '',
                district: item.district ? item.district.toUpperCase() : '',
                name: item.name ? item.name.toUpperCase() : '',
                status: item.status ? item.status.toUpperCase() : '',
              }
            })
          commit('updateAdminSchools', data)
        })
        .catch(() => {
          commit('updateAdminSchools', [])
        })
    },

    getFormSchools({ commit }) {
      const items = localStorage.getItem('ripa_schools')
      if (items !== null) {
        return new Promise(resolve => {
          commit('updateFormSchools', JSON.parse(items))
          resolve()
        })
      } else {
        return axios
          .get('https://sdsd-ripa-d-apim.azure-api.us/domain/GetSchools', {
            headers: {
              'Ocp-Apim-Subscription-Key': 'f142a7cd1c0d40279ada26a42c319c94',
              'Cache-Control': 'no-cache',
            },
          })
          .then(response => {
            const data = response.data
              .filter(item => item.status === 'Active')
              .sort((x, y) => {
                const schoolA = x.name.toUpperCase()
                const schoolB = y.name.toUpperCase()
                return schoolA < schoolB ? -1 : schoolA > schoolB ? 1 : 0
              })
              .map(item => {
                return {
                  cdsCode: item.cdsCode,
                  fullName: `${item.name.toUpperCase()} (${item.district.toUpperCase()}) ${
                    item.cdsCode
                  }`,
                }
              })
            commit('updateFormSchools', data)
            localStorage.setItem('ripa_schools', JSON.stringify(data))
          })
          .catch(() => {
            commit('updateFormSchools', [])
          })
      }
    },

    getAdminStatutes({ commit }) {
      return axios
        .get('https://sdsd-ripa-d-apim.azure-api.us/domain/GetStatutes', {
          headers: {
            'Ocp-Apim-Subscription-Key': 'f142a7cd1c0d40279ada26a42c319c94',
            'Cache-Control': 'no-cache',
          },
        })
        .then(response => {
          const data = response.data.map(item => {
            return {
              ...item,
              code: item.offenseCode,
              offenseEnacted: formatDate(item.offenseEnacted),
              offenseRepealed: formatDate(item.offenseRepealed),
            }
          })
          commit('updateAdminStatutes', data)
        })
        .catch(() => {
          commit('updateAdminStatutes', [])
        })
    },

    getFormStatutes({ commit }) {
      const items = localStorage.getItem('ripa_statutes')
      if (items !== null) {
        return new Promise(resolve => {
          commit('updateFormStatutes', JSON.parse(items))
          resolve()
        })
      } else {
        return axios
          .get('https://sdsd-ripa-d-apim.azure-api.us/domain/GetStatutes', {
            headers: {
              'Ocp-Apim-Subscription-Key': 'f142a7cd1c0d40279ada26a42c319c94',
              'Cache-Control': 'no-cache',
            },
          })
          .then(response => {
            const data = response.data
              .filter(item => item.offenseRepealed === null)
              .map(item => {
                return {
                  code: item.offenseCode,
                  description: `${item.offenseStatute} ${item.statuteLiteral} (${item.offenseTypeOfCharge})`,
                }
              })
              .map(item => {
                return {
                  code: item.offenseCode,
                  fullName: `${item.description} ${item.code}`,
                }
              })
            commit('updateFormStatutes', data)
            localStorage.setItem('ripa_statutes', JSON.stringify(data))
          })
          .catch(() => {
            commit('updateFormStatutes', [])
          })
      }
    },

    getStops({ commit }) {
      return axios
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
    },
  },

  modules: {},
})
