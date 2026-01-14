<template>
  <v-form ref="stepForm" lazy-validation>
    <div
      v-if="$vuetify.breakpoint.mobile"
      class="tw-flex tw-mb-4 tw-justify-center"
    >
      <v-btn outlined color="primary" class="tw-mr-2" @click="handleBack">
        Back
      </v-btn>
      <v-btn outlined color="error" class="tw-mr-2" @click="handleCancel">
        Cancel
      </v-btn>
      <v-btn color="primary" :disabled="!isFormValid" @click="handleStep5Next">
        Next
      </v-btn>
    </div>
    <ripa-stop-result v-model="model" v-on="$listeners"></ripa-stop-result>

    <v-spacer></v-spacer>

    <template v-if="!isFormValid">
      <ripa-alert alert-type="error">
        Oops, you may have missed something! Please review your selections
        above.
      </ripa-alert>
    </template>

    <div class="tw-flex tw-mt-8 tw-justify-center">
      <v-btn outlined color="primary" class="tw-mr-2" @click="handleBack">
        Back
      </v-btn>
      <v-btn outlined color="error" class="tw-mr-2" @click="handleCancel">
        Cancel
      </v-btn>
      <v-btn color="primary" :disabled="!isFormValid" @click="handleStep5Next">
        Next
      </v-btn>
    </div>

    <ripa-confirm-dialog
      :show-dialog="showConfirmDialog"
      @on-close="handleCloseDialog"
      @on-confirm="handleConfirm"
      title="Confirm Continue"
      subtitle="This stop does not have any actions taken as a result of the stop. Are you sure you want to continue?"
    >
    </ripa-confirm-dialog>
  </v-form>
</template>

<script>
import RipaAlert from '@/components/atoms/RipaAlert'
import RipaConfirmDialog from '@/components/atoms/RipaConfirmDialog'
import RipaFormStepMixin from '@/components/mixins/RipaFormStepMixin'
import RipaStopResult from '@/components/molecules/RipaStopResult'

export default {
  name: 'ripa-form-step5',

  mixins: [RipaFormStepMixin],

  components: {
    RipaAlert,
    RipaConfirmDialog,
    RipaStopResult,
  },

  methods: {
    handleStep5Next() {
      const anyResultsOfStop = this.model.stopResult?.anyResultsOfStop || false
      if (!anyResultsOfStop) {
        this.showConfirmDialog = true
      } else {
        this.handleNext()
      }
    },

    handleCloseDialog() {
      this.showConfirmDialog = false
    },
  },
}
</script>
