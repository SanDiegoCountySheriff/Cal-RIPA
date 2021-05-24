<template>
  <v-form ref="stepForm" lazy-validation>
    <ripa-officer
      v-model="model"
      toggle
      :on-open-statute="onOpenStatute"
    ></ripa-officer>
    <ripa-stop-date
      v-model="model"
      :is-edit-stop="isEditStop"
      :on-open-statute="onOpenStatute"
    ></ripa-stop-date>
    <ripa-location
      v-model="model"
      :schools="schools"
      :beats="beats"
      :county-cities="countyCities"
      :display-beat-input="displayBeatInput"
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

export default {
  name: 'ripa-form-step1',

  mixins: [RipaFormStepMixin],

  components: { RipaAlert, RipaOfficer, RipaStopDate, RipaLocation },

  methods: {
    handleStep1Next() {
      const piiFound = this.viewModel.location?.piiFound || false
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
    isEditStop: {
      type: Boolean,
      default: false,
    },
    lastLocation: {
      type: Object,
      default: () => {},
    },
    nonCountyCities: {
      type: Array,
      default: () => {},
    },
    schools: {
      type: Array,
      default: () => [],
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
  },
}
</script>
