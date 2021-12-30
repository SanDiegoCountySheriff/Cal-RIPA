import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { nanoid } from 'nanoid'
import { formatDate, differenceInYears } from '@/utilities/dates'
import authentication from '@/authentication'

Vue.use(Vuex)

// Setup Axios Response Interceptors
// to add the authentication token to each header
axios.interceptors.request.use(
  req => {
    if (req.url === '/config.json') {
      return req
    } else {
      authentication.acquireToken().then(token => {
        req.headers.Authorization = `Bearer ${token}`
        return req
      })
    }
    return req
  },
  function (error) {
    return Promise.reject(error)
  },
)

export default new Vuex.Store({
  state: {
    isDark: true,
    isOnline: false,
    adminBeats: [],
    adminCities: [],
    adminSchools: [],
    adminStatutes: [],
    adminStops: {},
    adminSubmissions: {},
    adminSubmission: null,
    adminUsers: [],
    agencyQuestions: [],
    formBeats: [],
    formCountyCities: [],
    formNonCountyCities: [],
    formSchools: [],
    formStatutes: [],
    formStops: [],
    formTemplates: [],
    user: {
      agency: '',
      oid: '',
      isAdmin: false,
      isInvalid: null,
      isAuthenticated: false,
      officerId: null,
      officerName: null,
      assignment: null,
      otherType: null,
    },
    apiConfig: null,
    piiDate: null,
    officerStops: [],
    gpsLocationAddress: null,
    errorCodeAdminSearch: {
      loading: false,
      items: [],
      search: null,
      select: null,
    },
    stopSubmissionStatusTotal: 0,
    stopSubmissionStatusError: 0,
    stopSubmissionPassedIds: [],
    stopSubmissionFailedStops: [],
    stopsWithErrors: [],
    cpraReportStats: {},
    historicalCpraReports: [],
    piiServiceAvailable: true,
  },

  getters: {
    isAdmin: state => {
      return state.user.isAdmin
    },
    isAuthenticated: () => {
      return authentication.isAuthenticated()
    },
    isOnline: state => {
      return state.isOnline
    },
    isOnlineAndAuthenticated: state => {
      return state.isOnline && authentication.isAuthenticated()
    },
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
    mappedAdminStops: state => {
      return state.adminStops
    },
    mappedAdminSubmissions: state => {
      return state.adminSubmissions
    },
    mappedAdminSubmission: state => {
      if (state.adminSubmission) {
        const mappedAdminSubmissionStops = state.adminSubmission.stops.map(
          stopObj => {
            const mappedErrors = stopObj.listSubmission.map(
              stopSubmissionObj => {
                const stopSubmissionId = stopSubmissionObj.id
                const errorArray = []
                if (
                  stopSubmissionObj.listSubmissionError &&
                  stopSubmissionObj.listSubmissionError.length
                ) {
                  stopSubmissionObj.listSubmissionError.forEach(errorObj => {
                    // add a class if the submission error came from the current submission
                    // so these will be colored differently
                    const className =
                      stopSubmissionId === state.adminSubmission.submission.id
                        ? 'currentSubmission'
                        : ''
                    errorArray.push(
                      `<p class="${className}">${
                        errorObj.code
                      }: ${errorObj.message.substr(0, 200)} ...</p>`,
                    )
                  })
                  return errorArray.join('')
                } else {
                  return ''
                }
              },
            )
            return {
              ...stopObj,
              error: mappedErrors.join(''),
            }
          },
        )
        return {
          ...state.adminSubmission,
          stops: mappedAdminSubmissionStops,
        }
      } else {
        return null
      }
    },
    mappedAdminUsers: state => {
      return state.adminUsers
    },
    mappedFormBeats: state => {
      return state.formBeats
        .filter(item => item.id)
        .map(item => {
          return {
            fullName: item.fullName,
            id: item.id.toString(),
          }
        })
    },
    mappedFormCountyCities: state => {
      return state.formCountyCities
    },
    mappedFormNonCountyCities: state => {
      return state.formNonCountyCities
    },
    mappedFormSchools: state => {
      return state.formSchools
    },
    mappedFormStatutes: state => {
      return state.formStatutes
    },
    mappedUser: state => {
      return {
        agency: state.user.agency,
        assignment: state.user.assignment,
        favoriteLocations: state.user.favoriteLocations,
        favoriteReasons: state.user.favoriteReasons,
        favoriteResults: state.user.favoriteResults,
        firstName: state.user.firstName,
        id: state.user.oid,
        lastName: state.user.lastName,
        name: state.user.name,
        officerId: state.user.officerId,
        officerName: state.user.officerName,
        oid: state.user.oid,
        otherType: state.user.otherType,
        startDate: formatDate(state.user.startDate),
        yearsExperience: state.user.yearsExperience,
      }
    },
    stopTemplates: state => {
      return state.formTemplates
    },
    officerId: state => {
      return state.user.officerId
    },
    user: state => {
      return state.user
    },
    apiConfig: state => {
      return state.apiConfig
    },
    invalidUser: state => {
      return state.user.isInvalid
    },
    displayBeatInput: state => {
      return state.apiConfig?.displayBeatInput || false
    },
    displayDebugger: state => {
      return state.apiConfig?.displayDebugger || false
    },
    environmentName: state => {
      switch (state.apiConfig.environmentName) {
        case 'PROD':
          return 'PROD'
        case 'DEV':
          return 'DEV'
        case 'QA':
          return 'QA'

        default:
          return 'PROD'
      }
    },
    mappedGpsLocationAddress: state => {
      if (
        state.gpsLocationAddress === undefined ||
        state.gpsLocationAddress === null
      ) {
        return {
          blockNumber: null,
          streetName: null,
          city: null,
        }
      }

      const blockNumber = state.gpsLocationAddress.address.AddNum
      const parsedBlockNumber = blockNumber ? parseInt(blockNumber) : null
      const streetName = state.gpsLocationAddress.address.Address
      const parsedStreetName = streetName
        ? streetName.replace(blockNumber, '').trim()
        : null
      const city = state.gpsLocationAddress?.address?.City || 'NO CITY'
      const upperCaseCity = city ? city.toUpperCase() : city
      const countyCityFound =
        state.formCountyCities.filter(item => item.id === upperCaseCity)
          .length > 0
      const nonCountyCityFound =
        state.formNonCountyCities.filter(item => item.id === upperCaseCity)
          .length > 0
      const parsedCity =
        countyCityFound || nonCountyCityFound ? upperCaseCity : null
      const latitude = state.gpsLocationAddress?.latitude || null
      const longitude = state.gpsLocationAddress?.longitude || null

      return {
        blockNumber: parsedBlockNumber,
        streetName: parsedStreetName,
        city: parsedCity,
        latitude,
        longitude,
      }
    },
    mappedErrorCodeAdminSearch: state => {
      return state.errorCodeAdminSearch
    },
    mappedStopSubmissionStatus: state => {
      const totalStops = state.stopSubmissionStatusTotal
      const totalStopsText =
        totalStops === 1 ? `${totalStops} stop` : `${totalStops} stops`
      const errorStops = state.stopSubmissionStatusError
      const errorStopsText =
        errorStops === 1 ? `${errorStops} error` : `${errorStops} errors`
      const wereWasText = totalStops === 1 ? 'was' : 'were'
      return `${totalStopsText} ${wereWasText} submitted and ${errorStopsText}`
    },
    mappedStopSubmissionPassedIds: state => {
      return state.stopSubmissionPassedIds
    },
    mappedStopSubmissionFailedStops: state => {
      return state.stopSubmissionFailedStops
    },
    mappedStopsWithErrors: state => {
      return state.stopsWithErrors
    },
    mappedAdminCpraReportStats: state => {
      return state.cpraReportStats
    },
    mappedAdminHistoricalCpraReports: state => {
      return state.historicalCpraReports
    },
    piiServiceAvailable: state => {
      return state.piiServiceAvailable
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
    updateAdminUsers(state, items) {
      state.adminUsers = items
    },
    updateConnectionStatus(state, online) {
      state.isOnline = online
    },
    updateFormBeats(state, items) {
      state.formBeats = items
    },
    updateFormCountyCities(state, items) {
      state.formCountyCities = items
    },
    updateFormNonCountyCities(state, items) {
      state.formNonCountyCities = items
    },
    updateFormSchools(state, items) {
      state.formSchools = items
    },
    updateFormStatutes(state, items) {
      state.formStatutes = items
    },
    updateFormTemplates(state, items) {
      state.formTemplates = items
    },
    updateGpsLocationAddress(state, data) {
      state.gpsLocationAddress = data
    },
    updateOfficerStops(state, items) {
      state.officerStops = items
    },
    updateAdminStops(state, items) {
      state.adminStops = items
    },
    updateAdminSubmissions(state, items) {
      state.adminSubmissions = {
        submissions: items.submissions,
        total: items.total,
      }
    },
    updateAdminSubmission(state, items) {
      state.adminSubmission = items
    },
    updatePiiDate(state) {
      state.piiDate = new Date()
    },
    updateApiConfig(state, value) {
      state.apiConfig = value
    },
    updateAgencyQuestions(state, value) {
      localStorage.removeItem('ripa_agency_questions')
      const agencyQuestions = value.agencyQuestions || null

      if (agencyQuestions) {
        const questions = value.agencyQuestions.map(item => {
          return {
            name: item.Name || 'N/A',
            type: item.Type,
            prompt: item.Prompt,
            hint: item.Hint || null,
            maxLength: item.MaxLength,
            required: item.Required,
          }
        })
        if (questions.length > 0) {
          localStorage.setItem(
            'ripa_agency_questions',
            JSON.stringify(questions),
          )
        }
        state.agencyQuestions = questions
      }
    },
    updateInvalidUser(state, value) {
      state.user = {
        ...state.user,
        isInvalid: value,
      }
    },
    updateUserAccount(state, value) {
      if (value && value.profile) {
        let isAnAdmin = false
        const roles = value.profile?.roles || []
        isAnAdmin = roles.filter(roleObj => {
          return roleObj === 'RIPA-ADMINS-ROLE'
        })
        const firstName = value.profile.given_name
        const lastName = value.profile.family_name
        const fullName = value.profile.upn.split('@')[0]

        state.user = {
          ...state.user,
          email: value.profile.email,
          firstName,
          fullName,
          isAdmin: isAnAdmin.length > 0,
          isAuthenticated: true,
          lastName,
          oid: value.profile.oid,
        }
      }
    },
    updateUserProfile(state, value) {
      let yearsExperience = value.yearsExperience
      if (!yearsExperience) {
        yearsExperience = differenceInYears(value.startDate)
      }

      state.user = {
        ...state.user,
        id: state.user.oid,
        agency: value.agency,
        assignment: value.assignment ? Number(value.assignment) : null,
        favoriteLocations: value.favoriteLocations || '',
        favoriteReasons: value.favoriteReasons || '',
        favoriteResults: value.favoriteResults || '',
        officerId: value.officerId,
        otherType: value.otherType ? value.otherType : null,
        startDate: value.startDate,
        yearsExperience,
      }

      const officer = {
        agency: state.user.agency,
        assignment: state.user.assignment,
        officerId: state.user.officerId,
        officerName: state.user.fullName,
        otherType: state.user.otherType,
        startDate: formatDate(state.user.startDate),
        yearsExperience: state.user.yearsExperience,
      }

      localStorage.setItem('ripa_officer', JSON.stringify(officer))
      localStorage.setItem(
        'ripa_favorite_locations',
        state.user.favoriteLocations,
      )
      localStorage.setItem('ripa_favorite_reasons', state.user.favoriteReasons)
      localStorage.setItem('ripa_favorite_results', state.user.favoriteResults)
    },
    updateUserFavoriteLocations(state, locations) {
      state.user.favoriteLocations = locations
    },
    updateUserFavoriteReasons(state, reasons) {
      state.user.favoriteReasons = reasons
    },
    updateUserFavoriteResults(state, results) {
      state.user.favoriteResults = results
    },
    updateErrorCodeAdminSearch(state, value) {
      state.errorCodeAdminSearch = {
        ...state.errorCodeAdminSearch,
        loading: false,
        items: value,
      }
    },
    updateStopSubmissionStatusTotal(state, count) {
      state.stopSubmissionStatusTotal =
        count === null ? 0 : state.stopSubmissionStatusTotal + count
    },
    updateStopSubmissionStatusError(state, count) {
      state.stopSubmissionStatusError =
        count === null ? 0 : state.stopSubmissionStatusError + count
    },
    updateStopSubmissionPassedIds(state, id) {
      if (id === null) {
        state.stopSubmissionPassedIds = []
      } else {
        state.stopSubmissionPassedIds.push(id)
      }
    },
    updateStopSubmissionFailedStops(state, errorStop) {
      if (errorStop === null) {
        state.stopSubmissionFailedStops = []
      } else {
        state.stopSubmissionFailedStops.push(errorStop)
      }
    },
    updateStopsWithErrors(state, stopsWithErrors) {
      state.stopsWithErrors = stopsWithErrors
    },
    updateCpraReportStats(state, reportStats) {
      state.cpraReportStats = reportStats
    },
    updateHistoricalCpraReports(state, historicalCpraReports) {
      const reportObjects = []
      for (const historicalCpraReport of historicalCpraReports) {
        const fromDate = historicalCpraReport.split('/')[1]?.substring(0, 24)
        const toDate = historicalCpraReport.split('/')[1]?.substring(25, 49)
        const reportObject = {
          officerName: historicalCpraReport.split('/')[0],
          fromDate: formatDate(fromDate),
          toDate: formatDate(toDate),
          fileName: historicalCpraReport,
        }
        reportObjects.push(reportObject)
      }
      state.historicalCpraReports = reportObjects
    },
    updatePiiServiceAvailable(state, piiServiceAvailable) {
      state.piiServiceAvailable = piiServiceAvailable
    },
  },

  actions: {
    checkTextForPii({ commit, state }, textValue) {
      const document = {
        Document: textValue,
      }

      return axios
        .post(
          `${state.apiConfig.apiBaseUrl}textanalytics/PostCheckPii`,
          document,
          {
            headers: {
              'Content-Type': 'application/json',
              'Ocp-Apim-Subscription-Key': state.apiConfig.apiSubscription,
              'Cache-Control': 'no-cache',
            },
          },
        )
        .then(response => {
          const data = response.data
          commit('updatePiiDate')
          return data
        })
        .catch(error => {
          console.log('There was an error checking for PII.', error)
          return null
        })
    },

    checkGpsLocation({ commit }) {
      return new Promise(resolve => {
        navigator.geolocation.getCurrentPosition(
          position => {
            const latLong = `${position.coords.longitude},${position.coords.latitude}`
            const url = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?location=${latLong}&f=json`

            fetch(url)
              .then(response => response.json())
              .then(data => {
                const dataIncludingLatLong = {
                  ...data,
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                }
                commit('updateGpsLocationAddress', dataIncludingLatLong)
                resolve(data)
              })
              .catch(error => {
                console.log('There was an error checking GPS location.', error)
                commit('updateGpsLocationAddress', null)
                resolve(null)
              })
          },
          error => {
            console.log('There was an error checking GPS location.', error)
            commit('updateGpsLocationAddress', null)
            resolve(null)
          },
          {
            timeout: 10000,
            maximumAge: 10000,
            enableHighAccuracy: false,
          },
        )
      })
    },

    deleteBeat({ dispatch, state }, beat) {
      return axios
        .delete(`${state.apiConfig.apiBaseUrl}domain/DeleteBeat/${beat.id}`, {
          headers: {
            'Ocp-Apim-Subscription-Key': state.apiConfig.apiSubscription,
            'Cache-Control': 'no-cache',
          },
        })
        .then(() => {
          dispatch('getAdminBeats')
        })
        .catch(error => {
          console.log('There was an error deleting the beat.', error)
          dispatch('getAdminBeats')
        })
    },

    editBeat({ dispatch, state }, beat) {
      return axios
        .put(`${state.apiConfig.apiBaseUrl}domain/PutBeat/${beat.id}`, beat, {
          headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': state.apiConfig.apiSubscription,
            'Cache-Control': 'no-cache',
          },
        })
        .then(() => {
          dispatch('getAdminBeats')
        })
        .catch(error => {
          console.log('There was an error saving the beat.', error)
          dispatch('getAdminBeats')
        })
    },

    editUser({ dispatch, state }, user) {
      const updatedUser = {
        ...user,
        favoriteLocations: state.user.favoriteLocations,
        favoriteReasons: state.user.favoriteReasons,
        favoriteResults: state.user.favoriteResults,
      }
      return axios
        .put(
          `${state.apiConfig.apiBaseUrl}userprofile/PutUser/${updatedUser.id}`,
          user,
          {
            headers: {
              'Content-Type': 'application/json',
              'Ocp-Apim-Subscription-Key': state.apiConfig.apiSubscription,
              'Cache-Control': 'no-cache',
            },
          },
        )
        .then(() => {
          dispatch('getAdminUsers')
          dispatch('getUser')
        })
        .catch(error => {
          console.log('There was an error saving the user.', error)
          dispatch('getAdminUsers')
        })
    },

    uploadUsers({ dispatch, state }, { usersFile, usersAgency }) {
      const formData = new FormData()
      formData.append('file', usersFile)
      return axios
        .post(
          `${state.apiConfig.apiBaseUrl}userprofile/PostUpload?agency=${usersAgency}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Ocp-Apim-Subscription-Key': state.apiConfig.apiSubscription,
              'Cache-Control': 'no-cache',
            },
          },
        )
        .then(response => {
          dispatch('getAdminUsers')
          dispatch('getUser')
          return response.data
        })
        .catch(error => {
          dispatch('getAdminUsers')
          console.log('There was an error uploading users', error)
          return error.response.data
        })
    },

    uploadDomain({ dispatch, state }, domainFile) {
      const formData = new FormData()
      formData.append('file', domainFile)
      return axios
        .post(`${state.apiConfig.apiBaseUrl}domain/PostUpload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Ocp-Apim-Subscription-Key': state.apiConfig.apiSubscription,
            'Cache-Control': 'no-cache',
          },
        })
        .then(response => {
          dispatch('getAdminSchools')
          dispatch('getAdminCities')
          dispatch('getAdminStatutes')
          return response.data
        })
        .catch(error => {
          dispatch('getAdminSchools')
          dispatch('getAdminCities')
          dispatch('getAdminStatutes')
          console.log('There was an error uploading domain data', error)
          return error.response.data
        })
    },

    createCpraReport({ commit, state }, reportParameters) {
      const formattedFromDate = new Date(
        `${reportParameters.reportDates.fromDate} 00:00:00Z`,
      ).toISOString()
      const formattedToDate = new Date(
        `${reportParameters.reportDates.toDate} 23:59:59Z`,
      ).toISOString()
      const queryString = `StartDate=${formattedFromDate}&EndDate=${formattedToDate}`

      return axios
        .post(
          `${state.apiConfig.apiBaseUrl}submission/GenerateCpraReport?${queryString}`,
          reportParameters.officerName,
          {
            headers: {
              'Ocp-Apim-Subscription-Key': state.apiConfig.apiSubscription,
              'Cache-Control': 'no-cache',
            },
          },
        )
        .then(response => {
          commit('updateCpraReportStats', response.data)
          return `Report created for dates ${formatDate(
            formattedFromDate,
          )} to ${formatDate(formattedToDate)}`
        })
        .catch(error => {
          console.log('There was an error generating the CPRA report', error)
          if (error.response.data.includes('exists')) {
            return 'A report with those dates already exists, please use the historical report tab to download it'
          } else {
            return 'There was a problem generating the CPRA report, please try again'
          }
        })
    },

    downloadCpraReport({ state }, fileName) {
      return axios
        .get(
          `${state.apiConfig.apiBaseUrl}submission/DownloadCpraReport?FileName=${fileName}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Ocp-Apim-Subscription-Key': state.apiConfig.apiSubscription,
              'Cache-Control': 'no-cache',
            },
          },
        )
        .then(response => {
          const blobFileName = response.config.url.split('?')[1].split('/')[1]
          const fromDate = formatDate(blobFileName?.substring(0, 24))
          const toDate = formatDate(blobFileName?.substring(25, 49))
          const fileName = `RIPAStops_${fromDate}_TO_${toDate}.csv`
          const fileURL = window.URL.createObjectURL(new Blob([response.data]))
          const fileLink = document.createElement('a')
          fileLink.href = fileURL
          fileLink.setAttribute('download', fileName)
          document.body.appendChild(fileLink)
          fileLink.click()
          return `Report ${fileName} downloaded`
        })
        .catch(error => {
          console.log('There was an error downloading the CPRA report', error)
          return error.response.data
        })
    },

    getHistoricalCpraReports({ state, commit }) {
      return axios
        .get(
          `${state.apiConfig.apiBaseUrl}submission/GetHistoricalCpraReports`,
          {
            headers: {
              'Ocp-Apim-Subscription-Key': state.apiConfig.apiSubscription,
              'Cache-Control': 'no-cache',
            },
          },
        )
        .then(response => {
          commit('updateHistoricalCpraReports', response.data)
        })
        .catch(error => {
          console.log(
            'There was an error getting the historical CPRA Reports',
            error,
          )
        })
    },

    editOfficerUser({ dispatch, state }, mappedUser) {
      const userId = state.user.oid
      const user = {
        agency: mappedUser.agency,
        assignment: mappedUser.assignment,
        favoriteLocations: state.user.favoriteLocations,
        favoriteReasons: state.user.favoriteReasons,
        favoriteResults: state.user.favoriteResults,
        firstName: state.user.firstName,
        id: state.user.oid,
        lastName: state.user.lastName,
        name: state.user.fullName,
        officerId: state.user.officerId,
        otherType: mappedUser.otherType,
        startDate: mappedUser.startDate,
        yearsExperience: mappedUser.yearsExperience,
      }

      return axios
        .put(
          `${state.apiConfig.apiBaseUrl}userprofile/PutUser/${userId}`,
          user,
          {
            headers: {
              'Content-Type': 'application/json',
              'Ocp-Apim-Subscription-Key': state.apiConfig.apiSubscription,
              'Cache-Control': 'no-cache',
            },
          },
        )
        .then(() => {
          dispatch('getUser')
        })
        .catch(error => {
          console.log('There was an error saving the user.', error)
          dispatch('getUser')
        })
    },

    submitOfficerStop({ commit, state }, stop) {
      commit('updateStopSubmissionStatusTotal', 1)
      return axios
        .put(`${state.apiConfig.apiBaseUrl}stop/PutStop/${stop.id}`, stop, {
          headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': state.apiConfig.apiSubscription,
            'Cache-Control': 'no-cache',
          },
        })
        .then(response => {
          if (response.status === 200) {
            const apiStop = response.data
            const apiStopId = apiStop.id
            commit('updateStopSubmissionPassedIds', apiStopId)
          }
          if (response.status !== 200) {
            const errorStop = {
              internalId: nanoid(),
              apiStop: stop,
              statusCode: response.status,
              statusError: response.data,
            }
            commit('updateStopSubmissionStatusError', 1)
            commit('updateStopSubmissionFailedStops', errorStop)
            console.log(
              'There was an error saving the officer stop record.',
              response.statusText,
            )
          }
        })
        .catch(error => {
          const errorStop = {
            internalId: nanoid(),
            apiStop: stop,
          }
          if (error.response) {
            errorStop.statusCode = error.response.status
            errorStop.statusError =
              error.response.data || error.response.statusText
          } else if (error.request) {
            errorStop.statusCode = error.request.status
            errorStop.statusError =
              error.request.data || error.request.statusText
          } else {
            errorStop.statusCode = 'N/A'
            errorStop.statusError = error.message || error
          }

          commit('updateStopSubmissionStatusError', 1)
          commit('updateStopSubmissionFailedStops', errorStop)
          console.log(
            'There was an error saving the officer stop record.',
            error,
          )
        })
    },

    getAdminBeats({ commit, state }) {
      return axios
        .get(`${state.apiConfig.apiBaseUrl}domain/GetBeats`, {
          headers: {
            'Ocp-Apim-Subscription-Key': state.apiConfig.apiSubscription,
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
        .catch(error => {
          console.log('There was an error retrieving beats.', error)
          commit('updateAdminBeats', [])
        })
    },

    getFormBeats({ commit, state }) {
      const items = localStorage.getItem('ripa_beats')
      if (items !== null) {
        return new Promise(resolve => {
          commit('updateFormBeats', JSON.parse(items))
          resolve()
        })
      } else {
        return axios
          .get(`${state.apiConfig.apiBaseUrl}domain/GetBeats`, {
            headers: {
              'Ocp-Apim-Subscription-Key': state.apiConfig.apiSubscription,
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
                  id: item.id ? item.id.toString() : null,
                  fullName: `${item.id} ${item.community} (${item.command})`,
                }
              })
            commit('updateFormBeats', data)
            localStorage.setItem('ripa_beats', JSON.stringify(data))
          })
          .catch(error => {
            console.log('There was an error retrieving beats.', error)
            commit('updateFormBeats', [])
          })
      }
    },

    getAdminCities({ commit, state }) {
      return axios
        .get(`${state.apiConfig.apiBaseUrl}domain/GetCities`, {
          headers: {
            'Ocp-Apim-Subscription-Key': state.apiConfig.apiSubscription,
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
        .catch(error => {
          console.log('There was an error retrieving cities.', error)
          commit('updateAdminCities', [])
        })
    },

    getFormCities({ commit, state }) {
      const items1 = localStorage.getItem('ripa_county_cities')
      const items2 = localStorage.getItem('ripa_non_county_cities')
      if (items1 !== null && items2 !== null) {
        return new Promise(resolve => {
          commit('updateFormCountyCities', JSON.parse(items1))
          commit('updateFormNonCountyCities', JSON.parse(items2))
          resolve()
        })
      } else {
        return axios
          .get(`${state.apiConfig.apiBaseUrl}domain/GetCities`, {
            headers: {
              'Ocp-Apim-Subscription-Key': state.apiConfig.apiSubscription,
              'Cache-Control': 'no-cache',
            },
          })
          .then(response => {
            const data = response.data.sort((x, y) => {
              const cityA = x.name.toUpperCase()
              const cityB = y.name.toUpperCase()
              return cityA < cityB ? -1 : cityA > cityB ? 1 : 0
            })
            const data1 = data
              .filter(item => {
                const itemCounty = item.county ? item.county.toUpperCase() : ''
                const configCounty = state.apiConfig.defaultCounty
                  ? state.apiConfig.defaultCounty.toUpperCase()
                  : ''
                return itemCounty.toUpperCase() === configCounty.toUpperCase()
              })
              .map(item => {
                return {
                  id: item.name.toUpperCase(),
                  fullName: item.name.toUpperCase(),
                }
              })
            const data2 = data
              .filter(item => {
                const itemCounty = item.county ? item.county.toUpperCase() : ''
                const configCounty = state.apiConfig.defaultCounty
                  ? state.apiConfig.defaultCounty.toUpperCase()
                  : ''
                return itemCounty.toUpperCase() !== configCounty.toUpperCase()
              })
              .map(item => {
                return {
                  id: item.name.toUpperCase(),
                  fullName: item.name.toUpperCase(),
                }
              })
            commit('updateFormCountyCities', data1)
            commit('updateFormNonCountyCities', data2)
            localStorage.setItem('ripa_county_cities', JSON.stringify(data1))
            localStorage.setItem(
              'ripa_non_county_cities',
              JSON.stringify(data2),
            )
          })
          .catch(error => {
            console.log('There was an error retrieving cities.', error)
            commit('updateFormCountyCities', [])
            commit('updateFormNonCountyCities', [])
          })
      }
    },

    getAdminSchools({ commit, state }) {
      return axios
        .get(`${state.apiConfig.apiBaseUrl}domain/GetSchools`, {
          headers: {
            'Ocp-Apim-Subscription-Key': state.apiConfig.apiSubscription,
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
        .catch(error => {
          console.log('There was an error retrieving schools.', error)
          commit('updateAdminSchools', [])
        })
    },

    getFormSchools({ commit, state }) {
      const items = localStorage.getItem('ripa_schools')
      if (items !== null) {
        return new Promise(resolve => {
          commit('updateFormSchools', JSON.parse(items))
          resolve()
        })
      } else {
        return axios
          .get(`${state.apiConfig.apiBaseUrl}domain/GetSchools`, {
            headers: {
              'Ocp-Apim-Subscription-Key': state.apiConfig.apiSubscription,
              'Cache-Control': 'no-cache',
            },
          })
          .then(response => {
            const data = response.data
              .filter(item => item.status === 'Active')
              .filter(item => {
                const itemCounty = item.county ? item.county.toUpperCase() : ''
                const configCounty = state.apiConfig.defaultCounty
                  ? state.apiConfig.defaultCounty.toUpperCase()
                  : ''
                return itemCounty.toUpperCase() === configCounty.toUpperCase()
              })
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
          .catch(error => {
            console.log('There was an error retrieving schools.', error)
            commit('updateFormSchools', [])
          })
      }
    },

    getAdminStatutes({ commit, state }) {
      return axios
        .get(`${state.apiConfig.apiBaseUrl}domain/GetStatutes`, {
          headers: {
            'Ocp-Apim-Subscription-Key': state.apiConfig.apiSubscription,
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
        .catch(error => {
          console.log('There was an error retrieving statutes.', error)
          commit('updateAdminStatutes', [])
        })
    },

    getFormStatutes({ commit, state }) {
      const items = localStorage.getItem('ripa_statutes')
      if (items !== null) {
        return new Promise(resolve => {
          commit('updateFormStatutes', JSON.parse(items))
          resolve()
        })
      } else {
        return axios
          .get(`${state.apiConfig.apiBaseUrl}domain/GetStatutes`, {
            headers: {
              'Ocp-Apim-Subscription-Key': state.apiConfig.apiSubscription,
              'Cache-Control': 'no-cache',
            },
          })
          .then(response => {
            const data = response.data
              .filter(item => item.offenseRepealed === null)
              .map(item => {
                return {
                  code: item.offenseCode,
                  description: `${item.offenseStatute} ${item.offenseTypeOfStatuteCD} - ${item.statuteLiteral} (${item.offenseTypeOfCharge})`,
                }
              })
              .map(item => {
                return {
                  code: item.code,
                  fullName: `${item.description} ${item.code}`,
                }
              })
            commit('updateFormStatutes', data)
            localStorage.setItem('ripa_statutes', JSON.stringify(data))
          })
          .catch(error => {
            console.log('There was an error retrieving statutes.', error)
            commit('updateFormStatutes', [])
          })
      }
    },

    getFormTemplates({ commit, state }) {
      const items = localStorage.getItem('ripa_templates')
      if (items !== null) {
        return new Promise(resolve => {
          commit('updateFormTemplates', JSON.parse(items))
          resolve()
        })
      } else {
        return axios
          .get(`${state.apiConfig.apiBaseUrl}domain/GetTemplates`, {
            headers: {
              'Ocp-Apim-Subscription-Key': state.apiConfig.apiSubscription,
              'Cache-Control': 'no-cache',
            },
          })
          .then(response => {
            const data = response.data.map(item => {
              const displayName = item.displayName
              const options = item.stop
              return {
                displayName,
                ...options,
              }
            })

            commit('updateFormTemplates', data)
            localStorage.setItem('ripa_templates', JSON.stringify(data))
          })
          .catch(error => {
            console.log('There was an error retrieving templates.', error)
            commit('updateFormTemplates', [])
          })
      }
    },

    getAdminUsers({ commit, state }) {
      return axios
        .get(`${state.apiConfig.apiBaseUrl}userprofile/GetUsers`, {
          headers: {
            'Ocp-Apim-Subscription-Key': `${state.apiConfig.apiSubscription}`,
            'Cache-Control': 'no-cache',
          },
        })
        .then(response => {
          const data = response.data.map(item => {
            return {
              ...item,
              code: item.offenseCode,
              startDate: formatDate(item.startDate),
              yearsExperience:
                item.yearsExperience || differenceInYears(item.startDate),
            }
          })
          commit('updateAdminUsers', data)
        })
        .catch(error => {
          console.log('There was an error retrieving users.', error)
          commit('updateAdminUsers', [])
        })
    },

    getOfficerStops({ commit, state }) {
      const officerId = state.user.officerId
      return axios
        .get(
          `${state.apiConfig.apiBaseUrl}stop/GetStops?officerId=${officerId}&limit=10`,
          {
            headers: {
              'Ocp-Apim-Subscription-Key': state.apiConfig.apiSubscription,
              'Cache-Control': 'no-cache',
            },
          },
        )
        .then(response => {
          const stops = response.data?.stops || []
          const data = stops.sort((x, y) => {
            const stopA = x.stopDateTime
            const stopB = y.stopDateTime
            return stopA < stopB ? 1 : stopA > stopB ? -1 : 0
          })
          commit('updateOfficerStops', data)
        })
        .catch(error => {
          console.log('There was an error retrieving officer stops.', error)
          commit('updateOfficerStops', [])
        })
    },

    getAdminStops({ commit, state }, queryData) {
      let queryString = ''
      // if you send no parameter that would mean to just get everything
      // this is typically when you first load the grid.
      if (queryData) {
        // if offset is null, that means you are changing a filter so restart the paging
        queryString = `${queryString}?Offset=${
          queryData.offset === null ? 0 : queryData.offset
        }`
        // if you send an items per page, set it, otherwise just default to 10
        queryString = `${queryString}&Limit=${
          queryData.limit === null ? 10 : queryData.limit
        }`

        if (queryData.filters) {
          if (queryData.filters.stopFromDate !== null) {
            const formattedFromDate = new Date(
              `${queryData.filters.stopFromDate} 00:00:00Z`,
            ).toISOString()
            queryString = `${queryString}&StartDate=${formattedFromDate}`
          }

          if (queryData.filters.stopToDate !== null) {
            const formattedToDate = new Date(
              `${queryData.filters.stopToDate} 23:59:59Z`,
            ).toISOString()
            queryString = `${queryString}&EndDate=${formattedToDate}`
          }

          if (queryData.filters.status !== null) {
            queryString = `${queryString}&Status=${queryData.filters.status}`
          }

          if (queryData.filters.isPiiFound !== null) {
            queryString = `${queryString}&IsPII=${queryData.filters.isPiiFound}`
          }

          if (queryData.filters.isEdited !== null) {
            queryString = `${queryString}&IsEdited=${queryData.filters.isEdited}`
          }

          if (queryData.filters.errorCodes.length) {
            queryString = `${queryString}&ErrorCode=${queryData.filters.errorCodes.split(
              ',',
            )}`
          }

          if (queryData.filters.orderBy) {
            queryString = `${queryString}&OrderBy=${queryData.filters.orderBy}`
            queryString = `${queryString}&Order=${queryData.filters.order}`
          }
        }
      } else {
        // if no parameters, just set offset to 0 and limit to 10 (default page size)
        queryString = `${queryString}?Offset=0&Limit=10&OrderBy=StopDateTime&Order=Desc`
      }

      return axios
        .get(`${state.apiConfig.apiBaseUrl}stop/GetStops${queryString}`, {
          headers: {
            'Ocp-Apim-Subscription-Key': state.apiConfig.apiSubscription,
            'Cache-Control': 'no-cache',
          },
        })
        .then(response => {
          commit('updateAdminStops', {
            summary: response.data.summary,
            stops: response.data.stops,
          })
        })
        .catch(error => {
          console.log('There was an error retrieving admin stops.', error)
          commit('updateAdminStops', {
            summary: {},
            stops: [],
          })
        })
    },

    getAdminStopAudits({ state }, stopId) {
      return axios
        .get(`${state.apiConfig.apiBaseUrl}stop/GetStopAudits?id=${stopId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': state.apiConfig.apiSubscription,
            'Cache-Control': 'no-cache',
          },
        })
        .then(response => {
          return response.data
        })
        .catch(error => {
          console.log('There was an error retrieving stop audits', error)
        })
    },

    getAdminSubmissions({ commit, state }, queryData) {
      let queryString = ''
      // if you send no parameter that would mean to just get everything
      // this is typically when you first load the grid.
      if (queryData) {
        // if offset is null, that means you are changing a filter so restart the paging
        queryString = `${queryString}?Offset=${
          queryData.offset === null ? 0 : queryData.offset
        }`
        // if you send an items per page, set it, otherwise just default to 10
        queryString = `${queryString}&Limit=${
          queryData.limit === null ? 10 : queryData.limit
        }`
        if (queryData.filters) {
          if (queryData.filters.submissionFromDate !== null) {
            const formattedFromDate = new Date(
              `${queryData.filters.submissionFromDate} 00:00:00Z`,
            ).toISOString()
            queryString = `${queryString}&StartDate=${formattedFromDate}`
          }

          if (queryData.filters.submissionToDate !== null) {
            const formattedToDate = new Date(
              `${queryData.filters.submissionToDate} 23:59:59Z`,
            ).toISOString()
            queryString = `${queryString}&EndDate=${formattedToDate}`
          }

          if (queryData.filters.orderBy) {
            queryString = `${queryString}&OrderBy=${queryData.filters.orderBy}`
            queryString = `${queryString}&Order=${queryData.filters.order}`
          }
        }
      } else {
        // if no parameters, just set offset to 0 and limit to 10 (default page size)
        queryString = `${queryString}?Offset=0&Limit=10`
      }

      return axios
        .get(
          `${state.apiConfig.apiBaseUrl}submission/GetSubmissions${queryString}`,
          {
            headers: {
              'Ocp-Apim-Subscription-Key': state.apiConfig.apiSubscription,
              'Cache-Control': 'no-cache',
            },
          },
        )
        .then(response => {
          commit('updateAdminSubmissions', response.data)
        })
        .catch(error => {
          console.log('There was an error retrieving admin submissions.', error)
          commit('updateAdminSubmissions', [])
        })
    },

    getAdminSubmission({ commit, state }, pageData) {
      let queryString = ''
      // if you send no parameter that would mean to just get everything
      // this is typically when you first load the grid.
      if (pageData.offset) {
        // if offset is null, that means you are changing a filter so restart the paging
        queryString = `${queryString}?Offset=${
          pageData.offset === null ? 0 : pageData.offset
        }`
      } else {
        queryString = `${queryString}?Offset=0`
      }
      if (pageData.limit) {
        // if offset is null, that means you are changing a filter so restart the paging
        queryString = `${queryString}&Limit=${
          pageData.limit === null ? 0 : pageData.limit
        }`
      } else {
        queryString = `${queryString}&Limit=10`
      }

      if (pageData.filters) {
        if (pageData.filters.orderBy) {
          queryString = `${queryString}&OrderBy=${pageData.filters.orderBy}`
          queryString = `${queryString}&Order=${pageData.filters.order}`
        }
        if (pageData.filters.errorCode) {
          queryString = `${queryString}&ErrorCode=${pageData.filters.errorCode}`
        }
      }

      return axios
        .get(
          `${state.apiConfig.apiBaseUrl}submission/GetSubmission/${pageData.id}${queryString}`,
          {
            headers: {
              'Ocp-Apim-Subscription-Key': state.apiConfig.apiSubscription,
              'Cache-Control': 'no-cache',
            },
          },
        )
        .then(response => {
          commit('updateAdminSubmission', response.data)
        })
        .catch(error => {
          console.log(
            'There was an error retrieving the admin submission.',
            error,
          )
          commit('updateAdminSubmission', [])
        })
    },

    getUser({ commit, state }) {
      const id = state.user.oid
      return axios
        .get(`${state.apiConfig.apiBaseUrl}userprofile/GetUser/${id}`, {
          headers: {
            'Ocp-Apim-Subscription-Key': state.apiConfig.apiSubscription,
            'Cache-Control': 'no-cache',
          },
        })
        .then(response => {
          commit('updateUserProfile', response.data)
          commit('updateInvalidUser', false)
        })
        .catch(error => {
          console.log('There was an error retrieving user.', error)
          commit('updateInvalidUser', true)
        })
    },

    getErrorCodes({ commit, state }, value) {
      return axios
        .get(
          `${state.apiConfig.apiBaseUrl}stop/GetErrorCodes?search=${value}`,
          {
            headers: {
              'Ocp-Apim-Subscription-Key': state.apiConfig.apiSubscription,
              'Cache-Control': 'no-cache',
            },
          },
        )
        .then(response => {
          // need to map out what the response would be
          commit('updateErrorCodeAdminSearch', response.data)
        })
        .catch(error => {
          console.log(error)
          commit('updateErrorCodeAdminSearch', {
            items: [],
          })
        })
    },

    submitStops({ state }, stops) {
      return axios
        .post(
          `${state.apiConfig.apiBaseUrl}submission/PostSubmit`,
          { stopIds: stops },
          {
            headers: {
              'Content-Type': 'application/json',
              'Ocp-Apim-Subscription-Key': state.apiConfig.apiSubscription,
              'Cache-Control': 'no-cache',
            },
          },
        )
        .then(response => {
          // foward user to submission details screen for newly created submission
          return response.data
        })
        .catch(err => {
          if (err.response.status === 400) {
            return err.response.data
          } else {
            return 'There was an unknown error with your submission. Your stops were not submitted'
          }
        })
    },

    submitAllStops({ state }, queryData) {
      let queryString = ''
      // if you send no parameter that would mean to just get everything
      // this is typically when you first load the grid.
      if (queryData) {
        if (queryData) {
          if (queryData.stopFromDate !== null) {
            const formattedFromDate = new Date(
              `${queryData.stopFromDate} 00:00:00Z`,
            ).toISOString()
            queryString = `${queryString}&StartDate=${formattedFromDate}`
          }

          if (queryData.stopToDate !== null) {
            const formattedToDate = new Date(
              `${queryData.stopToDate} 23:59:59Z`,
            ).toISOString()
            queryString = `${queryString}&EndDate=${formattedToDate}`
          }

          if (queryData.status !== null) {
            queryString = `${queryString}&Status=${queryData.status}`
          }

          if (queryData.isPiiFound !== null) {
            queryString = `${queryString}&IsPII=${queryData.isPiiFound}`
          }

          if (queryData.isEdited !== null) {
            queryString = `${queryString}&IsEdited=${queryData.isEdited}`
          }

          if (queryData.errorCodes.length) {
            queryString = `${queryString}&ErrorCode=${queryData.errorCodes.split(
              ',',
            )}`
          }
        }
      } else {
        // if no parameters, just set offset to 0 and limit to 10 (default page size)
        queryString = `${queryString}?Offset=0&Limit=10&OrderBy=StopDateTime&Order=Desc`
      }

      return axios
        .post(
          `${state.apiConfig.apiBaseUrl}submission/PostSubmitSearch?${queryString}`,
          null,
          {
            headers: {
              'Content-Type': 'application/json',
              'Ocp-Apim-Subscription-Key': state.apiConfig.apiSubscription,
              'Cache-Control': 'no-cache',
            },
          },
        )
        .then(response => {
          // foward user to submission details screen for newly created submission
          return response.data
        })
        .catch(err => {
          if (err.response.status === 400) {
            return err.response.data
          } else {
            return 'There was an unknown error with your submission. Your stops were not submitted'
          }
        })
    },

    setPiiServiceAvailable({ commit }, value) {
      commit('updatePiiServiceAvailable', value)
    },

    setAuthConfig({ commit }, value) {
      commit('updateAuthConfig', value)
    },

    setUserAccountInfo({ commit }, value) {
      commit('updateUserAccount', value)
    },

    setUserFavoriteLocations({ commit }, locations) {
      commit('updateUserFavoriteLocations', locations)
    },

    setUserFavoriteReasons({ commit }, reasons) {
      commit('updateUserFavoriteReasons', reasons)
    },

    setUserFavoriteResults({ commit }, results) {
      commit('updateUserFavoriteResults', results)
    },

    setApiConfig({ commit }, value) {
      commit('updateApiConfig', value)
      commit('updateAgencyQuestions', value)
    },

    resetStopSubmissionStatus({ commit }) {
      commit('updateStopSubmissionStatusTotal', null)
      commit('updateStopSubmissionStatusError', null)
      commit('updateStopSubmissionPassedIds', null)
      commit('updateStopSubmissionFailedStops', null)
    },
  },

  modules: {},
})
