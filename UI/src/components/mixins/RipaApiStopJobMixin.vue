<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data() {
    return {
      isLocked: false,
      locationSource: 'Location',
      basisForSearchSource: 'Basis for Search Person: ',
      stopReasonSource: 'Stop Reason Person: ',
      snackbarText: '',
      snackbarNoErrorsVisible: false,
      snackbarErrorsVisible: false,
    }
  },

  computed: {
    ...mapGetters([
      'piiServiceAvailable',
      'mappedStopSubmissionStatus',
      'mappedStopSubmissionPassedIds',
      'mappedStopSubmissionFailedStops',
      'mappedStopsWithErrors',
    ]),
  },

  methods: {
    ...mapActions([
      'checkTextForPii',
      'setPiiServiceAvailable',
      'submitOfficerStop',
      'resetStopSubmissionStatus',
    ]),

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
        this.setStopsWithErrors(apiStopsWithErrors)
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
          if (apiStop.telemetry.offline && !apiStop.overridePii) {
            for (const person of apiStop.listPersonStopped) {
              // check basisForSearch
              let trimmedTextValue = person.basisForSearchBrief
                ? person.basisForSearchBrief.trim()
                : ''
              if (
                this.isOnlineAndAuthenticated &&
                !this.invalidUser &&
                trimmedTextValue.length > 0
              ) {
                const response = await this.checkTextForPii(trimmedTextValue)
                person.basisForSearchPiiFound =
                  response &&
                  response.piiEntities &&
                  response.piiEntities.length > 0
                apiStop.isPiiFound =
                  apiStop.isPiiFound || person.basisForSearchPiiFound
                if (
                  !person.basisForSearchPiiFound &&
                  apiStop.piiEntities?.length > 0
                ) {
                  apiStop.piiEntities = apiStop.piiEntities.filter(
                    e => e.source !== this.basisForSearchSource + person.index,
                  )
                }
                if (!response) {
                  await this.setPiiServiceAvailable(false)
                  person.basisForSearchPiiFound =
                    person.basisForSearchPiiFound || false
                } else if (response.piiEntities.length > 0) {
                  apiStop.piiEntities = apiStop.piiEntities
                    ? apiStop.piiEntities.filter(
                        e =>
                          e.source !== this.basisForSearchSource + person.index,
                      )
                    : []
                  for (const entity of response.piiEntities) {
                    entity.source = this.basisForSearchSource + person.index
                    apiStop.piiEntities.push(entity)
                  }
                }
              }
              // check reasonForStopExplanation
              trimmedTextValue = person.reasonForStopExplanation
                ? person.reasonForStopExplanation.trim()
                : ''
              if (
                this.isOnlineAndAuthenticated &&
                !this.invalidUser &&
                trimmedTextValue.length > 0
              ) {
                const response = await this.checkTextForPii(trimmedTextValue)
                person.reasonForStopPiiFound =
                  response &&
                  response.piiEntities &&
                  response.piiEntities.length > 0
                apiStop.isPiiFound =
                  apiStop.isPiiFound || person.reasonForStopPiiFound
                if (
                  !person.reasonForStopPiiFound &&
                  apiStop.piiEntities?.length > 0
                ) {
                  apiStop.piiEntities = apiStop.piiEntities.filter(
                    e => e.source !== this.stopReasonSource + person.index,
                  )
                }
                if (!response) {
                  await this.setPiiServiceAvailable(false)
                  person.reasonForStopPiiFound =
                    person.reasonForStopPiiFound || false
                } else if (response.piiEntities.length > 0) {
                  apiStop.piiEntities = apiStop.piiEntities
                    ? apiStop.piiEntities.filter(
                        e => e.source !== this.stopReasonSource + person.index,
                      )
                    : []
                  for (const entity of response.piiEntities) {
                    entity.source = this.stopReasonSource + person.index
                    apiStop.piiEntities.push(entity)
                  }
                }
              }
            }
            // check location
            const trimmedTextValue = apiStop.location.fullAddress
              ? apiStop.location.fullAddress.trim()
              : ''
            if (
              this.isOnlineAndAuthenticated &&
              !this.invalidUser &&
              trimmedTextValue.length > 0
            ) {
              const response = await this.checkTextForPii(trimmedTextValue)
              apiStop.location.piiFound =
                response &&
                response.piiEntities &&
                response.piiEntities.length > 0
              apiStop.isPiiFound =
                apiStop.isPiiFound || apiStop.location.piiFound
              if (
                !apiStop.location.piiFound &&
                apiStop.piiEntities?.length > 0
              ) {
                apiStop.piiEntities = apiStop.piiEntities.filter(
                  e => e.source !== this.locationSource,
                )
              }
              if (!response) {
                await this.setPiiServiceAvailable(false)
                apiStop.location.piiFound = apiStop.location.piiFound || false
              } else if (response.piiEntities.length > 0) {
                apiStop.piiEntities = apiStop.piiEntities
                  ? apiStop.piiEntities.filter(
                      e => e.source !== this.locationSource,
                    )
                  : []
                for (const entity of response.piiEntities) {
                  entity.source = this.locationSource
                  apiStop.piiEntities.push(entity)
                }
              }
            }
          }

          if (!this.piiServiceAvailable && !apiStop.overridePii) {
            apiStop.isPiiFound = true
            apiStop.piiEntities = [
              {
                entityText:
                  'Text analytics service was unavailable, please review the stop for PII',
              },
            ]
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

    async submitOfficerStopOnline(apiStop) {
      this.resetStopSubmissionStatus()

      await this.submitOfficerStop(apiStop)

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
      this.setStopsWithErrors(apiStopsWithErrors)
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
