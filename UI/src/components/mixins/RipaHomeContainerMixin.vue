<script>
import { defaultStop, motorStop, probationStop } from '@/utilities/stop'

export default {
  methods: {
    getOfficerYearsExperience() {
      const yearsExperience = localStorage.getItem(
        'ripa_officer_years_experience',
      )
      return +yearsExperience || null
    },

    getOfficerAssignment() {
      const assignment = localStorage.getItem('ripa_officer_assignment')
      return +assignment || null
    },

    handleInput(newVal) {
      this.stop = Object.assign({}, newVal)
      this.updateFullStop()
    },

    handleAddPerson() {
      const updatedStop = this.stop
      this.stop = Object.assign({}, updatedStop)
      this.stop.person = {
        id: new Date().getTime(),
        isStudent: false,
        perceivedRace: null,
        perceivedGender: null,
        perceivedLgbt: false,
        perceivedAge: null,
        anyDisabilities: false,
        perceivedOrKnownDisability: null,
      }
      this.updateFullStop()
    },

    handleDeletePerson(id) {
      const filteredPeople = this.fullStop.people.filter(item => item.id !== id)
      const updatedFullStop = {
        ...this.fullStop,
        people: filteredPeople,
      }
      this.fullStop = Object.assign({}, updatedFullStop)
    },

    handleTemplate(value) {
      this.isEditingForm = true

      switch (value) {
        case 'motor':
          this.stop = motorStop(
            this.getOfficerYearsExperience(),
            this.getOfficerAssignment(),
          )
          break

        case 'probation':
          this.stop = probationStop(
            this.getOfficerYearsExperience(),
            this.getOfficerAssignment(),
          )
          break

        default:
          this.stop = defaultStop(
            this.getOfficerYearsExperience(),
            this.getOfficerAssignment(),
          )
          break
      }

      this.updateFullStop()
    },

    updateFullStop() {
      const updatedPerson = {
        ...this.stop.person,
        id: this.stop.person.id,
        actionsTaken: this.stop.actionsTaken,
        stopReason: this.stop.stopReason,
        stopResult: this.stop.stopResult,
      }

      const updatedFullStop = Object.assign({}, this.fullStop)
      updatedFullStop.created = this.stop.created
      updatedFullStop.id = this.stop.id
      updatedFullStop.updated = new Date()
      updatedFullStop.officer = this.stop.officer
      updatedFullStop.stopDate = this.stop.stopDate
      updatedFullStop.location = this.stop.location
      const personId = this.stop.person.id
      const people = updatedFullStop.people || []
      updatedFullStop.people = people.filter(item => item.id !== personId)
      updatedFullStop.people.push(updatedPerson)
      this.fullStop = Object.assign({}, updatedFullStop)
    },

    handleCancel() {
      this.isEditingForm = false
      this.stop = defaultStop()
      this.updateFullStop()
    },
  },
}
</script>
