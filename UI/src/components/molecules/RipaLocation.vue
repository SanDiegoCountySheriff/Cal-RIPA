<template>
  <div class="ripa-location tw-p-4">
    <ripa-form-header title="Location" required subtitle="§999.226(a)(3)">
    </ripa-form-header>

    <ripa-switch
      v-model="model.isSchool"
      label="K-12 Public School"
      :max-width="200"
      @input="handleInput"
    ></ripa-switch>

    <template v-if="model.isSchool">
      <ripa-autocomplete
        v-model="model.school"
        hint="Select 1 School (required)"
        item-text="fullName"
        item-value="cdsCode"
        label="School"
        :items="schools"
        @input="handleInput"
      ></ripa-autocomplete>
    </template>

    <ripa-number-input
      v-model="model.blockNumber"
      label="Block Number"
      @input="debounceInput"
    >
    </ripa-number-input>

    <ripa-text-input
      v-model="model.streetName"
      label="Street Name"
      @input="handleInput"
    >
    </ripa-text-input>

    <ripa-label class="tw-mt-4 tw-mb-6" value="-- or --" bold></ripa-label>

    <ripa-text-input
      v-model="model.intersection"
      label="Closest Intersection"
      @input="handleInput"
    >
    </ripa-text-input>

    <ripa-switch
      v-model="model.moreLocationOptions"
      label="More Location Options"
      :max-width="225"
      @input="handleInput"
    ></ripa-switch>

    <template v-if="model.moreLocationOptions">
      <ripa-label class="tw-mt-4 tw-mb-6" value="-- or --" bold></ripa-label>

      <ripa-text-input
        v-model="model.highwayExit"
        label="Highway and closet exit"
        @input="handleInput"
      >
      </ripa-text-input>

      <ripa-label class="tw-mt-4 tw-mb-6" value="-- or --" bold></ripa-label>

      <ripa-text-input
        v-model="model.landmark"
        label="Road markerk, landmark, or other"
        @input="handleInput"
      >
      </ripa-text-input>
    </template>

    <ripa-label
      class="tw-mt-4 tw-mb-6"
      value="Note: Do not provide a street address if the location is a residence."
    ></ripa-label>

    <ripa-switch
      v-model="model.outOfCounty"
      label="City Out of County?"
      :max-width="200"
      @input="handleInput"
    ></ripa-switch>

    <ripa-autocomplete
      v-model="model.city"
      hint="Select 1 City (required)"
      item-text="name"
      item-value="name"
      label="City"
      :items="cities"
      @input="handleInput"
    ></ripa-autocomplete>

    <ripa-autocomplete
      v-model="model.beat"
      hint="Select 1 Beat (required)"
      item-text="fullName"
      item-value="id"
      label="Beat"
      :items="beats"
      :disabled="model.outOfCounty"
      @input="handleInput"
    ></ripa-autocomplete>
  </div>
</template>

<script>
import RipaAutocomplete from '@/components/atoms/RipaAutocomplete'
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaLabel from '@/components/atoms/RipaLabel'
import RipaNumberInput from '@/components/atoms/RipaNumberInput'
import RipaSwitch from '@/components/atoms/RipaSwitch'
import RipaTextInput from '@/components/atoms/RipaTextInput'
import _ from 'lodash'

export default {
  name: 'ripa-location',

  components: {
    RipaAutocomplete,
    RipaFormHeader,
    RipaLabel,
    RipaNumberInput,
    RipaSwitch,
    RipaTextInput,
  },

  data() {
    return {
      viewModel: {
        isSchool: this.value?.isSchool || false,
        school: this.value?.school || null,
        blockNumber: this.value?.blockNumber || null,
        streetName: this.value?.streetName || null,
        intersection: this.value?.intersection || null,
        moreLocationOptions: this.value?.moreLocationOptions || false,
        highwayExit: this.value?.highwayExit || null,
        landmark: this.value?.landmark || null,
        outOfCounty: this.value?.outOfCounty || false,
        city: this.value?.city || null,
        beat: this.value?.beat || null,
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
      this.viewModel.blockNumber = Math.round(e / 100) * 100
    }, 1000),

    handleInput() {
      this.updateBlockNumber()
      this.updateBeatsModel()
      this.$emit('input', this.viewModel)
    },

    updateBlockNumber() {
      if (this.viewModel.blockNumber) {
      }
    },

    updateBeatsModel() {
      if (this.viewModel.outOfCounty) {
        this.viewModel.beat = 999
      }

      if (!this.viewModel.outOfCounty && this.viewModel.beat === 999) {
        this.viewModel.beat = null
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
