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
              1
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step
              :rules="[() => step2Validated]"
              :complete="stepIndex > 2"
              step="2"
            >
              2
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step
              :rules="[() => step3Validated]"
              :complete="stepIndex > 3"
              step="3"
            >
              3
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step
              :rules="[() => step4Validated]"
              :complete="stepIndex > 4"
              step="4"
            >
              4
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step
              :rules="[() => step5Validated]"
              :complete="stepIndex > 5"
              step="5"
            >
              5
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="6"> 6 </v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="1">
              <ripa-form-step-1
                v-model="model"
                :on-next="handleNext"
                :on-cancel="handleCancel"
              ></ripa-form-step-1>
            </v-stepper-content>

            <v-stepper-content step="2">
              <ripa-form-step-2
                v-model="model"
                :on-back="handleBack"
                :on-next="handleNext"
                :on-cancel="handleCancel"
              ></ripa-form-step-2>
            </v-stepper-content>

            <v-stepper-content step="3">
              <ripa-form-step-3
                v-model="model"
                :on-back="handleBack"
                :on-next="handleNext"
                :on-cancel="handleCancel"
              ></ripa-form-step-3>
            </v-stepper-content>

            <v-stepper-content step="4">
              <ripa-form-step-4
                v-model="model"
                :on-back="handleBack"
                :on-next="handleNext"
                :on-cancel="handleCancel"
              ></ripa-form-step-4>
            </v-stepper-content>

            <v-stepper-content step="5">
              <ripa-form-step-5
                v-model="model"
                :on-back="handleBack"
                :on-next="handleNext"
                :on-cancel="handleCancel"
              ></ripa-form-step-5>
            </v-stepper-content>

            <v-stepper-content step="6">
              <ripa-form-step-6
                v-model="model"
                :on-back="handleBack"
                :on-submit="handleSubmit"
                :on-cancel="handleCancel"
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
      viewModel: { stop: this.value?.stop || null },
    }
  },

  computed: {
    model: {
      get() {
        return this.viewModel
      },
      set(newVal) {
        console.log(newVal)
        this.viewModel = newVal
        this.$emit('input', newVal)
      },
    },
  },

  methods: {
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
  },
}
</script>
