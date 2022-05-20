<template>
  <v-form ref="stepForm" lazy-validation>
    <ripa-stop-result
      v-model="model"
      :isOnlineAndAuthenticated="isOnlineAndAuthenticated"
      :last-result="lastResult"
      :statutes="statutes"
      :on-open-favorites="onOpenFavorites"
      :on-open-statute="onOpenStatute"
      :on-save-favorite="onSaveFavorite"
    ></ripa-stop-result>

    <v-spacer></v-spacer>

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
        @click="handleStep6Next"
      >
        Next
      </v-btn>
    </div>

    <ripa-confirm-dialog
      :show-dialog="showConfirmDialog"
      title="Confirm Continue"
      subtitle="This stop does not have any actions taken as a result of the stop. Are you sure you want to continue?"
      :on-close="handleCloseDialog"
      :on-confirm="handleConfirm"
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
  name: 'ripa-form-step6',

  mixins: [RipaFormStepMixin],

  components: {
    RipaAlert,
    RipaConfirmDialog,
    RipaStopResult,
  },

  methods: {
    handleStep6Next() {
      const anyResultsOfStop =
        this.viewModel.stopResult?.anyResultsOfStop || false
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

  props: {
    isOnlineAndAuthenticated: {
      type: Boolean,
      default: false,
    },
    lastResult: {
      type: Object,
      default: () => {},
    },
    onOpenFavorites: {
      type: Function,
      required: true,
    },
    onSaveFavorite: {
      type: Function,
      required: true,
    },
  },
}
</script>
