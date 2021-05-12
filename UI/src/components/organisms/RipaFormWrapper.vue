<template>
  <v-card class="mx-auto" max-width="900" outlined>
    {{ stop }}
    <v-card-text>
      <template v-if="stepIndex <= 6">
        <v-stepper v-model="stepIndex">
          <v-stepper-header>
            <v-stepper-step
              :rules="[() => step1Validated]"
              :complete="stepIndex > 1"
              step="1"
            >
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step
              :rules="[() => step2Validated]"
              :complete="stepIndex > 2"
              step="2"
            >
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step
              :rules="[() => step3Validated]"
              :complete="stepIndex > 3"
              step="3"
            >
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step
              :rules="[() => step4Validated]"
              :complete="stepIndex > 4"
              step="4"
            >
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step
              :rules="[() => step5Validated]"
              :complete="stepIndex > 5"
              step="5"
            >
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="6"></v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="1">
              <ripa-form-step-1
                v-model="stop"
                :on-next="handleNext"
                :on-cancel="handleCancel"
                :beats="beats"
                :county-cities="countyCities"
                :last-location="lastLocation"
                :non-county-cities="nonCountyCities"
                :schools="schools"
                :valid-last-location="validLastLocation"
                :on-open-favorites="onOpenFavorites"
                :on-open-last-location="onOpenLastLocation"
                :on-save-favorite="onSaveFavorite"
                @input="handleInput"
              ></ripa-form-step-1>
            </v-stepper-content>

            <v-stepper-content step="2">
              <ripa-subheader
                :text="getEditPersonText"
                no-margins
              ></ripa-subheader>

              <ripa-form-step-2
                v-model="stop"
                :on-back="handleBack"
                :on-next="handleNext"
                :on-cancel="handleCancel"
                :back-button-visible="getFormStep2BackButtonVisible"
                @input="handleInput"
              ></ripa-form-step-2>
            </v-stepper-content>

            <v-stepper-content step="3">
              <ripa-subheader
                :text="getEditPersonText"
                no-margins
              ></ripa-subheader>

              <ripa-form-step-3
                v-model="stop"
                :loading-pii="loadingPii"
                :on-back="handleBack"
                :on-next="handleNext"
                :on-cancel="handleCancel"
                :statutes="statutes"
                @input="handleInput"
              ></ripa-form-step-3>
            </v-stepper-content>

            <v-stepper-content step="4">
              <ripa-subheader
                :text="getEditPersonText"
                no-margins
              ></ripa-subheader>

              <ripa-form-step-4
                v-model="stop"
                :loading-pii="loadingPii"
                :on-back="handleBack"
                :on-next="handleNext"
                :on-cancel="handleCancel"
                :statutes="statutes"
                @input="handleInput"
              ></ripa-form-step-4>
            </v-stepper-content>

            <v-stepper-content step="5">
              <ripa-subheader
                :text="getEditPersonText"
                no-margins
              ></ripa-subheader>

              <ripa-form-step-5
                v-model="stop"
                :on-back="handleBack"
                :on-next="handleNext"
                :on-cancel="handleCancel"
                :statutes="statutes"
                @input="handleInput"
              ></ripa-form-step-5>
            </v-stepper-content>

            <v-stepper-content step="6">
              <ripa-form-step-6
                v-model="stop"
                :api-stop="getApiStop"
                :on-add-person="handleAddPerson"
                :on-back="handleBack"
                :on-delete-person="handleDeletePerson"
                :on-edit-person="handleEditPerson"
                :on-edit-stop="handleEditStop"
                :on-submit="handleSubmit"
                :on-cancel="handleCancel"
                @input="handleInput"
              ></ripa-form-step-6>
            </v-stepper-content>
          </v-stepper-items>

          <v-stepper-header>
            <v-stepper-step
              :rules="[() => step1Validated]"
              :complete="stepIndex > 1"
              step="1"
            >
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step
              :rules="[() => step2Validated]"
              :complete="stepIndex > 2"
              step="2"
            >
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step
              :rules="[() => step3Validated]"
              :complete="stepIndex > 3"
              step="3"
            >
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step
              :rules="[() => step4Validated]"
              :complete="stepIndex > 4"
              step="4"
            >
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step
              :rules="[() => step5Validated]"
              :complete="stepIndex > 5"
              step="5"
            >
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="6"></v-stepper-step>
          </v-stepper-header>
        </v-stepper>
      </template>
      <template v-if="stepIndex === confirmationStepIndex">
        <ripa-confirmation :on-start-new="handleStartNew"></ripa-confirmation>
      </template>
    </v-card-text>
  </v-card>
</template>

<script>
import RipaConfirmation from '@/components/molecules/RipaConfirmation'
import RipaFormStep1 from '@/components/molecules/RipaFormStep1'
import RipaFormStep2 from '@/components/molecules/RipaFormStep2'
import RipaFormStep3 from '@/components/molecules/RipaFormStep3'
import RipaFormStep4 from '@/components/molecules/RipaFormStep4'
import RipaFormStep5 from '@/components/molecules/RipaFormStep5'
import RipaFormStep6 from '@/components/molecules/RipaFormStep6'
import RipaSubheader from '@/components/atoms/RipaSubheader'
import { apiStop } from '@/utilities/stop'

export default {
  name: 'ripa-form-wrapper',

  components: {
    RipaConfirmation,
    RipaFormStep1,
    RipaFormStep2,
    RipaFormStep3,
    RipaFormStep4,
    RipaFormStep5,
    RipaFormStep6,
    RipaSubheader,
  },

  data() {
    return {
      stepIndex: 1,
      step1Validated: true,
      step2Validated: true,
      step3Validated: true,
      step4Validated: true,
      step5Validated: true,
      confirmationStepIndex: 7,
      stop: this.value,
      isEditStop: true,
      isEditPerson: true,
    }
  },

  computed: {
    getEditPersonText() {
      return `Person: ${this.stop.person.id}`
    },

    getFormStep2BackButtonVisible() {
      return this.isEditPerson && this.isEditStop
    },

    getApiStop() {
      return apiStop(
        this.fullStop,
        this.beats,
        this.countyCities,
        this.nonCountyCities,
        this.schools,
        this.statutes,
      )
    },
  },

  methods: {
    handleInput(newVal) {
      this.stop = Object.assign({}, newVal)
      this.$emit('input', this.stop)
    },

    handleAddPerson() {
      this.stepIndex = 2
      if (this.onAddPerson) {
        this.onAddPerson()
      }
      this.isEditStop = false
      this.isEditPerson = true
    },

    handleBack() {
      this.stepIndex = this.stepIndex - 1
      window.scrollTo(0, 0)
    },

    handleCancel() {
      this.$confirm({
        title: 'Confirm Cancel',
        message: `Are you sure you want to cancel the form? You will lose all changes.`,
        button: {
          no: 'No',
          yes: 'Cancel',
        },
        callback: confirm => {
          if (confirm) {
            this.stepIndex = 1
            this.isEditStop = true
            this.isEditPerson = true
            if (this.onCancel) {
              this.onCancel()
            }
          }
        },
      })
    },

    handleDeletePerson(id) {
      this.$confirm({
        title: 'Confirm Delete',
        message: `Are you sure you want to delete the person?`,
        button: {
          no: 'No',
          yes: 'Delete',
        },
        callback: confirm => {
          if (confirm) {
            if (this.onDeletePerson) {
              this.onDeletePerson(id)
            }
          }
        },
      })
    },

    handleEditPerson(id) {
      console.log('Edit Person in Form', id)
      this.stepIndex = 2
      this.isEditStop = false
      this.isEditPerson = true
    },

    handleEditStop() {
      this.stepIndex = 1
      this.isEditStop = true
      this.isEditPerson = false
    },

    handleNext() {
      this.stepIndex =
        this.isEditStop && !this.isEditPerson ? 6 : this.stepIndex + 1
      window.scrollTo(0, 0)
    },

    handleStartNew() {
      this.stepIndex = 1
      this.isEditStop = true
      this.isEditPerson = true
      if (this.onCancel) {
        this.onCancel()
      }
    },

    handleSubmit() {
      this.$confirm({
        title: 'Confirm Submission',
        message: `Are you sure you want to submit the form?`,
        button: {
          no: 'No',
          yes: 'Submit',
        },
        callback: confirm => {
          if (confirm) {
            this.isEditStop = true
            this.isEditPerson = true
            this.stepIndex = this.confirmationStepIndex
            if (this.onSubmit) {
              this.onSubmit(this.getApiStop)
            }
          }
        },
      })
    },
  },

  watch: {
    value(newVal) {
      this.stop = newVal
    },
  },

  props: {
    value: {
      type: Object,
      default: () => {},
    },
    schools: {
      type: Array,
      default: () => {},
    },
    beats: {
      type: Array,
      default: () => {},
    },
    countyCities: {
      type: Array,
      default: () => {},
    },
    fullStop: {
      type: Object,
      default: () => {},
    },
    lastLocation: {
      type: Object,
      default: () => {},
    },
    loadingPii: {
      type: Boolean,
      default: false,
    },
    nonCountyCities: {
      type: Array,
      default: () => {},
    },
    statutes: {
      type: Array,
      default: () => {},
    },
    validLastLocation: {
      type: Boolean,
      default: false,
    },
    onAddPerson: {
      type: Function,
      default: () => {},
    },
    onCancel: {
      type: Function,
      default: () => {},
    },
    onDeletePerson: {
      type: Function,
      default: () => {},
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
    onSubmit: {
      type: Function,
      default: () => {},
    },
  },
}
</script>

<style lang="scss">
@media only screen and (max-width: 600px) {
  .v-stepper__content {
    padding: 16px 16px 8px;
  }
}
</style>
