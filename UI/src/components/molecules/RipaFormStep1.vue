<template>
  <v-form ref="stepForm" lazy-validation>
    <template v-if="isAdminEditing">
      <ripa-officer
        v-on="$listeners"
        :user="getApiStopUser"
        :on-update-user="handleUpdateStopUser"
      ></ripa-officer>

      <ripa-user-dialog
        admin-editing
        :is-invalid-user="false"
        :user="getApiStopUser"
        :show-dialog="showUserDialog"
        :on-close="handleCloseDialog"
        :on-save="handleSaveUser"
      ></ripa-user-dialog>
    </template>

    <template v-if="!isAdminEditing && isOnlineAndAuthenticated">
      <ripa-officer
        v-on="$listeners"
        :on-update-user="onUpdateUser"
      ></ripa-officer>
    </template>

    <ripa-stop-date v-model="model" v-on="$listeners"></ripa-stop-date>

    <ripa-location
      v-model="model"
      v-on="$listeners"
      @pii-check="handlePiiCheck"
    ></ripa-location>

    <v-spacer></v-spacer>

    <template v-if="!isFormValid">
      <ripa-alert alert-type="error">
        Oops, you may have missed something! Please review your selections
        above.
      </ripa-alert>
    </template>

    <div class="tw-flex tw-mt-8 tw-justify-center">
      <v-btn outlined color="error" class="tw-mr-2" @click="handleCancel">
        Cancel
      </v-btn>
      <v-btn
        color="primary"
        :disabled="isBackNextDisabled"
        @click="handleStep1Next"
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
import RipaOfficer from '@/components/molecules/RipaOfficer'
import RipaStopDate from '@/components/molecules/RipaStopDate'
import RipaLocation from '@/components/molecules/RipaLocation'
import RipaFormStepMixin from '@/components/mixins/RipaFormStepMixin'
import RipaUserDialog from '@/components/molecules/RipaUserDialog'
import { getOfficerAssignment } from '@/utilities/stop'

export default {
  name: 'ripa-form-step1',

  mixins: [RipaFormStepMixin],

  components: {
    RipaAlert,
    RipaConfirmDialog,
    RipaOfficer,
    RipaStopDate,
    RipaLocation,
    RipaUserDialog,
  },

  data() {
    return {
      showUserDialog: false,
    }
  },

  inject: ['isAdminEditing', 'isOnlineAndAuthenticated'],

  computed: {
    getApiStopUser() {
      const submittedApiStop = localStorage.getItem(
        'ripa_form_submitted_api_stop',
      )
      const parsedApiStop = submittedApiStop
        ? JSON.parse(submittedApiStop)
        : null

      if (parsedApiStop) {
        return {
          assignment: Number(parsedApiStop.officerAssignment.key),
          otherType: parsedApiStop.officerAssignment.otherType,
          yearsExperience: Number(parsedApiStop.expYears),
        }
      }

      return null
    },
  },

  methods: {
    handleStep1Next() {
      const piiFound = this.viewModel.location?.piiFound || false
      if (piiFound) {
        this.showConfirmDialog = true
      } else {
        this.handleNext()
      }
    },

    handleUpdateStopUser() {
      this.showUserDialog = true
    },

    handleCloseDialog() {
      this.showUserDialog = false
      this.showConfirmDialog = false
    },

    handleSaveUser(user) {
      // get submitted api stop
      const submittedApiStop = localStorage.getItem(
        'ripa_form_submitted_api_stop',
      )
      const parsedApiStop = submittedApiStop
        ? JSON.parse(submittedApiStop)
        : null

      // update assignment and assign parsed api stop
      const assignment = getOfficerAssignment(user.assignment)
      parsedApiStop.officerAssignment = {
        key: assignment.code.toString(),
        otherType: user.otherType || '',
        type: assignment.text,
      }
      parsedApiStop.expYears = user.yearsExperience

      // update submitted api stop
      localStorage.setItem(
        'ripa_form_submitted_api_stop',
        JSON.stringify(parsedApiStop),
      )
    },

    handlePiiCheck({ source, value }) {
      this.$emit('pii-check', { source, value })
    },
  },

  props: {
    onUpdateUser: {
      type: Function,
      required: true,
    },
  },
}
</script>
