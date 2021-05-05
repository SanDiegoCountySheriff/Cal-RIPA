<template>
  <v-form ref="stepForm" lazy-validation>
    <ripa-stop-result v-model="model" :statutes="statutes"></ripa-stop-result>

    <v-spacer></v-spacer>

    <template v-if="!isValid">
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
import RipaStopResult from '@/components/molecules/RipaStopResult'
import RipaFormStepMixin from '@/components/mixins/RipaFormStepMixin'

export default {
  name: 'ripa-form-step5',

  mixins: [RipaFormStepMixin],

  components: { RipaStopResult },

  props: {
    statutes: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
