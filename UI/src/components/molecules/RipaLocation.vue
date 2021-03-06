<template>
  <div class="ripa-location tw-pb-8">
    <ripa-form-header title="Location" required subtitle="§999.226(a)(3)">
    </ripa-form-header>

    <v-container>
      <v-row no-gutters>
        <div class="tw-flex tw-w-full tw-mt-4 tw-justify-center">
          <v-btn
            class="tw-mr-2"
            outlined
            small
            :loading="isGeoLocationLoading"
            @click="handleCurrentLocation"
          >
            Current Location
          </v-btn>
          <v-btn
            class="tw-mr-2"
            outlined
            small
            :disabled="!validLastLocation"
            @click="handleLastLocation"
            >Last Location
          </v-btn>
          <v-btn class="tw-mr-2" outlined small @click="handleOpenFavorites">
            Open Favorites
          </v-btn>
          <v-btn outlined small @click="handleSaveFavorite"
            >Save Location</v-btn
          >
        </div>
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

          <v-alert class="tw-mt-8" dense outlined type="info">
            Note: Do not provide a street address if the location is a
            residence.
          </v-alert>
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col cols="12" sm="12" md="6">
          <div class="md:tw-mr-4">
            <ripa-number-input
              v-model="model.location.blockNumber"
              label="Block Number"
              round-down
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
            :rules="intersectionRules"
            @input="handleInput"
          >
          </ripa-text-input>

          <ripa-switch
            v-model="model.location.moreLocationOptions"
            label="More Location Options"
            :max-width="225"
            @input="handleInput"
          ></ripa-switch>

          <template v-if="model.location.moreLocationOptions">
            <ripa-subheader text="-- or --"></ripa-subheader>

            <ripa-text-input
              v-model="model.location.highwayExit"
              label="Highway and closet exit"
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
      </v-row>
    </v-container>
  </div>
</template>

<script>
import RipaAutocomplete from '@/components/atoms/RipaAutocomplete'
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaFormMixin from '@/components/mixins/RipaFormMixin'
import RipaNumberInput from '@/components/atoms/RipaNumberInput'
import RipaSubheader from '@/components/atoms/RipaSubheader'
import RipaSwitch from '@/components/atoms/RipaSwitch'
import RipaTextInput from '@/components/atoms/RipaTextInput'

export default {
  name: 'ripa-location',

  mixins: [RipaFormMixin],

  components: {
    RipaAutocomplete,
    RipaFormHeader,
    RipaNumberInput,
    RipaSubheader,
    RipaSwitch,
    RipaTextInput,
  },

  data() {
    return {
      isGeoLocationLoading: false,
      viewModel: this.loadModel(this.value),
    }
  },

  computed: {
    model: {
      get() {
        return this.viewModel
      },
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
      const checked = this.viewModel.location.moreLocationOptions
      const highwayExit = this.viewModel.location.highwayExit
      return [
        this.isLocationOptionsFilled ||
          (checked && highwayExit && highwayExit.length > 0) ||
          'A highway and closet exit is required',
      ]
    },

    landmarkRules() {
      const checked = this.viewModel.location.moreLocationOptions
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
      const checked = this.viewModel.location.moreLocationOptions
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
        this.isGeoLocationLoading = true
        navigator.geolocation.getCurrentPosition(position => {
          const positionInfo =
            'Your current position is (' +
            'Latitude: ' +
            position.coords.latitude +
            ', ' +
            'Longitude: ' +
            position.coords.longitude +
            ')'
          console.log(positionInfo)
          this.isGeoLocationLoading = false
          // https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?location=-117.1328002,32.834727&f=json
        })
      } else {
        console.log('Geolocation is not supported by this browser.')
      }
    },

    handleInput() {
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

    updateBlockNumberModel() {
      this.$nextTick(() => {
        let blockNumber = this.viewModel.location.blockNumber
        blockNumber = Math.floor(blockNumber / 100) * 100
        this.viewModel.location.blockNumber = blockNumber
      })
    },

    updateOutOfCountyModel() {
      this.$nextTick(() => {
        if (this.viewModel.location.outOfCounty) {
          this.viewModel.location.beat = 999
          this.viewModel.location.city = null
        }

        if (
          !this.viewModel.location.outOfCounty &&
          this.viewModel.location.beat === 999
        ) {
          this.viewModel.location.beat = null
          this.viewModel.location.city = null
        }
      })
    },
  },

  watch: {
    value(newVal) {
      this.viewModel = this.loadModel(newVal)
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
      default: () => {},
    },
    beats: {
      type: Array,
      default: () => {},
    },
    countyCities: {
      type: Array,
      default: () => {},
    },
    lastLocation: {
      type: Object,
      default: () => {},
    },
    nonCountyCities: {
      type: Array,
      default: () => {},
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
  },
}
</script>
