<script>
import { defaultStop, motorStop, probationStop } from '@/utilities/stop'
import { format } from 'date-fns'
import { getStatuteContent } from '@/utilities/statutes'

export default {
  data() {
    return {
      favorites: [],
      lastLocation: null,
      lastReason: null,
      lastResult: null,
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
    }
  },

  computed: {
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
      const filteredPeople = this.fullStop.people.filter(item => item.id !== id)
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

    handleEditPerson(id) {
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

    handleInput(newVal) {
      this.stop = Object.assign({}, newVal)
      this.updateFullStop()
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

    handleOpenTemplate(value) {
      localStorage.setItem('ripa_form_editing', '1')
      this.formStepIndex = 1

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
        updatedFullStop.agency = this.stop.agency
        updatedFullStop.agencyQuestions = this.stop.agencyQuestions || []
        updatedFullStop.created = this.stop.created
        updatedFullStop.id = this.stop.id
        updatedFullStop.template = this.stop.template
        updatedFullStop.stepTrace = this.stop.stepTrace
        updatedFullStop.location = this.stop.location
        updatedFullStop.officer = this.stop.officer
        updatedFullStop.officerId = this.stop.officerId
        updatedFullStop.officerName = this.stop.officerName
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

    handleCancel() {
      localStorage.removeItem('ripa_form_step_index')
      localStorage.removeItem('ripa_form_editing')
      localStorage.removeItem('ripa_form_stop')
      localStorage.removeItem('ripa_form_cached')
      localStorage.removeItem('ripa_form_full_stop')
      this.formStepIndex = 0
      this.stop = null
      this.fullStop = null
    },
  },
}
</script>
