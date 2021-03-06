<script>
import {
  getOfficerYearsExperience,
  getOfficerAssignment,
  getOfficerOtherType,
} from '@/utilities/officer'
import { defaultStop, motorStop, probationStop } from '@/utilities/stop'
import { format } from 'date-fns'

export default {
  data() {
    return {
      favorites: [],
      lastLocation: null,
      savedLocation: null,
      showAddFavoriteDialog: false,
      showFavoritesDialog: false,
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

    getLastLocation() {
      const lastLocation = localStorage.getItem('ripa_last_location')
      if (lastLocation) {
        return JSON.parse(lastLocation)
      }

      return null
    },

    handleAddFavorite(name) {
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

    handleAddPerson() {
      const updatedStop = this.stop
      this.stop = Object.assign({}, updatedStop)
      this.stop.person = {
        id: new Date().getTime(),
        isStudent: false,
        perceivedRace: null,
        perceivedGender: null,
        genderNonconforming: false,
        perceivedLgbt: false,
        perceivedAge: null,
        anyDisabilities: false,
        perceivedOrKnownDisability: null,
      }
      this.updateFullStop()
    },

    handleCloseDialog() {
      this.showAddFavoriteDialog = false
      this.showFavoritesDialog = false
    },

    handleDeleteFavorite(id) {
      const locations = this.getFavoriteLocations()
      const filteredLocations = locations.filter(item => item.id !== id)
      this.setFavoriteLocations(filteredLocations)
    },

    handleDeletePerson(id) {
      const filteredPeople = this.fullStop.people.filter(item => item.id !== id)
      const updatedFullStop = {
        ...this.fullStop,
        people: filteredPeople,
      }
      this.fullStop = Object.assign({}, updatedFullStop)
    },

    handleEditFavorite(favorite) {
      const updatedFav = Object.assign({}, favorite)
      updatedFav.updateDate = format(new Date(), 'yyyy-MM-dd')
      const locations = this.getFavoriteLocations()
      const filteredLocations = locations.filter(
        item => item.id !== updatedFav.id,
      )
      filteredLocations.push(updatedFav)
      this.setFavoriteLocations(filteredLocations)
    },

    handleInput(newVal) {
      this.stop = Object.assign({}, newVal)
      this.updateFullStop()
    },

    handleOpenFavorite(id) {
      this.showFavoritesDialog = false
      const favorites = this.getFavoriteLocations()
      const [favorite] = favorites.filter(item => item.id === id)
      if (favorite) {
        this.lastLocation = favorite.location
      }
    },

    handleOpenFavorites() {
      this.favorites = this.getFavoriteLocations()
      this.showFavoritesDialog = true
    },

    handleOpenLastLocation() {
      const location = this.getLastLocation()
      this.lastLocation = location
    },

    handleSaveFavorite(location) {
      this.savedLocation = location
      this.showAddFavoriteDialog = true
    },

    handleTemplate(value) {
      this.isEditingForm = true

      switch (value) {
        case 'motor':
          this.stop = motorStop(
            getOfficerYearsExperience(),
            getOfficerAssignment(),
            getOfficerOtherType(),
            this.officerId,
            this.agency,
          )
          break

        case 'probation':
          this.stop = probationStop(
            getOfficerYearsExperience(),
            getOfficerAssignment(),
            getOfficerOtherType(),
            this.officerId,
            this.agency,
          )
          break

        default:
          this.stop = defaultStop(
            getOfficerYearsExperience(),
            getOfficerAssignment(),
            getOfficerOtherType(),
            this.officerId,
            this.agency,
          )
          break
      }

      this.updateFullStop()
    },

    setFavoriteLocations(locations) {
      localStorage.setItem('ripa_favorite_locations', JSON.stringify(locations))
    },

    setLastLocation(stop) {
      localStorage.setItem('ripa_last_location', JSON.stringify(stop.location))
    },

    updateFullStop() {
      if (this.stop.person) {
        const updatedPerson = {
          ...this.stop.person,
          id: this.stop?.person.id,
          actionsTaken: this.stop?.actionsTaken || null,
          stopReason: this.stop?.stopReason || null,
          stopResult: this.stop?.stopResult || null,
        }

        const updatedFullStop = Object.assign({}, this.fullStop)
        updatedFullStop.agency = this.stop.agency
        updatedFullStop.created = this.stop.created
        updatedFullStop.id = this.stop.id
        updatedFullStop.location = this.stop.location
        updatedFullStop.officer = this.stop.officer
        updatedFullStop.officerId = this.stop.officerId
        updatedFullStop.stopDate = this.stop.stopDate
        updatedFullStop.updated = new Date()
        const personId = this.stop.person.id
        const people = updatedFullStop.people || []
        updatedFullStop.people = people.filter(item => item.id !== personId)
        updatedFullStop.people.push(updatedPerson)
        this.fullStop = Object.assign({}, updatedFullStop)
      }
    },

    handleCancel() {
      this.isEditingForm = false
      this.stop = {}
      this.fullStop = {}
      this.updateFullStop()
    },
  },
}
</script>
