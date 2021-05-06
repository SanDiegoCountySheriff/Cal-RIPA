<template>
  <v-form ref="stepForm" lazy-validation>
    <ripa-stop-reason
      v-model="model"
      :statutes="getStatutes"
    ></ripa-stop-reason>

    <v-spacer></v-spacer>

    <template v-if="!isFormValid">
      <v-alert type="error">
        Oops, you may have missed something! Please review your selections
        above.
      </v-alert>
    </template>

    <div class="tw-flex tw-mt-8 tw-justify-center">
      <v-btn outlined color="primary" class="tw-mr-2" @click="handleBack">
        Back
      </v-btn>
      <v-btn outlined color="error" class="tw-mr-2" @click="handleCancel">
        Cancel
      </v-btn>
      <v-btn color="primary" @click="handleNext"> Next </v-btn>
    </div>
  </v-form>
</template>

<script>
import RipaStopReason from '@/components/molecules/RipaStopReason'
import RipaFormStepMixin from '@/components/mixins/RipaFormStepMixin'

export default {
  name: 'ripa-form-step3',

  mixins: [RipaFormStepMixin],

  components: { RipaStopReason },

  computed: {
    getStatutes() {
      return this.statutes
    },
  },

  props: {
    statutes: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
