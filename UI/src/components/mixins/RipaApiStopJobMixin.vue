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
        const apiStopsWithErrors = this.getApiStopsWithErrorsFromLocalStorage()
        this.updateStopsWithErrors(apiStopsWithErrors)
        this.isLocked = false
      }
    },

    timeout(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },

    async runApiStopsJob(apiStops) {
      this.resetStopSubmissionStatus()
      if (this.isOnlineAndAuthenticated) {
        // clear api stops key since all api stops were handled -
        // either submitted successfully or moved to new key in local storage
        this.removeApiStopsFromLocalStorage()

        // iterate through each apiStop
        for (let index = 0; index < apiStops.length; index++) {
          const apiStop = apiStops[index]
          await this.editOfficerStop(apiStop)
          await this.timeout(3000)
        }

        let stopIdsPassedStr = ''
        if (this.mappedStopSubmissionPassedIds.length > 0) {
          stopIdsPassedStr = ` Stop ID(s) submitted successfully: ${this.mappedStopSubmissionPassedIds.join(
            ', ',
          )}.`
        }

        this.snackbarText = `${this.mappedStopSubmissionStatus}.${stopIdsPassedStr}`
        this.snackbarVisible = true

        if (this.mappedStopSubmissionFailedStops.length > 0) {
          // if there are failed ids, update error stops key
          this.validateApiStopsWithErrors(this.mappedStopSubmissionFailedStops)
        }
      }
    },

    removeApiStopsFromLocalStorage() {
      localStorage.removeItem('ripa_submitted_api_stops')
    },

    getApiStopsFromLocalStorage() {
      const apiStops = localStorage.getItem('ripa_submitted_api_stops')
      return apiStops ? JSON.parse(apiStops) : []
    },

    getApiStopsWithErrorsFromLocalStorage() {
      const apiStops = localStorage.getItem(
        'ripa_submitted_api_stops_with_errors',
      )
      const parsedApiStops = apiStops ? JSON.parse(apiStops) : []

      return parsedApiStops
    },

    setApiStopsToLocalStorage(apiStops) {
      localStorage.setItem('ripa_submitted_api_stops', JSON.stringify(apiStops))
    },

    validateApiStopsWithErrors(apiStops) {
      const apiStopsWithErrors = this.getApiStopsWithErrorsFromLocalStorage()
      let updatedApiStops = apiStopsWithErrors

      // validate stopsWithErrors
      for (let index = 0; index < apiStops.length; index++) {
        const apiStop = apiStops[index]
        updatedApiStops = apiStopsWithErrors.filter(
          item => item.internalId !== apiStop.internalId,
        )
        updatedApiStops.push(apiStop)
      }

      this.setApiStopsWithErrorsToLocalStorage(updatedApiStops)
    },

    setApiStopsWithErrorsToLocalStorage(apiStops) {
      if (apiStops.length === 0) {
        localStorage.removeItem('ripa_submitted_api_stops_with_errors')
      } else {
        localStorage.setItem(
          'ripa_submitted_api_stops_with_errors',
          JSON.stringify(apiStops),
        )
      }
    },

    deleteStopWithError(internalId) {
      const apiStopsWithErrors = this.getApiStopsWithErrorsFromLocalStorage()
      const updatedApiStopsWithErrors = apiStopsWithErrors.filter(
        item => item.internalId !== internalId,
      )
      this.setApiStopsWithErrorsToLocalStorage(updatedApiStopsWithErrors)
      this.updateStopsWithErrors(apiStopsWithErrors)
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
