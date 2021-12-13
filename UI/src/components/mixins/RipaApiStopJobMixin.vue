<script>
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      isLocked: false,
      locationSource: 'Location',
      basisForSearchSource: 'Basis for Search',
      stopReasonSource: 'Stop Reason',
    }
  },

  methods: {
    ...mapActions(['checkTextForPii']),

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
      if (this.isOnlineAndAuthenticated) {
        // reset stop submission status in store
        this.resetStopSubmissionStatus()

        // clear api stops key since all api stops were handled -
        // either submitted successfully or moved to new key in local storage
        this.removeApiStopsFromLocalStorage()

        console.log(`Api Stops Job Submitted: ${apiStops.length} stops`)

        // iterate through each apiStop
        for (let index = 0; index < apiStops.length; index++) {
          const apiStop = apiStops[index]
          if (apiStop.telemetry.offline) {
            for (const person of apiStop.listPersonStopped) {
              let trimmedTextValue = person.basisForSearchBrief
                ? person.basisForSearchBrief.trim()
                : ''
              if (
                this.isOnlineAndAuthenticated &&
                !this.invalidUser &&
                trimmedTextValue.length > 0
              ) {
                const response = await this.checkTextForPii(trimmedTextValue)
                this.stop = Object.assign({}, this.stop)

                if (this.stop.actionsTaken) {
                  this.stop.actionsTaken.basisForSearchPiiFound =
                    response &&
                    response.piiEntities &&
                    response.piiEntities.length > 0
                  this.stop.isPiiFound =
                    this.stop.isPiiFound ||
                    this.stop.actionsTaken.basisForSearchPiiFound
                }

                if (
                  !this.stop.actionsTaken.basisForSearchPiiFound &&
                  this.stop.piiEntities?.length > 0
                ) {
                  this.stop.piiEntities = this.stop.piiEntities.filter(
                    e =>
                      e.source !==
                      this.basisForSearchSource + this.stop.person.index,
                  )
                }

                if (!response) {
                  this.stop.isPiiFound = true
                  this.stop.piiEntities = [
                    { entityText: 'Text Analytics Service was unavailable' },
                  ]
                } else if (response?.piiEntities.length > 0) {
                  this.stop.piiEntities = this.stop.piiEntities
                    ? this.stop.piiEntities.filter(
                        e =>
                          e.source !==
                          this.basisForSearchSource + this.stop.person.index,
                      )
                    : []
                  for (const entity of response.piiEntities) {
                    entity.source =
                      this.basisForSearchSource + this.stop.person.index
                    this.stop.piiEntities.push(entity)
                  }
                }
              }

              trimmedTextValue = person.reasonForStopExplanation
                ? person.reasonForStopExplanation.trim()
                : ''
              if (
                this.isOnlineAndAuthenticated &&
                !this.invalidUser &&
                trimmedTextValue.length > 0
              ) {
                const response = await this.checkTextForPii(trimmedTextValue)
                this.stop = Object.assign({}, this.stop)

                if (this.stop.stopReason) {
                  this.stop.stopReason.reasonForStopPiiFound =
                    response &&
                    response.piiEntities &&
                    response.piiEntities.length > 0
                  this.stop.isPiiFound =
                    this.stop.isPiiFound ||
                    this.stop.stopReason.reasonForStopPiiFound
                }

                if (
                  !this.stop.stopReason.reasonForStopPiiFound &&
                  this.stop.piiEntities?.length > 0
                ) {
                  this.stop.piiEntities = this.stop.piiEntities.filter(
                    e =>
                      e.source !==
                      this.stopReasonSource + this.stop.person.index,
                  )
                }

                if (!response) {
                  this.stop.isPiiFound = true
                  this.stop.piiEntities = [
                    { entityText: 'Text Analytics Service was unavailable' },
                  ]
                } else if (response?.piiEntities.length > 0) {
                  this.stop.piiEntities = this.stop.piiEntities
                    ? this.stop.piiEntities.filter(
                        e =>
                          e.source !==
                          this.stopReasonSource + this.stop.person.index,
                      )
                    : []
                  for (const entity of response.piiEntities) {
                    entity.source =
                      this.stopReasonSource + this.stop.person.index
                    this.stop.piiEntities.push(entity)
                  }
                }
              }
            }

            const trimmedTextValue = apiStop.location.fullAddress
              ? apiStop.location.fullAddress.trim()
              : ''
            if (
              this.isOnlineAndAuthenticated &&
              !this.invalidUser &&
              trimmedTextValue.length > 0
            ) {
              const response = await this.checkTextForPii(trimmedTextValue)
              this.stop = Object.assign({}, this.stop)

              if (this.stop.location) {
                this.stop.location.piiFound =
                  response &&
                  response.piiEntities &&
                  response.piiEntities.length > 0
                this.stop.isPiiFound =
                  this.stop.isPiiFound || this.stop.location.piiFound
              }

              if (
                !this.stop.location.piiFound &&
                this.stop.piiEntities?.length > 0
              ) {
                this.stop.piiEntities = this.stop.piiEntities.filter(
                  e => e.source !== this.locationSource,
                )
              }

              if (!response) {
                this.stop.isPiiFound = true
                this.stop.piiEntities = [
                  { entityText: 'Text Analytics Service was unavailable' },
                ]
              } else if (response.piiEntities.length > 0) {
                this.stop.piiEntities = this.stop.piiEntities
                  ? this.stop.piiEntities.filter(
                      e => e.source !== this.locationSource,
                    )
                  : []

                for (const entity of response.piiEntities) {
                  entity.source = this.locationSource
                  this.stop.piiEntities.push(entity)
                }
              }
            }
          }

          await this.timeout(1500)
          await this.submitOfficerStop(apiStop)
          await this.timeout(1500)
        }

        console.log(
          `Api Stops Submitted Successfully: ${this.mappedStopSubmissionPassedIds.length} stops`,
        )
        console.log(
          `Api Stops Submitted with Errors: ${this.mappedStopSubmissionFailedStops.length} stops`,
        )

        let stopIdsPassedStr = ''
        if (this.mappedStopSubmissionPassedIds.length > 0) {
          stopIdsPassedStr = `Stop ID(s) submitted successfully: ${this.mappedStopSubmissionPassedIds.join(
            ', ',
          )}.`
        }

        // update snackbarText regardless if errors or not
        this.snackbarText = `${this.mappedStopSubmissionStatus}. ${stopIdsPassedStr}`

        console.log(`Api Stops Job Status Text: ${this.snackbarText}`)

        // display no errors snackbar which closes automatically
        if (this.mappedStopSubmissionFailedStops.length === 0) {
          this.snackbarNoErrorsVisible = true
        }

        if (this.mappedStopSubmissionFailedStops.length > 0) {
          // display errors snackbar which remains open
          this.snackbarErrorsVisible = true
          // if there are failed ids, update error stops key
          this.pushFailedStopsToStopsWithErrors(
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

    pushFailedStopsToStopsWithErrors(apiStops) {
      const apiStopsWithErrors = this.getApiStopsWithErrorsFromLocalStorage()
      const updatedApiStops = apiStopsWithErrors.concat(apiStops)

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

    getStopWithErrorGivenInternalId(internalId) {
      const apiStopsWithErrors = this.getApiStopsWithErrorsFromLocalStorage()
      const [filteredApiStopWithStop] = apiStopsWithErrors.filter(
        item => item.internalId === internalId,
      )
      return filteredApiStopWithStop?.apiStop || null
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
