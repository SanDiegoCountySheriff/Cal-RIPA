<template>
  <v-card class="mx-auto" max-width="900" outlined>
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

            <v-stepper-step step="5"></v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="1">
              <ripa-form-step-1
                v-model="stop"
                :on-next="handleNext"
                :on-cancel="handleCancel"
                :beats="beats"
                :county-cities="countyCities"
                :non-county-cities="nonCountyCities"
                :schools="schools"
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
                :on-back="handleBack"
                :on-next="handleNext"
                :on-cancel="handleCancel"
                :statutes="statutes"
                @input="handleInput"
              ></ripa-form-step-4>
            </v-stepper-content>

            <v-stepper-content step="5">
              <ripa-form-step-5
                v-model="stop"
                :on-add-person="handleAddPerson"
                :on-back="handleBack"
                :on-delete-person="handleDeletePerson"
                :on-edit-person="handleEditPerson"
                :on-edit-stop="handleEditStop"
                :on-submit="handleSubmit"
                :on-cancel="handleCancel"
                @input="handleInput"
              ></ripa-form-step-5>
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

            <v-stepper-step step="5"></v-stepper-step>
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
import RipaSubheader from '@/components/atoms/RipaSubheader'

export default {
  name: 'ripa-form-wrapper',

  components: {
    RipaConfirmation,
    RipaFormStep1,
    RipaFormStep2,
    RipaFormStep3,
    RipaFormStep4,
    RipaFormStep5,
    RipaSubheader,
  },

  data() {
    return {
      stepIndex: 1,
      step1Validated: true,
      step2Validated: true,
      step3Validated: true,
      step4Validated: true,
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
  },

  methods: {
    handleInput(newVal) {
      this.stop = Object.assign({}, newVal)
      this.$emit('input', this.stop)
    },

    handleAddPerson() {
      this.stepIndex = 2
      window.scrollTo(0, 0)
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

    handleDeletePerson(id) {
      console.log('Delete Person', id)
    },

    handleEditPerson(id) {
      console.log('Edit Person', id)
      this.stepIndex = 2
      window.scrollTo(0, 0)
      this.isEditStop = false
      this.isEditPerson = true
    },

    handleEditStop() {
      this.stepIndex = 1
      window.scrollTo(0, 0)
      this.isEditStop = true
      this.isEditPerson = false
    },

    handleNext() {
      this.stepIndex =
        this.isEditStop && !this.isEditPerson ? 6 : this.stepIndex + 1
      window.scrollTo(0, 0)
    },

    handleCancel() {
      this.stepIndex = 1
      this.isEditStop = true
      this.isEditPerson = true
      window.scrollTo(0, 0)
      if (this.onCancel) {
        this.onCancel()
      }
    },

    handleSubmit() {
      this.isEditStop = true
      this.isEditPerson = true
      this.stepIndex = this.confirmationStepIndex
      window.scrollTo(0, 0)
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
    nonCountyCities: {
      type: Array,
      default: () => {},
    },
    statutes: {
      type: Array,
      default: () => {},
    },
    onAddPerson: {
      type: Function,
      default: () => {},
    },
    onCancel: {
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
