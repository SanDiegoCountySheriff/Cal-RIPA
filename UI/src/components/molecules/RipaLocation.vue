<template>
  <div class="ripa-location tw-pb-4">
    <ripa-form-header
      title="Location"
      required
      subtitle="§999.226(a)(3)"
      v-on="$listeners"
    >
    </ripa-form-header>

    <v-container class="mt-5">
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <v-btn
            :loading="loadingGps"
            :disabled="!isGeolocationAvailable"
            @click="handleCurrentLocation"
            color="primary"
            block
            small
          >
            Current Location
          </v-btn>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-btn
            :disabled="!validLastLocation"
            @click="handleLastLocation"
            color="primary"
            block
            small
          >
            Last Location
          </v-btn>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-btn @click="handleOpenFavorites" color="primary" block small>
            Open Favorites
          </v-btn>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <template v-if="isOnlineAndAuthenticated">
            <v-btn @click="handleSaveFavorite" color="primary" block small>
              Save Location
            </v-btn>
          </template>
        </v-col>
      </v-row>

      <v-row>
        <v-col
          v-if="
            favoriteLocations.filter(item => item.version === model.stopVersion)
              .length > 0
          "
          class="text-center py-0"
        >
          Top 5 Favorites
        </v-col>
      </v-row>

      <v-row>
        <v-col class="text-center">
          <v-btn
            v-for="(item, index) in favoriteLocations
              .filter(item => item.version === model.stopVersion)
              .slice(0, 5)"
            :key="index"
            @click="handleFavoriteClick(item)"
            color="primary"
            class="mr-3 mb-2"
            small
            outlined
          >
            {{ item.name }}
          </v-btn>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" sm="12">
          <ripa-switch
            v-model="model.location.isSchool"
            @input="handleInput"
            label="K-12 Public School"
            :max-width="200"
          ></ripa-switch>

          <template v-if="model.location.isSchool">
            <ripa-autocomplete
              v-model="model.location.school"
              @input="handleInput"
              hint="Select 1 School (required)"
              item-text="fullName"
              item-value="cdsCode"
              label="School"
              :items="schools"
              :rules="schoolRules"
            ></ripa-autocomplete>
          </template>

          <ripa-alert alert-outlined alert-type="info" class="mt-4">
            Note: Do not provide a street address if the location is a
            residence.
          </ripa-alert>

          <ripa-alert
            v-if="model.location.piiFound"
            @input="handleInput"
            alert-outlined
            alert-type="warning"
          >
            The address may contain personally identifying information. Please
            remove if possible.
          </ripa-alert>

          <ripa-alert
            v-if="!isGeolocationAvailable"
            alert-outlined
            alert-type="warning"
          >
            Location services on this device are currently inaccurate and have
            been disabled.
          </ripa-alert>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" sm="12" md="6">
          <ripa-text-input
            v-model="model.location.blockNumber"
            @input="handleInput"
            :loading="loadingPiiStep1"
            :rules="
              model.stopVersion === 1 ? blockNumberRules : blockNumberRulesV2
            "
            @blur="handleBlockNumber"
            label="Block Number"
            numbers-only
            prevent-paste
          >
          </ripa-text-input>
        </v-col>

        <v-col cols="12" sm="12" md="6">
          <ripa-text-input
            v-model="model.location.streetName"
            @input="handleInput"
            :loading="loadingPiiStep1"
            :rules="
              model.stopVersion === 1 ? streetNameRules : streetNameRulesV2
            "
            @blur="handlePiiCheck($event)"
            label="Street Name"
          >
          </ripa-text-input>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" sm="12">
          <ripa-subheader text="-- or --"></ripa-subheader>

          <v-row>
            <template v-if="model.stopVersion === 1">
              <v-col cols="12" sm="12">
                <ripa-text-input
                  v-model="model.location.intersection"
                  @input="handleInput"
                  :loading="loadingPiiStep1"
                  :rules="intersectionRules"
                  @blur="handlePiiCheck($event)"
                  label="Closest Intersection"
                >
                </ripa-text-input>
              </v-col>
            </template>

            <template v-else-if="model.stopVersion === 2">
              <v-col cols="12" sm="6">
                <ripa-text-input
                  v-model="model.location.crossStreet1"
                  @input="handleInput"
                  :loading="loadingPiiStep1"
                  :rules="crossStreetRules"
                  @blur="handlePiiCheck($event)"
                  label="Cross Street 1"
                ></ripa-text-input>
              </v-col>
              <v-col cols="12" sm="6">
                <ripa-text-input
                  v-model="model.location.crossStreet2"
                  @input="handleInput"
                  :loading="loadingPiiStep1"
                  :rules="crossStreetRules"
                  @blur="handlePiiCheck($event)"
                  label="Cross Street 2"
                ></ripa-text-input>
              </v-col>
            </template>
          </v-row>

          <ripa-switch
            v-model="model.location.toggleLocationOptions"
            @input="handleInput"
            :max-width="225"
            label="More Location Options"
          ></ripa-switch>

          <template v-if="model.location.toggleLocationOptions">
            <template v-if="this.model.stopVersion === 2">
              <ripa-subheader text="-- or --"></ripa-subheader>

              <v-row>
                <v-col cols="12" sm="12" md="6">
                  <ripa-text-input
                    v-model="model.location.latitude"
                    @input="handleInput"
                    :loading="loadingPiiStep1"
                    :rules="latitudeRules"
                    @blur="handleBlockNumber"
                    label="Latitude"
                  >
                  </ripa-text-input>
                </v-col>

                <v-col cols="12" sm="12" md="6">
                  <ripa-text-input
                    v-model="model.location.longitude"
                    @input="handleInput"
                    :loading="loadingPiiStep1"
                    :rules="longitudeRules"
                    @blur="handlePiiCheck($event)"
                    label="Longitude"
                  >
                  </ripa-text-input>
                </v-col>
              </v-row>
            </template>

            <ripa-subheader text="-- or --"></ripa-subheader>

            <template v-if="model.stopVersion === 1">
              <ripa-text-input
                v-model="model.location.highwayExit"
                @input="handleInput"
                :loading="loadingPiiStep1"
                :rules="highwayRules"
                @blur="handlePiiCheck($event)"
                label="Highway and closest exit"
              >
              </ripa-text-input>
            </template>

            <template v-else-if="model.stopVersion === 2">
              <v-row>
                <v-col cols="12" sm="12" md="6">
                  <ripa-text-input
                    v-model="model.location.highway"
                    @input="handleInput"
                    :loading="loadingPiiStep1"
                    :rules="highwayRulesV2"
                    @blur="handlePiiCheck($event)"
                    label="Highway"
                  >
                  </ripa-text-input>
                </v-col>

                <v-col cols="12" sm="12" md="6">
                  <ripa-text-input
                    v-model="model.location.exit"
                    @input="handleInput"
                    :loading="loadingPiiStep1"
                    :rules="highwayRulesV2"
                    @blur="handlePiiCheck($event)"
                    label="Closest Exit"
                  >
                  </ripa-text-input>
                </v-col>
              </v-row>
            </template>

            <ripa-subheader text="-- or --"></ripa-subheader>

            <ripa-text-input
              v-model="model.location.landmark"
              @input="handleInput"
              :loading="loadingPiiStep1"
              :rules="model.stopVersion === 1 ? landmarkRules : landmarkRulesV2"
              @blur="handlePiiCheck($event)"
              label="Road marker, landmark, or other"
            >
            </ripa-text-input>
          </template>

          <div class="tw-mt-8">
            <ripa-switch
              v-model="model.location.outOfCounty"
              :max-width="200"
              @input="handleOutOfCountyToggle, handleInput"
              label="City Out of County?"
            ></ripa-switch>
          </div>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" sm="12" md="6">
          <ripa-autocomplete
            v-model="model.location.city"
            @input="handleInput"
            hint="Select 1 City (required)"
            persistent-hint
            item-text="fullName"
            item-value="id"
            :label="
              model.stopVersion === 1 ? 'City' : 'City or Unincorporated Area'
            "
            :items="getCities"
            :rules="cityRules"
          ></ripa-autocomplete>
        </v-col>

        <template v-if="displayBeatInput">
          <v-col cols="12" sm="12" md="6">
            <ripa-autocomplete
              v-model="model.location.beat"
              @input="handleInput"
              hint="Select 1 Beat (required)"
              persistent-hint
              item-text="fullName"
              item-value="id"
              label="Beat"
              :items="beats"
              :rules="beatRules"
              :disabled="model.location.outOfCounty"
            ></ripa-autocomplete>
          </v-col>
        </template>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import RipaAlert from '@/components/atoms/RipaAlert'
import RipaAutocomplete from '@/components/atoms/RipaAutocomplete'
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaSubheader from '@/components/atoms/RipaSubheader'
import RipaSwitch from '@/components/atoms/RipaSwitch'
import RipaTextInput from '@/components/atoms/RipaTextInput'

export default {
  name: 'ripa-location',

  components: {
    RipaAlert,
    RipaAutocomplete,
    RipaFormHeader,
    RipaSubheader,
    RipaSwitch,
    RipaTextInput,
  },

  inject: [
    'beats',
    'countyCities',
    'nonCountyCities',
    'schools',
    'displayBeatInput',
    'isOnlineAndAuthenticated',
    'lastLocation',
    'loadingGps',
    'loadingPiiStep1',
    'validLastLocation',
    'favoriteLocations',
  ],

  computed: {
    model: {
      get() {
        return this.value
      },
    },

    getCities() {
      const checked = this.model.location.outOfCounty

      return checked ? this.nonCountyCities : this.countyCities
    },

    schoolRules() {
      const checked = this.model.location.isSchool
      const school = this.model.location.school

      return [(checked && school !== null) || 'A school is required']
    },

    cityRules() {
      const city = this.model.location.city

      return [(city !== null && city !== '') || 'A city is required']
    },

    beatRules() {
      const beat = this.model.location.beat

      return [
        !this.displayBeatInput ||
          (this.displayBeatInput && beat !== null) ||
          'A beat is required',
      ]
    },

    blockNumberRules() {
      const streetName = this.model.location.streetName
      const blockNumber = this.model.location.blockNumber

      return [
        this.isLocationOptionsFilled ||
          (blockNumber !== null && blockNumber !== '') ||
          'A block number is required',
        this.isLocationOptionsFilled ||
          (streetName + blockNumber).length >= 5 ||
          'Block number plus street name must be between 5 and 250 characters',
      ]
    },

    blockNumberRulesV2() {
      const blockNumber = this.model.location.blockNumber

      return [
        this.isLocationOptionsFilledV2 ||
          (blockNumber !== null && blockNumber !== '') ||
          'A block number is required',
        this.isLocationOptionsFilledV2 ||
          (blockNumber.length >= 1 && blockNumber.length <= 8) ||
          'Block number must be between 1 and 8 characters',
      ]
    },

    latitudeRules() {
      const regex = /^(\d{2}\.\d{0,3}|\d{2})$/

      return [
        v => this.isLocationOptionsFilledV2 || !!v || 'Latitude is required',
        v =>
          this.isLocationOptionsFilledV2 ||
          regex.test(v) ||
          'A valid latitude with a maximum of 3 digits after the decimal is required',
      ]
    },

    longitudeRules() {
      const regex = /^(-\d{3}\.\d{0,3}|-\d{3})$/

      return [
        v => this.isLocationOptionsFilledV2 || !!v || 'Longitude is required',
        v =>
          this.isLocationOptionsFilledV2 ||
          regex.test(v) ||
          'A valid negative longitude with a maximum of 3 digits after the decimal is required',
      ]
    },

    streetNameRules() {
      const streetName = this.model.location.streetName
      const blockNumber = this.model.location.blockNumber

      return [
        this.isLocationOptionsFilled ||
          (streetName && streetName.length > 0) ||
          'A street name is required',
        this.isLocationOptionsFilled ||
          (streetName + blockNumber).length >= 5 ||
          'Block number plus street name must be between 5 and 250 characters',
      ]
    },

    streetNameRulesV2() {
      const streetName = this.model.location.streetName

      return [
        this.isLocationOptionsFilledV2 ||
          (streetName && streetName.length > 0) ||
          'A street name is required',
        this.isLocationOptionsFilledV2 ||
          (streetName.length >= 1 && streetName.length <= 50) ||
          'Street name must be between 1 and 50 characters',
      ]
    },

    intersectionRules() {
      const intersection = this.model.location.intersection

      return [
        this.isLocationOptionsFilled ||
          (intersection && intersection.length > 0) ||
          'An intersection is required',
        this.isLocationOptionsFilled ||
          (intersection && intersection.length >= 5) ||
          'Intersection must be between 5 and 250 characters',
      ]
    },

    crossStreetRules() {
      const crossStreet1 = this.model.location.crossStreet1 || ''
      const crossStreet2 = this.model.location.crossStreet2 || ''

      return [
        this.isLocationOptionsFilledV2 ||
          (!!crossStreet1 && !!crossStreet2) ||
          'Must fill out both cross streets in order to use cross streets',
        (this.isLocationOptionsFilledV2 &&
          crossStreet1.length < 50 &&
          crossStreet2.length < 50) ||
          'Cross streets must be 50 characters or less',
      ]
    },

    highwayRules() {
      const checked = this.model.location.toggleLocationOptions
      const highwayExit = this.model.location.highwayExit
      const landmark = this.model.location.landmark

      return [
        this.isLocationOptionsFilled ||
          (checked && highwayExit !== null && highwayExit !== '') ||
          'A highway and closest exit is required',
        this.isLocationOptionsFilled ||
          (checked &&
            highwayExit &&
            highwayExit.length >= 5 &&
            highwayExit.length <= 250 &&
            landmark !== null &&
            landmark !== '') ||
          'Highway and closest exit must be between 5 and 250 characters',
      ]
    },

    highwayRulesV2() {
      const checked = this.model.location.toggleLocationOptions
      const highway = this.model.location.highway || ''
      const exit = this.model.location.exit || ''

      return [
        this.isLocationOptionsFilledV2 ||
          (!!highway && highway !== '' && !!exit && exit !== '') ||
          'Must fill out both highway and exit in order to use highway and exit',
        this.isLocationOptionsFilledV2 ||
          (checked && highway && highway.length >= 1 && highway.length <= 75) ||
          'Highway must be between 1 and 75 characters',
        this.isLocationOptionsFilledV2 ||
          (checked && exit && exit.length >= 1 && exit.length <= 50) ||
          'Closest exit must be between 1 and 50 characters',
      ]
    },

    landmarkRules() {
      const checked = this.model.location.toggleLocationOptions
      const highwayExit = this.model.location.highwayExit
      const landmark = this.model.location.landmark

      return [
        this.isLocationOptionsFilled ||
          (checked && landmark !== null && landmark !== '') ||
          'A road marker, landmark, or other description is required',
        this.isLocationOptionsFilled ||
          (checked &&
            landmark &&
            landmark.length >= 5 &&
            landmark.length <= 250 &&
            highwayExit !== null &&
            highwayExit !== '') ||
          'Road marker, landmark or other description must be between 5 and 250 characters',
      ]
    },

    landmarkRulesV2() {
      const checked = this.model.location.toggleLocationOptions
      const highwayExit = this.model.location.highwayExit
      const landmark = this.model.location.landmark
      return [
        this.isLocationOptionsFilledV2 ||
          (checked && landmark !== null && landmark !== '') ||
          'A road marker, landmark, or other description is required',
        this.isLocationOptionsFilledV2 ||
          (checked &&
            landmark !== null &&
            landmark !== '' &&
            landmark.length >= 5 &&
            landmark.length <= 150 &&
            highwayExit !== null &&
            highwayExit !== '') ||
          'Road marker, landmark or other description must be between 5 and 150 characters',
      ]
    },

    isLocationOptionsFilled() {
      const blockNumber = this.model.location.blockNumber
      const streetName = this.model.location.streetName
      const intersection = this.model.location.intersection
      const crossStreet1 = this.model.location.crossStreet1
      const crossStreet2 = this.model.location.crossStreet2
      const checked = this.model.location.toggleLocationOptions
      const highwayExit = this.model.location.highwayExit
      const landmark = this.model.location.landmark

      const isValid =
        (blockNumber !== null &&
          blockNumber !== '' &&
          streetName &&
          streetName.length > 0 &&
          (blockNumber + streetName).length >= 5) ||
        (intersection &&
          intersection.length >= 5 &&
          this.model.stopVersion === 1) ||
        (crossStreet1 && crossStreet2 && this.model.stopVersion === 2) ||
        (checked &&
          highwayExit !== null &&
          highwayExit.length >= 5 &&
          highwayExit.length <= 250) ||
        (checked &&
          landmark !== null &&
          landmark.length >= 5 &&
          landmark.length <= 250)

      return isValid
    },

    isLocationOptionsFilledV2() {
      const blockNumber = this.model.location.blockNumber
      const streetName = this.model.location.streetName
      const intersection = this.model.location.intersection
      const crossStreet1 = this.model.location.crossStreet1
      const crossStreet2 = this.model.location.crossStreet2
      const checked = this.model.location.toggleLocationOptions
      const highway = this.model.location.highway
      const exit = this.model.location.exit
      const landmark = this.model.location.landmark

      const latitudeRegex = /^(\d{2}\.\d{0,3}|\d{2})$/
      const isLatitudeValid =
        latitudeRegex.test(this.model.location.latitude) &&
        this.model.location.latitude

      const longitudeRegex = /^(-\d{3}\.\d{0,3}|-\d{3})$/
      const isLongitudeValid = longitudeRegex.test(
        this.model.location.longitude,
      )

      if (
        !isLongitudeValid &&
        this.model.location.longitude !== '' &&
        this.model.location.longitude !== null
      ) {
        return false
      }

      if (
        !isLatitudeValid &&
        this.model.location.latitude !== '' &&
        this.model.location.latitude !== null
      ) {
        return false
      }

      const isValid =
        (blockNumber !== null &&
          blockNumber !== '' &&
          streetName &&
          streetName.length > 0 &&
          blockNumber.length >= 1 &&
          blockNumber.length <= 8 &&
          streetName.length >= 1 &&
          streetName.length <= 50) ||
        (intersection &&
          intersection.length >= 5 &&
          this.model.stopVersion === 1) ||
        (crossStreet1 && crossStreet2 && this.model.stopVersion === 2) ||
        (checked &&
          highway !== null &&
          highway !== '' &&
          highway.length >= 1 &&
          highway.length <= 75 &&
          exit !== null &&
          exit !== '' &&
          exit.length >= 1 &&
          exit.length <= 50) ||
        (checked &&
          landmark !== null &&
          landmark !== '' &&
          landmark.length >= 5 &&
          landmark.length <= 150) ||
        (isLatitudeValid && isLongitudeValid)

      return isValid
    },
  },

  async created() {
    if (
      this.model.location.streetName !== null ||
      this.model.location.intersection !== null ||
      this.model.location.highwayExit !== null ||
      this.model.location.landmark
    ) {
      const textValue = `${this.model.location.streetName ?? ''}, ${
        this.model.location.intersection ?? ''
      }, ${this.model.location.highwayExit ?? ''}, ${
        this.model.location.landmark ?? ''
      }`
      this.$emit('pii-check', {
        source: 'location',
        value: textValue.replace('.', ''),
      })
    }
  },

  methods: {
    handleInput() {
      this.updateModel()
      this.$emit('input', this.model)
    },

    updateModel() {
      if (!this.model.location.isSchool) {
        this.model.location.school = null
        this.model.person.isStudent = false
        this.model.stopResult.resultsOfStop12 = false
        this.model.stopResult.resultsOfStop13 = false
        this.model.person.perceivedOrKnownDisability =
          this.model.person.perceivedOrKnownDisability.filter(
            disability => disability !== 7,
          )
      }

      if (!this.model.location.toggleLocationOptions) {
        this.model.location.highwayExit = null
        this.model.location.landmark = null
      }

      const streetName = this.model.location?.streetName || ''
      const highwayExit = this.model.location?.highwayExit || ''
      const intersection = this.model.location?.intersection || ''
      const landMark = this.model.location?.landMark || ''
      const fullAddress =
        streetName + ' ' + highwayExit + ' ' + intersection + ' ' + landMark
      this.model.location.fullAddress = fullAddress
    },

    handleCurrentLocation() {
      if (navigator.geolocation) {
        this.$emit('on-gps-location')
      }
    },

    handleOutOfCountyToggle() {
      if (this.model.location.outOfCounty) {
        this.model.location.beat = '999'
        this.model.location.city = null
      }

      if (
        !this.model.location.outOfCounty &&
        this.model.location.beat === '999'
      ) {
        this.model.location.beat = null
        this.model.location.city = null
      }
    },

    handleBlockNumber() {
      if (this.model.stopVersion === 1) {
        this.model.location.blockNumber = this.parseBlockNumber(
          this.model.location.blockNumber,
        )
      } else {
        this.model.location.blockNumber = this.parseBlockNumberV2(
          this.model.location.blockNumber,
        )
      }
    },

    handlePiiCheck(event) {
      if (event) {
        const textValue = `${this.model.location.streetName ?? ''}, ${
          this.model.location.intersection ?? ''
        }, ${this.model.location.highwayExit ?? ''}, ${
          this.model.location.landmark ?? ''
        }`
        this.$emit('pii-check', {
          source: 'location',
          value: textValue.replace('.', ''),
        })
      }
    },

    parseBlockNumber(value) {
      let blockNumber = value
      if (blockNumber !== null && blockNumber.length > 0) {
        const calcBlockNumber = Math.floor(Number(blockNumber) / 100) * 100
        blockNumber = calcBlockNumber
      }

      const result =
        typeof blockNumber === 'string' ||
        (typeof blockNumber === 'number' && !isNaN(blockNumber))
          ? blockNumber.toString()
          : null

      return result
    },

    parseBlockNumberV2(value) {
      let blockNumber = value

      if (blockNumber !== null && blockNumber.length > 0) {
        const numDigits = blockNumber.length

        if (numDigits <= 2) {
          if (blockNumber < 10) {
            blockNumber = 0
          } else {
            const lastDigit = parseInt(blockNumber.toString().slice(-1))
            blockNumber -= lastDigit
          }
        } else {
          const lastTwoDigits = parseInt(blockNumber.toString().slice(-2))
          blockNumber -= lastTwoDigits % 100
        }
      }

      const result =
        typeof blockNumber === 'string' ||
        (typeof blockNumber === 'number' && !isNaN(blockNumber))
          ? blockNumber.toString()
          : null

      return result
    },

    handleLastLocation() {
      this.$emit('on-open-last-location')
    },

    handleOpenFavorites() {
      this.$emit('on-open-location-favorites', this.model.stopVersion)
    },

    handleSaveFavorite() {
      this.$emit(
        'on-save-location-favorite',
        this.model.location,
        this.model.stopVersion,
      )
    },

    isGeolocationAvailable() {
      return new Promise(resolve => {
        navigator.geolocation.getCurrentPosition(position => {
          const accuracyScore = position.coords.accuracy
          const isAvail = !(accuracyScore > 200)
          resolve(isAvail)
        })
      })
    },

    handleFavoriteClick(favorite) {
      this.$emit('on-open-favorite-location', favorite.id)
    },
  },

  watch: {
    lastLocation: {
      handler: async function (newVal) {
        if (newVal) {
          this.model.location = { ...newVal.newLocation }
          this.handleInput()
        }
      },
      deep: true,
    },
  },

  props: {
    value: {
      type: Object,
      required: true,
    },
    displayBeatInput: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
