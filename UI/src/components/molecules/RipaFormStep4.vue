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
        @click="handleStep4Next"
      >
        Next
      </v-btn>
    </div>

    <template v-if="model.stopVersion === 1">
      <ripa-actions-taken
        v-model="model"
        v-on="$listeners"
      ></ripa-actions-taken>
    </template>

    <template v-else>
      <ripa-non-force-actions-taken
        v-model="model"
        v-on="$listeners"
      ></ripa-non-force-actions-taken>
    </template>

    <ripa-contraband v-model="model" v-on="$listeners"></ripa-contraband>

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
        @click="handleStep4Next"
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
import RipaActionsTaken from '@/components/molecules/RipaActionsTaken'
import RipaNonForceActionsTaken from '@/components/molecules/RipaNonForceActionsTaken'
import RipaAlert from '@/components/atoms/RipaAlert'
import RipaConfirmDialog from '@/components/atoms/RipaConfirmDialog'
import RipaContraband from '@/components/molecules/RipaContraband'
import RipaFormStepMixin from '@/components/mixins/RipaFormStepMixin'

export default {
  name: 'ripa-form-step4',

  mixins: [RipaFormStepMixin],

  components: {
    RipaActionsTaken,
    RipaNonForceActionsTaken,
    RipaAlert,
    RipaConfirmDialog,
    RipaContraband,
  },

  inject: ['loadingPiiStep4'],

  methods: {
    handleStep4Next() {
      const piiFound =
        this.model.actionsTaken?.basisForSearchPiiFound ||
        this.model.nonForceActionsTaken?.basisForSearchPiiFound ||
        false
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
