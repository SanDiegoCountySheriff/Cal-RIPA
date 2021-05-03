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
                :cities="cities"
                :schools="schools"
                @input="handleInput"
              ></ripa-form-step-1>
            </v-stepper-content>

            <v-stepper-content step="2">
              <ripa-form-step-2
                v-model="stop"
                :on-back="handleBack"
                :on-next="handleNext"
                :on-cancel="handleCancel"
                @input="handleInput"
              ></ripa-form-step-2>
            </v-stepper-content>

            <v-stepper-content step="3">
              <ripa-form-step-3
                v-model="stop"
                :on-back="handleBack"
                :on-next="handleNext"
                :on-cancel="handleCancel"
                :offense-codes="offenseCodes"
                @input="handleInput"
              ></ripa-form-step-3>
            </v-stepper-content>

            <v-stepper-content step="4">
              <ripa-form-step-4
                v-model="stop"
                :on-back="handleBack"
                :on-next="handleNext"
                :on-cancel="handleCancel"
                :offense-codes="offenseCodes"
                @input="handleInput"
              ></ripa-form-step-4>
            </v-stepper-content>

            <v-stepper-content step="5">
              <ripa-form-step-5
                v-model="stop"
                :on-back="handleBack"
                :on-next="handleNext"
                :on-cancel="handleCancel"
                :offense-codes="offenseCodes"
                @input="handleInput"
              ></ripa-form-step-5>
            </v-stepper-content>

            <v-stepper-content step="6">
              <ripa-form-step-6
                v-model="stop"
                :on-back="handleBack"
                :on-submit="handleSubmit"
                :on-cancel="handleCancel"
                @input="handleInput"
              ></ripa-form-step-6>
            </v-stepper-content>
          </v-stepper-items>
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
import RipaFormStep1 from '@/components/organisms/RipaFormStep1'
import RipaFormStep2 from '@/components/organisms/RipaFormStep2'
import RipaFormStep3 from '@/components/organisms/RipaFormStep3'
import RipaFormStep4 from '@/components/organisms/RipaFormStep4'
import RipaFormStep5 from '@/components/organisms/RipaFormStep5'
import RipaFormStep6 from '@/components/organisms/RipaFormStep6'
import _ from 'lodash'

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
    }
  },

  methods: {
    handleInput(newVal) {
      const mergedStop = _.merge(this.stop, newVal)
      this.stop = mergedStop
      // this.$forceUpdate()
      this.$emit('input', mergedStop)
    },

    handleBack() {
      this.stepIndex = this.stepIndex - 1
      window.scrollTo(0, 0)
    },

    handleNext() {
      this.stepIndex = this.stepIndex + 1
      window.scrollTo(0, 0)
    },

    handleCancel() {
      console.log('cancel form')
    },

    handleSubmit() {
      this.stepIndex = this.confirmationStepIndex
      window.scrollTo(0, 0)
    },

    handleStartNew() {
      this.stop = null
      this.stepIndex = 1
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
    cities: {
      type: Array,
      default: () => {},
    },
    offenseCodes: {
      type: Array,
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
