<template>
  <v-form ref="stepForm" lazy-validation>
    <ripa-force-actions-taken
      v-model="model"
      :on-open-statute="onOpenStatute"
    ></ripa-force-actions-taken>

    <v-spacer> </v-spacer>

    <template v-if="!isFormValid">
      <ripa-alert alert-type="error">
        Oops, you may have missed something! Please review your selections
        above.
      </ripa-alert>
    </template>

    <div class="tw-flex tw-mt-8 tw-justify-center">
      <v-btn
        outlined
        color="primary"
        class="tw-mr-2"
        :disabled="isBackNextDisabled"
        @click="handleBack"
      >
        Back
      </v-btn>
      <v-btn outlined color="error" class="tw-mr-2" @click="handleCancel">
        Cancel
      </v-btn>
      <v-btn
        color="primary"
        :disabled="isBackNextDisabled"
        @click="handleStep5Next"
      >
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
  name: 'ripa-form-step5',

  mixins: [RipaFormStepMixin],

  components: {
    RipaAlert,
    RipaForceActionsTaken,
  },

  methods: {
    handleStep5Next() {
      this.handleNext()
    },

    handleCloseDialog() {
      this.showConfirmDialog = false
    },
  },
}
</script>
