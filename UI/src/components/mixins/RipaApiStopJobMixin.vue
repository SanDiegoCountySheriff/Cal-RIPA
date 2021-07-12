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
        // clear api stops key since all api stops were handled -
        // either submitted successfully or moved to new key in local storage
        this.removeApiStopsFromLocalStorage()

        // iterate through each apiStop
        for (let index = 0; index < apiStops.length; index++) {
          const apiStop = apiStops[index]
          await this.editOfficerStop(apiStop)
        }

        const stopIdsPassedStr = `Stop ID(s) submitted successfully: ${this.mappedStopSubmissionPassedIds.join(
          ', ',
        )}`

        if (this.mappedStopSubmissionFailedStops.length === 0) {
          this.snackbarText = `${this.mappedStopSubmissionStatus}. ${stopIdsPassedStr}.`
          this.snackbarVisible = true
        } else {
          this.snackbarText = `${this.mappedStopSubmissionStatus}.`
          this.snackbarVisible = true

          // if there are failed ids, update error stops key
          this.setApiStopsWithErrorsToLocalStorage(
            this.mappedStopSubmissionFailedStops,
          )
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

    setApiStopsToLocalStorage(apiStops) {
      localStorage.setItem('ripa_submitted_api_stops', JSON.stringify(apiStops))
    },

    setApiStopsWithErrorsToLocalStorage(apiStops) {
      // get current array from local storage
      const currentApiStops = localStorage.getItem(
        'ripa_submitted_api_stops_with_errors',
      )
      // parse ite
      const parsedApiStops = currentApiStops ? JSON.parse(currentApiStops) : []
      const updatedApiStops = parsedApiStops

      for (let index = 0; index < apiStops.length; index++) {
        const apiStop = apiStops[index]
        const updatedApiStops = parsedApiStops.filter(
          item => item.internalId !== apiStop.internalId,
        )
        updatedApiStops.push(apiStop)
      }

      if (updatedApiStops.length === 0) {
        localStorage.removeItem('ripa_submitted_api_stops_with_errors')
      } else {
        localStorage.setItem(
          'ripa_submitted_api_stops_with_errors',
          JSON.stringify(updatedApiStops),
        )
      }
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
