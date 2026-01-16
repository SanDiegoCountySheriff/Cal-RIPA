<template>
  <v-form ref="stepForm" lazy-validation>
    <div
      v-if="$vuetify.breakpoint.mobile"
      class="tw-flex tw-mb-4 tw-justify-center"
    >
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
        @click="handleStep1Next"
      >
        Next
      </v-btn>
    </div>

    <template v-if="isAdminEditing">
      <ripa-officer v-on="$listeners"></ripa-officer>

      <template v-if="model.stopVersion === 2">
        <ripa-stop-type v-model="model" v-on="$listeners"></ripa-stop-type>
      </template>
    </template>

    <template v-if="!isAdminEditing && isOnlineAndAuthenticated">
      <ripa-officer v-on="$listeners"></ripa-officer>
    </template>

    <ripa-stop-date v-model="model" v-on="$listeners"></ripa-stop-date>

    <template v-if="model.stopVersion === 2">
      <ripa-stop-type v-model="model" v-on="$listeners"></ripa-stop-type>
    </template>

    <ripa-location v-model="model" v-on="$listeners"></ripa-location>

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
        color="error"
        class="tw-mr-2"
        @click="handleCancel"
      >
        Cancel
      </v-btn>
      <v-btn
        color="primary"
        :disabled="!isFormValid || isBackNextDisabled"
        @click="handleStep1Next"
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
import RipaOfficer from '@/components/molecules/RipaOfficer'
import RipaStopDate from '@/components/molecules/RipaStopDate'
import RipaLocation from '@/components/molecules/RipaLocation'
import RipaFormStepMixin from '@/components/mixins/RipaFormStepMixin'
import RipaStopType from '@/components/molecules/RipaStopType'

export default {
  name: 'ripa-form-step1',

  mixins: [RipaFormStepMixin],

  components: {
    RipaAlert,
    RipaConfirmDialog,
    RipaOfficer,
    RipaStopDate,
    RipaLocation,
    RipaStopType,
  },

  data() {
    return {
      showUserDialog: false,
    }
  },

  inject: ['isAdminEditing', 'isOnlineAndAuthenticated', 'loadingPiiStep1'],

  methods: {
    handleStep1Next() {
      const piiFound = this.model.location?.piiFound || false
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
