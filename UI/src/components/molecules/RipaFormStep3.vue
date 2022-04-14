<template>
  <v-form ref="stepForm" lazy-validation>
    <ripa-stop-reason
      v-model="model"
      :isOnlineAndAuthenticated="isOnlineAndAuthenticated"
      :last-reason="lastReason"
      :loading-pii="loadingPii"
      :statutes="getStatutes"
      :on-open-favorites="onOpenFavorites"
      :on-open-statute="onOpenStatute"
      :on-save-favorite="onSaveFavorite"
      @pii-check="handlePiiCheck"
    ></ripa-stop-reason>

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
        @click="handleStep3Next"
      >
        Next
      </v-btn>
    </div>

    <ripa-confirm-dialog
      :show-dialog="showConfirmDialog"
      title="Confirm Continue"
      subtitle="This page may contain personally identifying information. Are you sure you want to continue?"
      :on-close="handleCloseDialog"
      :on-confirm="handleConfirm"
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

  methods: {
    handleStep3Next() {
      const piiFound = this.viewModel.stopReason?.reasonForStopPiiFound || false
      if (piiFound) {
        this.showConfirmDialog = true
      } else {
        this.handleNext()
      }
    },

    handleCloseDialog() {
      this.showConfirmDialog = false
    },

    handlePiiCheck({ source, value }) {
      this.$emit('pii-check', { source, value })
    },
  },

  computed: {
    getStatutes() {
      return this.statutes
    },
  },

  props: {
    isOnlineAndAuthenticated: {
      type: Boolean,
      default: false,
    },
    lastReason: {
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
