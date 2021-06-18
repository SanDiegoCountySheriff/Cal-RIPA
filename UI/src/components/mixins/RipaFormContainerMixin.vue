<script>
import { defaultStop, motorStop, probationStop } from '@/utilities/stop'
import { format } from 'date-fns'
import { getStatuteContent } from '@/utilities/statutes'

export default {
  data() {
    return {
      favorites: [],
      formStepIndex: 0,
      fullStop: {},
      lastLocation: null,
      lastReason: null,
      lastResult: null,
      loadingGps: false,
      loadingPiiStep1: false,
      loadingPiiStep3: false,
      loadingPiiStep4: false,
      savedLocation: null,
      savedReason: null,
      savedResult: null,
      showAddLocationFavoriteDialog: false,
      showAddReasonFavoriteDialog: false,
      showAddResultFavoriteDialog: false,
      showLocationFavoritesDialog: false,
      showReasonFavoritesDialog: false,
      showResultFavoritesDialog: false,
      showStatuteDialog: false,
      showUserDialog: false,
      statute: null,
      stop: {},
    }
  },

  computed: {
    isAdminEditing() {
      const value = localStorage.getItem('ripa_form_admin_editing')
      return value ? value === '1' : false
    },

    isLastLocationValid() {
      return this.getLastLocation !== null
    },
  },

  methods: {
    getFavoriteLocations() {
      const locations = localStorage.getItem('ripa_favorite_locations')
      return locations ? JSON.parse(locations) : []
    },

    getFavoriteReasons() {
      const locations = localStorage.getItem('ripa_favorite_reasons')
      return locations ? JSON.parse(locations) : []
    },

    getFavoriteResults() {
      const locations = localStorage.getItem('ripa_favorite_results')
      return locations ? JSON.parse(locations) : []
    },

    getLastLocation() {
      const lastLocation = localStorage.getItem('ripa_last_location')
      if (lastLocation) {
        return JSON.parse(lastLocation)
      }

      return null
    },

    handleAddLocationFavorite(name) {
      const location = {
        id: new Date().getTime(),
        name,
        location: this.savedLocation,
        updateDate: format(new Date(), 'yyyy-MM-dd'),
      }
      const locations = this.getFavoriteLocations()
      locations.push(location)
      this.setFavoriteLocations(locations)
    },

    handleAddReasonFavorite(name) {
      const reason = {
        id: new Date().getTime(),
        name,
        reason: this.savedReason,
        updateDate: format(new Date(), 'yyyy-MM-dd'),
      }
      const reasons = this.getFavoriteReasons()
      reasons.push(reason)
      this.setFavoriteReasons(reasons)
    },

    handleAddResultFavorite(name) {
      const result = {
        id: new Date().getTime(),
        name,
        result: this.savedResult,
        updateDate: format(new Date(), 'yyyy-MM-dd'),
      }
      const results = this.getFavoriteResults()
      results.push(result)
      this.setFavoriteResults(results)
    },

    handleAddPerson() {
      localStorage.setItem('ripa_form_saved_stop', JSON.stringify(this.stop))
      localStorage.setItem(
        'ripa_form_saved_full_stop',
        JSON.stringify(this.fullStop),
      )
      localStorage.setItem('ripa_form_edit_person', '1')
      const updatedStop = this.stop
      this.stop = Object.assign({}, updatedStop)
      this.stop.actionsTaken = {}
      this.stop.person = {
        id: new Date().getTime(),
        index: this.fullStop.people.length + 1,
      }
      this.updateFullStop()
    },

    handleCloseDialog() {
      this.showAddLocationFavoriteDialog = false
      this.showAddReasonFavoriteDialog = false
      this.showAddResultFavoriteDialog = false
      this.showLocationFavoritesDialog = false
      this.showReasonFavoritesDialog = false
      this.showResultFavoritesDialog = false
      this.showStatuteDialog = false
      this.showUserDialog = false
    },

    handleDeleteLocationFavorite(id) {
      const locations = this.getFavoriteLocations()
      const filteredLocations = locations.filter(item => item.id !== id)
      this.setFavoriteLocations(filteredLocations)
    },

    handleDeleteReasonFavorite(id) {
      const reasons = this.getFavoriteReasons()
      const filteredResons = reasons.filter(item => item.id !== id)
      this.setFavoriteReasons(filteredResons)
    },

    handleDeleteResultFavorite(id) {
      const results = this.getFavoriteResults()
      const filteredResults = results.filter(item => item.id !== id)
      this.setFavoriteResults(filteredResults)
    },

    handleDeletePerson(id) {
      // update fullStop
      const filteredPeople = this.fullStop.people.filter(
        item => item.id !== id.toString(),
      )
      const updatedFullStop = {
        ...this.fullStop,
        people: filteredPeople.map((person, index) => {
          return {
            ...person,
            index: index + 1,
          }
        }),
      }
      this.fullStop = Object.assign({}, updatedFullStop)
      // update stop
      const filteredPerson = this.fullStop.people[0]
      if (filteredPerson) {
        this.stop = {
          ...this.stop,
          person: filteredPerson,
        }
      }
    },

    handleEditLocationFavorite(favorite) {
      const updatedFav = Object.assign({}, favorite)
      updatedFav.updateDate = format(new Date(), 'yyyy-MM-dd')
      const locations = this.getFavoriteLocations()
      const filteredLocations = locations.filter(
        item => item.id !== updatedFav.id,
      )
      filteredLocations.push(updatedFav)
      this.setFavoriteLocations(filteredLocations)
    },

    handleEditReasonFavorite(favorite) {
      const updatedFav = Object.assign({}, favorite)
      updatedFav.updateDate = format(new Date(), 'yyyy-MM-dd')
      const reasons = this.getFavoriteReasons()
      const filteredReasons = reasons.filter(item => item.id !== updatedFav.id)
      filteredReasons.push(updatedFav)
      this.setFavoriteReasons(filteredReasons)
    },

    handleEditResultFavorite(favorite) {
      const updatedFav = Object.assign({}, favorite)
      updatedFav.updateDate = format(new Date(), 'yyyy-MM-dd')
      const results = this.getFavoriteResults()
      const filteredResults = results.filter(item => item.id !== updatedFav.id)
      filteredResults.push(updatedFav)
      this.setFavoriteResults(filteredResults)
    },

    handleEditAgencyQuestions() {
      localStorage.setItem('ripa_form_saved_stop', JSON.stringify(this.stop))
      localStorage.setItem(
        'ripa_form_saved_full_stop',
        JSON.stringify(this.fullStop),
      )
      localStorage.setItem('ripa_form_edit_agency_questions', '1')
    },

    handleEditPerson(id) {
      localStorage.setItem('ripa_form_saved_stop', JSON.stringify(this.stop))
      localStorage.setItem(
        'ripa_form_saved_full_stop',
        JSON.stringify(this.fullStop),
      )
      localStorage.setItem('ripa_form_edit_person', '1')
      const [filteredPerson] = this.fullStop.people.filter(
        item => item.id === id,
      )
      if (filteredPerson) {
        this.stop = {
          ...this.stop,
          person: filteredPerson,
        }
      }
    },

    handleEditStop() {
      localStorage.setItem('ripa_form_saved_stop', JSON.stringify(this.stop))
      localStorage.setItem(
        'ripa_form_saved_full_stop',
        JSON.stringify(this.fullStop),
      )
      localStorage.setItem('ripa_form_edit_stop', '1')
    },

    handleInput(newVal) {
      this.stop = Object.assign({}, newVal)
      this.updateFullStop()
    },

    async handleGpsLocation() {
      this.loadingGps = true
      await this.checkGpsLocation()
      this.loadingGps = false
    },

    handleOpenLocationFavorite(id) {
      this.showLocationFavoritesDialog = false
      const favorites = this.getFavoriteLocations()
      const [favorite] = favorites.filter(item => item.id === id)
      if (favorite) {
        this.lastLocation = favorite.location
      }
    },

    handleOpenReasonFavorite(id) {
      this.showReasonFavoritesDialog = false
      const favorites = this.getFavoriteReasons()
      const [favorite] = favorites.filter(item => item.id === id)
      if (favorite) {
        this.lastReason = favorite.reason
      }
    },

    handleOpenResultFavorite(id) {
      this.showResultFavoritesDialog = false
      const favorites = this.getFavoriteResults()
      const [favorite] = favorites.filter(item => item.id === id)
      if (favorite) {
        this.lastResult = favorite.result
      }
    },

    handleOpenLocationFavorites() {
      this.favorites = this.getFavoriteLocations()
      this.showLocationFavoritesDialog = true
    },

    handleOpenReasonFavorites() {
      this.favorites = this.getFavoriteReasons()
      this.showReasonFavoritesDialog = true
    },

    handleOpenResultFavorites() {
      this.favorites = this.getFavoriteResults()
      this.showResultFavoritesDialog = true
    },

    handleOpenLastLocation() {
      const location = this.getLastLocation()
      this.lastLocation = location
    },

    handleOpenStatute(statute) {
      this.statute = {
        statute,
        content: getStatuteContent(statute),
      }
      this.showStatuteDialog = true
    },

    handleSaveLocationFavorite(location) {
      this.savedLocation = location
      this.showAddLocationFavoriteDialog = true
    },

    handleSaveReasonFavorite(reason) {
      this.savedReason = reason
      this.showAddReasonFavoriteDialog = true
    },

    handleSaveResultFavorite(result) {
      this.savedResult = result
      this.showAddResultFavoriteDialog = true
    },

    handleStepIndexChange(index) {
      this.formStepIndex = index
      if (index > 0) {
        localStorage.setItem('ripa_form_step_index', index.toString())
      } else {
        localStorage.removeItem('ripa_form_step_index')
      }

      if (index === 7) {
        localStorage.removeItem('ripa_form_edit_agency_questions')
        localStorage.removeItem('ripa_form_edit_person')
        localStorage.removeItem('ripa_form_edit_stop')
      }
    },

    handleOpenTemplate(value) {
      this.handleStepIndexChange(1)
      localStorage.setItem('ripa_form_editing', '1')

      switch (value) {
        case 'motor':
          this.stop = motorStop()
          break

        case 'probation':
          this.stop = probationStop()
          break

        default:
          this.stop = defaultStop()
          break
      }

      this.updateFullStop()
    },

    setFavoriteLocations(locations) {
      localStorage.setItem('ripa_favorite_locations', JSON.stringify(locations))
    },

    setFavoriteReasons(reasons) {
      localStorage.setItem('ripa_favorite_reasons', JSON.stringify(reasons))
    },

    setFavoriteResults(results) {
      localStorage.setItem('ripa_favorite_results', JSON.stringify(results))
    },

    setLastLocation(stop) {
      localStorage.setItem('ripa_last_location', JSON.stringify(stop.location))
    },

    updateFullStop() {
      if (this.stop.person) {
        const updatedPerson = {
          ...this.stop.person,
          id: this.stop?.person.id,
          index: this.stop?.person.index,
          actionsTaken: this.stop?.actionsTaken || null,
          stopReason: this.stop?.stopReason || null,
          stopResult: this.stop?.stopResult || null,
        }

        let updatedFullStop = Object.assign({}, this.fullStop)
        updatedFullStop.agencyQuestions = this.stop.agencyQuestions || []
        updatedFullStop.id = this.stop.id
        updatedFullStop.template = this.stop.template
        updatedFullStop.stepTrace = this.stop.stepTrace
        updatedFullStop.location = this.stop.location
        updatedFullStop.stopDate = this.stop.stopDate
        const personId = this.stop.person.id
        const people = updatedFullStop.people || []
        updatedFullStop.people = people.filter(item => item.id !== personId)
        updatedFullStop.people.push(updatedPerson)
        updatedFullStop = {
          ...updatedFullStop,
          people: updatedFullStop.people
            .sort((a, b) => a.id - b.id)
            .map((person, index) => {
              return {
                ...person,
                index: index + 1,
              }
            }),
        }
        this.fullStop = Object.assign({}, updatedFullStop)
      }
    },

    clearLocalStorage() {
      localStorage.removeItem('ripa_form_admin_editing')
      localStorage.removeItem('ripa_form_cached')
      localStorage.removeItem('ripa_form_edit_agency_questions')
      localStorage.removeItem('ripa_form_edit_person')
      localStorage.removeItem('ripa_form_edit_route')
      localStorage.removeItem('ripa_form_edit_stop')
      localStorage.removeItem('ripa_form_editing')
      localStorage.removeItem('ripa_form_full_stop')
      localStorage.removeItem('ripa_form_saved_stop')
      localStorage.removeItem('ripa_form_saved_full_stop')
      localStorage.removeItem('ripa_form_step_index')
      localStorage.removeItem('ripa_form_stop')
      localStorage.removeItem('ripa_form_submitted_api_stop')
      localStorage.removeItem('ripa_form_submitted_submissions')
    },

    handleCancelForm() {
      const route = localStorage.getItem('ripa_form_edit_route')
      this.clearLocalStorage()
      this.stop = null
      this.fullStop = null
      if (route) {
        this.$router.push(route)
      }
    },

    handleCancelAction() {
      localStorage.removeItem('ripa_form_edit_agency_questions')
      localStorage.removeItem('ripa_form_edit_person')
      localStorage.removeItem('ripa_form_edit_stop')

      const parsedStop = localStorage.getItem('ripa_form_saved_stop')
      const parsedFullStop = localStorage.getItem('ripa_form_saved_full_stop')

      if (parsedStop && parsedFullStop) {
        localStorage.removeItem('ripa_form_saved_stop')
        localStorage.removeItem('ripa_form_saved_full_stop')
        this.handleStepIndexChange(7)
        this.stop = JSON.parse(parsedStop)
        this.fullStop = JSON.parse(parsedFullStop)
      }
    },
  },

  watch: {
    stop(newVal) {
      this.stop = newVal
    },

    fullStop(newVal) {
      this.fullStop = newVal
      if (this.formStepIndex > 0) {
        if (this.stop) {
          localStorage.setItem('ripa_form_stop', JSON.stringify(this.stop))
        }
        localStorage.setItem('ripa_form_full_stop', JSON.stringify(newVal))
      }
    },

    'stop.location.fullAddress': {
      handler(newVal, oldVal) {
        if (oldVal !== newVal) {
          this.validateLocationForPii(newVal)
        }
      },
    },

    'stop.stopReason.reasonForStopExplanation': {
      handler(newVal, oldVal) {
        if (oldVal !== newVal) {
          this.validateReasonForStopForPii(newVal)
        }
      },
    },

    'stop.actionsTaken.basisForSearchExplanation': {
      handler(newVal, oldVal) {
        if (oldVal !== newVal) {
          this.validateBasisForSearchForPii(newVal)
        }
      },
    },
  },
}
</script>
