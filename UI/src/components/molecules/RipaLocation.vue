<template>
  <div class="ripa-location tw-pb-8">
    <ripa-form-header title="Location" required subtitle="§999.226(a)(3)">
    </ripa-form-header>

    <v-container>
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
          <div class="tw-mr-4">
            <ripa-number-input
              v-model="model.location.blockNumber"
              label="Block Number"
              @input="debounceInput"
            >
            </ripa-number-input>
          </div>
        </v-col>

        <v-col cols="12" sm="12" md="6">
          <div>
            <ripa-text-input
              v-model="model.location.streetName"
              label="Street Name"
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
              @input="handleInput"
            >
            </ripa-text-input>

            <ripa-subheader text="-- or --"></ripa-subheader>

            <ripa-text-input
              v-model="model.location.landmark"
              label="Road markerk, landmark, or other"
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
          <div class="tw-mr-4">
            <ripa-autocomplete
              v-model="model.location.city"
              hint="Select 1 City (required)"
              item-text="name"
              item-value="name"
              label="City"
              :items="cities"
              @input="handleInput"
            ></ripa-autocomplete>
          </div>
        </v-col>

        <v-col cols="12" sm="12" md="6">
          <div>
            <ripa-autocomplete
              v-model="model.location.beat"
              hint="Select 1 Beat (required)"
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
import RipaNumberInput from '@/components/atoms/RipaNumberInput'
import RipaSubheader from '@/components/atoms/RipaSubheader'
import RipaSwitch from '@/components/atoms/RipaSwitch'
import RipaTextInput from '@/components/atoms/RipaTextInput'
import _ from 'lodash'

export default {
  name: 'ripa-location',

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
      viewModel: {
        location: {
          isSchool: this.value?.location?.isSchool || false,
          school: this.value?.location?.school || null,
          blockNumber: this.value?.location?.blockNumber || null,
          streetName: this.value?.location?.streetName || null,
          intersection: this.value?.location?.intersection || null,
          moreLocationOptions:
            this.value?.location?.moreLocationOptions || false,
          highwayExit: this.value?.location?.highwayExit || null,
          landmark: this.value?.location?.landmark || null,
          outOfCounty: this.value?.location?.outOfCounty || false,
          city: this.value?.location?.city || null,
          beat: this.value?.location?.beat || null,
        },
      },
    }
  },

  computed: {
    model: {
      get() {
        return this.viewModel
      },
    },
  },

  methods: {
    debounceInput: _.debounce(function (e) {
      this.viewModel.location.blockNumber = Math.round(e / 100) * 100
      this.handleInput()
    }, 1000),

    handleInput() {
      this.updateBeatsModel()
      this.$emit('input', this.viewModel)
    },

    updateBeatsModel() {
      if (this.viewModel.location.outOfCounty) {
        this.viewModel.location.beat = 999
      }

      if (
        !this.viewModel.location.outOfCounty &&
        this.viewModel.location.beat === 999
      ) {
        this.viewModel.location.beat = null
      }
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
    cities: {
      type: Array,
      default: () => {},
    },
  },
}
</script>
