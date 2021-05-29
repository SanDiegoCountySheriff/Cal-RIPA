<template>
  <v-form ref="stepForm" lazy-validation>
    <ripa-stop-result
      v-model="model"
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
import RipaStopResult from '@/components/molecules/RipaStopResult'

export default {
  name: 'ripa-form-step5',

  mixins: [RipaFormStepMixin],

  components: {
    RipaAlert,
    RipaStopResult,
  },

  methods: {
    handleStep5Next() {
      const anyActionsTaken =
        this.viewModel.stopResult?.anyActionsTaken || false
      if (!anyActionsTaken) {
        this.$confirm({
          title: 'Confirm Cancel',
          message: `This stop does not have any actions taken as a result of the stop. Are you sure you want to continue?`,
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
