<template>
  <div class="ripa-location tw-pb-4">
    <ripa-form-header
      title="Location"
      required
      subtitle="§999.226(a)(3)"
      :on-open-statute="onOpenStatute"
    >
    </ripa-form-header>

    <v-container>
      <v-row no-gutters>
        <v-col cols="12" sm="12" md="3" class="tw-pr-2">
          <template v-if="isGeolocationAvailable">
            <div class="tw-mr-2 tw-mt-0 sm:tw-mt-4">
              <v-btn
                class="tw-w-full"
                outlined
                small
                :loading="loadingGps"
                @click="handleCurrentLocation"
              >
                Current Location
              </v-btn>
            </div>
          </template>
        </v-col>
        <v-col cols="12" sm="12" md="3" class="tw-pr-2">
          <div class="tw-mr-2 tw-mt-0 sm:tw-mt-4">
            <v-btn
              class="tw-w-full"
              outlined
              small
              :disabled="!validLastLocation"
              @click="handleLastLocation"
              >Last Location
            </v-btn>
          </div>
        </v-col>
        <v-col cols="12" sm="12" md="3" class="tw-pr-2">
          <div class="tw-mr-2 tw-mt-0 sm:tw-mt-4">
            <v-btn
              class="tw-w-full"
              outlined
              small
              @click="handleOpenFavorites"
            >
              Open Favorites
            </v-btn>
          </div>
        </v-col>
        <v-col cols="12" sm="12" md="3">
          <div class="tw-mr-2 tw-mt-0 sm:tw-mt-4">
            <v-btn
              class="tw-w-full"
              outlined
              small
              @click="handleSaveFavorite"
              :disabled="!isOnlineAndAuthenticated"
            >
              Save Location
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col cols="12" sm="12">
          <ripa-switch
            v-model="model.location.isSchool"
            label="K-12 Public School"
            :max-width="200"
            @input="handleInput"
          ></ripa-switch>

          <template v-if="model.location.isSchool">
            <ripa-autocomplete
              v-model="model.location.school"
              hint="Select 1 School (required)"
              item-text="fullName"
              item-value="cdsCode"
              label="School"
              :items="schools"
              :rules="schoolRules"
              @input="handleInput"
            ></ripa-autocomplete>
          </template>

          <ripa-alert class="tw-mt-8" alert-outlined alert-type="info">
            Note: Do not provide a street address if the location is a
            residence.
          </ripa-alert>
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col cols="12" sm="12">
          <div class="md:tw-mr-4">
            <template v-if="model.location.piiFound">
              <ripa-alert alert-outlined alert-type="warning">
                The address may contain personally identifying information.
                Please remove if possible.
              </ripa-alert>
            </template>
          </div>
        </v-col>

        <v-col cols="12" sm="12" md="6">
          <div class="md:tw-mr-4">
            <ripa-number-input
              v-model="model.location.blockNumber"
              label="Block Number"
              :loading="loadingPii"
              :rules="blockNumberRules"
              @input="handleInput"
            >
            </ripa-number-input>
          </div>
        </v-col>

        <v-col cols="12" sm="12" md="6">
          <div>
            <ripa-text-input
              v-model="model.location.streetName"
              label="Street Name"
              :loading="loadingPii"
              :rules="streetNameRules"
              @input="handleInput"
            >
            </ripa-text-input>
          </div>
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col cols="12" sm="12">
          <ripa-subheader text="-- or --"></ripa-subheader>

          <ripa-text-input
            v-model="model.location.intersection"
            label="Closest Intersection"
            :loading="loadingPii"
            :rules="intersectionRules"
            @input="handleInput"
          >
          </ripa-text-input>

          <ripa-switch
            v-model="model.location.toggleLocationOptions"
            label="More Location Options"
            :max-width="225"
            @input="handleInput"
          ></ripa-switch>

          <template v-if="model.location.toggleLocationOptions">
            <ripa-subheader text="-- or --"></ripa-subheader>

            <ripa-text-input
              v-model="model.location.highwayExit"
              label="Highway and closest exit"
              :loading="loadingPii"
              :rules="highwayRules"
              @input="handleInput"
            >
            </ripa-text-input>

            <ripa-subheader text="-- or --"></ripa-subheader>

            <ripa-text-input
              v-model="model.location.landmark"
              label="Road marker, landmark, or other"
              :rules="landmarkRules"
              @input="handleInput"
            >
            </ripa-text-input>
          </template>

          <div class="tw-mt-8">
            <ripa-switch
              v-model="model.location.outOfCounty"
              label="City Out of County?"
              :max-width="200"
              @input="handleInput"
            ></ripa-switch>
          </div>
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col cols="12" sm="12" md="6">
          <div class="md:tw-mr-4">
            <ripa-autocomplete
              v-model="model.location.city"
              hint="Select 1 City (required)"
              persistent-hint
              item-text="fullName"
              item-value="id"
              label="City"
              :items="getCities"
              :rules="cityRules"
              @input="handleInput"
            ></ripa-autocomplete>
          </div>
        </v-col>

        <template v-if="displayBeatInput">
          <v-col cols="12" sm="12" md="6">
            <div>
              <ripa-autocomplete
                v-model="model.location.beat"
                hint="Select 1 Beat (required)"
                persistent-hint
                item-text="fullName"
                item-value="id"
                label="Beat"
                :items="beats"
                :disabled="model.location.outOfCounty"
                @input="handleInput"
              ></ripa-autocomplete>
            </div>
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
import RipaModelMixin from '@/components/mixins/RipaModelMixin'
import RipaNumberInput from '@/components/atoms/RipaNumberInput'
import RipaSubheader from '@/components/atoms/RipaSubheader'
import RipaSwitch from '@/components/atoms/RipaSwitch'
import RipaTextInput from '@/components/atoms/RipaTextInput'

export default {
  name: 'ripa-location',

  mixins: [RipaModelMixin],

  components: {
    RipaAlert,
    RipaAutocomplete,
    RipaFormHeader,
    RipaNumberInput,
    RipaSubheader,
    RipaSwitch,
    RipaTextInput,
  },

  data() {
    return {
      viewModel: this.updateModel(this.value),
    }
  },

  computed: {
    model: {
      get() {
        return this.viewModel
      },
    },

    isGeolocationAvailable() {
      return navigator.geolocation
    },

    getCities() {
      const checked = this.viewModel.location.outOfCounty

      return checked ? this.nonCountyCities : this.countyCities
    },

    schoolRules() {
      const checked = this.viewModel.location.isSchool
      const school = this.viewModel.location.school

      return [(checked && school !== null) || 'A school is required']
    },

    cityRules() {
      const city = this.viewModel.location.city

      return [city !== null || 'A city is required']
    },

    blockNumberRules() {
      const blockNumber = this.viewModel.location.blockNumber

      return [
        this.isLocationOptionsFilled ||
          blockNumber !== null ||
          'A block number is required',
      ]
    },

    streetNameRules() {
      const streetName = this.viewModel.location.streetName

      return [
        this.isLocationOptionsFilled ||
          (streetName && streetName.length > 0) ||
          'A street name is required',
      ]
    },

    intersectionRules() {
      const intersection = this.viewModel.location.intersection

      return [
        this.isLocationOptionsFilled ||
          (intersection && intersection.length > 0) ||
          'An intersection is required',
      ]
    },

    highwayRules() {
      const checked = this.viewModel.location.toggleLocationOptions
      const highwayExit = this.viewModel.location.highwayExit

      return [
        this.isLocationOptionsFilled ||
          (checked && highwayExit && highwayExit.length > 0) ||
          'A highway and closest exit is required',
      ]
    },

    landmarkRules() {
      const checked = this.viewModel.location.toggleLocationOptions
      const landmark = this.viewModel.location.landmark

      return [
        this.isLocationOptionsFilled ||
          (checked && landmark && landmark.length > 0) ||
          'A road marker, landmark, or other description is required',
      ]
    },

    isLocationOptionsFilled() {
      const blockNumber = this.viewModel.location.blockNumber
      const streetName = this.viewModel.location.streetName
      const intersection = this.viewModel.location.intersection
      const checked = this.viewModel.location.toggleLocationOptions
      const highwayExit = this.viewModel.location.highwayExit
      const landmark = this.viewModel.location.landmark

      const isValid =
        (blockNumber !== null && streetName && streetName.length > 0) ||
        (intersection && intersection.length > 0) ||
        (checked && highwayExit && highwayExit.length > 0) ||
        (checked && landmark && landmark.length > 0)

      return isValid
    },
  },

  methods: {
    handleCurrentLocation() {
      if (navigator.geolocation) {
        if (this.onGpsLocation) {
          this.onGpsLocation()
        }
      } else {
        console.log('Geolocation is not supported by this browser.')
      }
    },

    handleInput() {
      this.updateSchoolModel()
      this.updateBlockNumberModel()
      this.updateFullAddressModel()
      this.updateStopReasonModel()
      this.updateStopResultModel()
      this.$emit('input', this.viewModel)
    },

    handleInputOutOfCounty(newVal) {
      const currentVal = this.viewModel.location.outOfCounty
      if (newVal !== currentVal) {
        this.updateOutOfCountyModel()
        this.handleInput()
      }
    },

    handleLastLocation() {
      if (this.onOpenLastLocation) {
        this.onOpenLastLocation()
      }
    },

    handleOpenFavorites() {
      if (this.onOpenFavorites) {
        this.onOpenFavorites()
      }
    },

    handleSaveFavorite() {
      if (this.onSaveFavorite) {
        this.onSaveFavorite(this.viewModel.location)
      }
    },
  },

  watch: {
    value(newVal) {
      this.viewModel = this.updateModel(newVal)
    },

    lastLocation(newVal) {
      if (newVal) {
        this.viewModel.location = newVal
        this.handleInput()
      }
    },

    'viewModel.location.outOfCounty': {
      handler(newVal, oldVal) {
        if (oldVal !== newVal) {
          this.updateOutOfCountyModel()
        }
      },
    },

    'viewModel.location.blockNumber': {
      handler(newVal, oldVal) {
        if (oldVal !== newVal) {
          this.updateBlockNumberModel()
        }
      },
    },
  },

  props: {
    value: {
      type: Object,
      default: () => {},
    },
    schools: {
      type: Array,
      default: () => [],
    },
    beats: {
      type: Array,
      default: () => [],
    },
    countyCities: {
      type: Array,
      default: () => [],
    },
    displayBeatInput: {
      type: Boolean,
      default: false,
    },
    isOnlineAndAuthenticated: {
      type: Boolean,
      default: false,
    },
    lastLocation: {
      type: Object,
      default: () => {},
    },
    loadingGps: {
      type: Boolean,
      default: false,
    },
    loadingPii: {
      type: Boolean,
      default: false,
    },
    nonCountyCities: {
      type: Array,
      default: () => [],
    },
    validLastLocation: {
      type: Boolean,
      default: false,
    },
    onOpenFavorites: {
      type: Function,
      default: () => {},
    },
    onOpenLastLocation: {
      type: Function,
      default: () => {},
    },
    onSaveFavorite: {
      type: Function,
      default: () => {},
    },
    onGpsLocation: {
      type: Function,
      default: () => {},
    },
  },
}
</script>
