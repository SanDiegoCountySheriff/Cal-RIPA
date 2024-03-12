<template>
  <v-form ref="stepForm" lazy-validation>
    <div
      v-if="$vuetify.breakpoint.mobile"
      class="tw-flex tw-mb-5 tw-justify-center"
    >
      <v-btn
        :disabled="isBackNextDisabled"
        outlined
        color="primary"
        class="tw-mr-2"
        @click="handleBack"
      >
        Back
      </v-btn>
      <v-btn
        :disabled="isBackNextDisabled"
        outlined
        color="error"
        class="tw-mr-2"
        @click="handleCancel"
      >
        Cancel
      </v-btn>
      <v-btn
        color="primary"
        :disabled="!isFormValid || isBackNextDisabled"
        @click="handleStep3Next"
      >
        Next
      </v-btn>
    </div>

    <ripa-stop-reason v-model="model" v-on="$listeners"></ripa-stop-reason>

    <v-spacer></v-spacer>

    <template v-if="!isFormValid">
      <ripa-alert alert-type="error">
        Oops, you may have missed something! Please review your selections
        above.
      </ripa-alert>
    </template>

    <div class="tw-flex tw-mt-8 tw-justify-center">
      <v-btn
        :disabled="isBackNextDisabled"
        outlined
        color="primary"
        class="tw-mr-2"
        @click="handleBack"
      >
        Back
      </v-btn>
      <v-btn
        :disabled="isBackNextDisabled"
        outlined
        color="error"
        class="tw-mr-2"
        @click="handleCancel"
      >
        Cancel
      </v-btn>
      <v-btn
        color="primary"
        :disabled="!isFormValid || isBackNextDisabled"
        @click="handleStep3Next"
      >
        Next
      </v-btn>
    </div>

    <ripa-confirm-dialog
      :show-dialog="showConfirmDialog"
      title="Confirm Continue"
      subtitle="This page may contain personally identifying information. Are you sure you want to continue?"
      @on-close="handleCloseDialog"
      @on-confirm="handleConfirm"
    >
    </ripa-confirm-dialog>
  </v-form>
</template>

<script>
import RipaAlert from '@/components/atoms/RipaAlert'
import RipaConfirmDialog from '@/components/atoms/RipaConfirmDialog'
import RipaStopReason from '@/components/molecules/RipaStopReason'
import RipaFormStepMixin from '@/components/mixins/RipaFormStepMixin'

export default {
  name: 'ripa-form-step3',

  mixins: [RipaFormStepMixin],

  components: { RipaAlert, RipaConfirmDialog, RipaStopReason },

  inject: ['loadingPiiStep3'],

  methods: {
    handleStep3Next() {
      const piiFound = this.model.stopReason?.reasonForStopPiiFound || false
      if (piiFound) {
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
