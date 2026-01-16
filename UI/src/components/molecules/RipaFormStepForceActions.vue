<template>
  <v-form ref="stepForm" lazy-validation>
    <div
      v-if="$vuetify.breakpoint.mobile"
      class="tw-flex tw-mb-4 tw-justify-center"
    >
      <template v-if="backButtonVisible">
        <v-btn outlined color="primary" class="tw-mr-2" @click="handleBack">
          Back
        </v-btn>
      </template>
      <v-btn outlined color="error" class="tw-mr-2" @click="handleCancel">
        Cancel
      </v-btn>
      <v-btn color="primary" :disabled="!isFormValid" @click="handleNext">
        Next
      </v-btn>
    </div>
    <ripa-force-actions-taken
      v-model="model"
      v-on="$listeners"
    ></ripa-force-actions-taken>

    <v-spacer></v-spacer>

    <template v-if="!isFormValid">
      <ripa-alert alert-type="error">
        Oops, you may have missed something! Please review your selections
        above.
      </ripa-alert>
    </template>

    <div class="tw-flex tw-mt-8 tw-justify-center">
      <template v-if="backButtonVisible">
        <v-btn outlined color="primary" class="tw-mr-2" @click="handleBack">
          Back
        </v-btn>
      </template>
      <v-btn outlined color="error" class="tw-mr-2" @click="handleCancel">
        Cancel
      </v-btn>
      <v-btn color="primary" :disabled="!isFormValid" @click="handleNext">
        Next
      </v-btn>
    </div>
  </v-form>
</template>

<script>
import RipaAlert from '@/components/atoms/RipaAlert'
import RipaFormStepMixin from '@/components/mixins/RipaFormStepMixin'
import RipaForceActionsTaken from '@/components/molecules/RipaForceActionsTaken'

export default {
  name: 'ripa-form-step-force-actions',

  components: {
    RipaAlert,
    RipaForceActionsTaken,
  },

  mixins: [RipaFormStepMixin],

  props: {
    backButtonVisible: {
      type: Boolean,
      default: true,
    },
  },
}
</script>
