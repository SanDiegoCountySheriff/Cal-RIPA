<script>
export default {
  data() {
    return { isLocked: false }
  },

  methods: {
    addApiStop(apiStop) {
      this.isLocked = true
      const apiStops = this.getApiStopsFromLocalStorage()
      apiStops.push(apiStop)
      this.setApiStopsToLocalStorage(apiStops)
      this.isLocked = false
    },

    checkLocalStorage() {
      if (!this.isLocked && this.isOnlineAndAuthenticated) {
        this.isLocked = true
        const apiStops = this.getApiStopsFromLocalStorage()
        if (apiStops.length > 0) {
          this.runApiStopsJob(apiStops)
        }
        this.isLocked = false
      }
    },

    async runApiStopsJob(apiStops) {
      this.resetStopSubmissionStatus()
      if (this.isOnlineAndAuthenticated) {
        for (let index = 0; index < apiStops.length; index++) {
          const apiStop = apiStops[index]
          await this.editOfficerStop(apiStop)
        }

        const stopIdsPassedStr = `Stop ID(s) submitted successfully: ${this.mappedStopSubmissionPassedIds.join(
          ', ',
        )}`

        if (this.mappedStopSubmittionFailedStops.length === 0) {
          this.snackbarText = `${this.mappedStopSubmissionStatus}. ${stopIdsPassedStr}.`
          this.snackbarVisible = true
        } else {
          alert('display stop error dialog')
        }

        this.updateApiStopsLocalStorage()
      }
    },

    updateApiStopsLocalStorage() {
      // if there are failed ids, filter all failed apiStop ids
      // and move to errors key in local storage
      if (this.mappedStopSubmissionFailedStops.length > 0) {
        const apiStops = this.getApiStopsFromLocalStorage()
        const filteredApiStops = apiStops.filter(item =>
          this.mappedStopSubmissionFailedStops.includes(item),
        )
        this.setApiStopsWithErrorsToLocalStorage(filteredApiStops)
      }

      // clear api stops key since all api stops were handled -
      // either submitted successfully or moved to new key in local storage
      this.removeApiStopsFromLocalStorage()
    },

    removeApiStopsFromLocalStorage() {
      localStorage.removeItem('ripa_submitted_api_stops')
    },

    getApiStopsFromLocalStorage() {
      const apiStops = localStorage.getItem('ripa_submitted_api_stops')
      return apiStops ? JSON.parse(apiStops) : []
    },

    setApiStopsToLocalStorage(apiStops) {
      localStorage.setItem('ripa_submitted_api_stops', JSON.stringify(apiStops))
    },

    setApiStopsWithErrorsToLocalStorage(apiStops) {
      localStorage.setItem(
        'ripa_submitted_api_stops_with_errors',
        JSON.stringify(apiStops),
      )
    },
  },

  props: {
    onRun: {
      type: Function,
      default: () => {},
    },
  },
}
</script>
