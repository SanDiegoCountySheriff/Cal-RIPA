<template>
  <v-form ref="stepForm" lazy-validation>
    <template v-if="adminEditing">
      <ripa-officer
        :user="getApiStopUser"
        :on-open-statute="onOpenStatute"
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

    <template v-if="!adminEditing && isOnlineAndAuthenticated">
      <ripa-officer
        :user="user"
        :on-open-statute="onOpenStatute"
        :on-update-user="onUpdateUser"
      ></ripa-officer>
    </template>

    <ripa-stop-date
      v-model="model"
      :admin-editing="adminEditing"
      :on-open-statute="onOpenStatute"
    ></ripa-stop-date>

    <ripa-location
      v-model="model"
      :schools="schools"
      :beats="beats"
      :county-cities="countyCities"
      :display-beat-input="displayBeatInput"
      :isOnlineAndAuthenticated="isOnlineAndAuthenticated"
      :last-location="lastLocation"
      :loading-gps="loadingGps"
      :loading-pii="loadingPii"
      :non-county-cities="nonCountyCities"
      :valid-last-location="validLastLocation"
      :on-open-favorites="onOpenFavorites"
      :on-open-last-location="onOpenLastLocation"
      :on-open-statute="onOpenStatute"
      :on-save-favorite="onSaveFavorite"
      :on-gps-location="onGpsLocation"
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
  </v-form>
</template>

<script>
import RipaAlert from '@/components/atoms/RipaAlert'
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
        this.$confirm({
          title: 'Confirm Continue',
          message: `This page may contain personally identifying information. Are you sure you want to continue?`,
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

    handleUpdateStopUser() {
      this.showUserDialog = true
    },

    handleCloseDialog() {
      this.showUserDialog = false
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
  },

  props: {
    beats: {
      type: Array,
      default: () => [],
    },
    countyCities: {
      type: Array,
      default: () => [],
    },
    displayBeatInput: {
      type: Boolean,
      default: false,
    },
    isOnlineAndAuthenticated: {
      type: Boolean,
      default: false,
    },
    adminEditing: {
      type: Boolean,
      default: false,
    },
    lastLocation: {
      type: Object,
      default: () => {},
    },
    nonCountyCities: {
      type: Array,
      default: () => [],
    },
    schools: {
      type: Array,
      default: () => [],
    },
    user: {
      type: Object,
      default: () => {},
    },
    validLastLocation: {
      type: Boolean,
      default: false,
    },
    onOpenFavorites: {
      type: Function,
      default: () => {},
    },
    onOpenLastLocation: {
      type: Function,
      default: () => {},
    },
    onSaveFavorite: {
      type: Function,
      default: () => {},
    },
    onGpsLocation: {
      type: Function,
      default: () => {},
    },
    onUpdateUser: {
      type: Function,
      default: () => {},
    },
  },
}
</script>
