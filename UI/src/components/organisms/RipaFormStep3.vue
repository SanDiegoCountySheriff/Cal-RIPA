<template>
  <v-form ref="stepForm" lazy-validation>
    <ripa-stop-reason
      v-model="model"
      :offense-codes="offenseCodes"
    ></ripa-stop-reason>

    <v-spacer></v-spacer>

    <template v-if="!isValid">
      <v-alert type="error">
        Oops, you may have missed something! Please review your selections
        above.
      </v-alert>
    </template>

    <div class="tw-flex tw-mt-8 tw-justify-center">
      <v-btn outlined color="primary" class="tw-mr-4" @click="handleBack">
        Back
      </v-btn>
      <v-btn outlined color="error" class="tw-mr-4" @click="handleCancel">
        Cancel
      </v-btn>
      <v-btn color="primary" class="tw-mr-4" @click="handleNext"> Next </v-btn>
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

  props: {
    offenseCodes: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
