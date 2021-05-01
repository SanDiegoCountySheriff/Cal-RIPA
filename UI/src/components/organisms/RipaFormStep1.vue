<template>
  <v-form ref="stepForm" lazy-validation>
    <ripa-officer
      v-model="model.officer"
      @input="handleInput"
      toggle
    ></ripa-officer>
    <ripa-stop-date
      v-model="model.stopDetails"
      @input="handleInput"
    ></ripa-stop-date>
    <ripa-location
      v-model="model.location"
      :schools="schools"
      :beats="beats"
      :cities="cities"
      @input="handleInput"
    ></ripa-location>

    <v-spacer></v-spacer>

    <template v-if="!isValid">
      <v-alert type="error">
        Oops, you may have missed something! Please review your selections
        above.
      </v-alert>
    </template>

    <div class="tw-flex tw-mt-8 tw-justify-center">
      <v-btn outlined color="error" class="tw-mr-4" @click="handleCancel">
        Cancel
      </v-btn>
      <v-btn color="primary" class="tw-mr-4" @click="handleNext"> Next </v-btn>
    </div>
  </v-form>
</template>

<script>
import RipaOfficer from '@/components/molecules/RipaOfficer'
import RipaStopDate from '@/components/molecules/RipaStopDate'
import RipaLocation from '@/components/molecules/RipaLocation'
import RipaFormStepMixin from '@/components/mixins/RipaFormStepMixin'

export default {
  name: 'ripa-form-step1',

  mixins: [RipaFormStepMixin],

  components: { RipaOfficer, RipaStopDate, RipaLocation },

  data() {
    return {
      isValid: true,
      viewModel: {
        officer: this.value?.officer || null,
        stopDetails: this.value?.stopDetails || null,
        location: this.value?.location || null,
      },
    }
  },
}
</script>
