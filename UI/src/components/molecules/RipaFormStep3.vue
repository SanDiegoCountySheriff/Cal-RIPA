<template>
  <v-form ref="stepForm" lazy-validation>
    <ripa-stop-reason
      v-model="model"
      :loading-pii="loadingPii"
      :statutes="getStatutes"
      :on-open-favorites="onOpenFavorites"
      :on-open-statute="onOpenStatute"
      :on-save-favorite="onSaveFavorite"
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
  </v-form>
</template>

<script>
import RipaAlert from '@/components/atoms/RipaAlert'
import RipaStopReason from '@/components/molecules/RipaStopReason'
import RipaFormStepMixin from '@/components/mixins/RipaFormStepMixin'

export default {
  name: 'ripa-form-step3',

  mixins: [RipaFormStepMixin],

  components: { RipaAlert, RipaStopReason },

  methods: {
    handleStep3Next() {
      const piiFound = this.viewModel.stopReason?.reasonForStopPiiFound || false
      if (piiFound) {
        this.$confirm({
          title: 'Confirm Cancel',
          message: `This page contains personally identifying information. Are you sure you want to continue?`,
          button: {
            no: 'No',
            yes: 'Yes',
          },
          callback: confirm => {
            if (confirm) {
              this.handleNext()
            }
          },
        })
      } else {
        this.handleNext()
      }
    },
  },

  computed: {
    getStatutes() {
      return this.statutes
    },
  },

  props: {
    onOpenFavorites: {
      type: Function,
      default: () => {},
    },
    onSaveFavorite: {
      type: Function,
      default: () => {},
    },
  },
}
</script>
