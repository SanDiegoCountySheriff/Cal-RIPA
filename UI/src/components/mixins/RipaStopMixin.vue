<script>
import { defaultStop, motorStop, probationStop } from '@/utilities/stop'
import { format } from 'date-fns'
import { getStatuteContent } from '@/utilities/statutes'

export default {
  data() {
    return {
      favorites: [],
      lastLocation: null,
      savedLocation: null,
      showAddFavoriteDialog: false,
      showFavoritesDialog: false,
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
      this.stop.actionsTaken = {}
      this.stop.person = {
        id: new Date().getTime(),
        index: this.fullStop.people.length + 1,
      }
      this.updateFullStop()
    },

    handleCloseDialog() {
      this.showAddFavoriteDialog = false
      this.showFavoritesDialog = false
      this.showStatuteDialog = false
    },

    handleDeleteFavorite(id) {
      const locations = this.getFavoriteLocations()
      const filteredLocations = locations.filter(item => item.id !== id)
      this.setFavoriteLocations(filteredLocations)
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

    handleOpenStatute(statute) {
      this.statute = {
        statute,
        content: getStatuteContent(statute),
      }
      this.showStatuteDialog = true
    },

    handleSaveFavorite(location) {
      this.savedLocation = location
      this.showAddFavoriteDialog = true
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
        updatedFullStop.agencyQuestions = this.stop.agencyQuestions
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
