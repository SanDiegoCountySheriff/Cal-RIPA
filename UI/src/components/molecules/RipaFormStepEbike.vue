<template>
  <v-form ref="stepForm" lazy-validation>
    <div
      v-if="$vuetify.breakpoint.mobile"
      class="tw-flex tw-mb-4 tw-justify-center"
    >
      <v-btn outlined color="primary" class="tw-mr-2" @click="handleBack">
        Back
      </v-btn>
      <v-btn outlined color="error" class="tw-mr-2" @click="handleCancel">
        Cancel
      </v-btn>
      <v-btn color="primary" :disabled="!isFormValid" @click="handleNext">
        Next
      </v-btn>
    </div>

    <v-container>
      <div class="tw-pb-4">
        <ripa-form-header
          title="E-BIKE SAFETY PILOT PROGRAM (AB2234)"
          required
          subtitle="§21214.7"
          v-on="$listeners"
        >
        </ripa-form-header>
      </div>

      <div class="tw-pb-4">
        <v-row no-gutters>
          <v-col cols="12">
            <ripa-switch
              v-model="model.person.ebikeInfo.stopInvolvedEbike"
              label="This stop involved an E-Bike."
              :disabled="disabled"
            >
            </ripa-switch>
          </v-col>
        </v-row>
      </div>

      <template v-if="model.person.ebikeInfo.stopInvolvedEbike">
        <div class="tw-pb-4">
          <v-row no-gutters>
            <v-col cols="12">
              <ripa-form-header
                title="E-BIKE CLASS"
                required
                subtitle="§21214.7"
                v-on="$listeners"
              >
              </ripa-form-header>
              <ripa-radio-group
                v-model="model.person.ebikeInfo.ebikeClass"
                :items="ebikeClasses"
                :disabled="disabled"
                :rules="ebikeClassRules"
                display-row
              >
              </ripa-radio-group>
            </v-col>
          </v-row>
        </div>

        <div class="tw-pb-4">
          <v-row no-gutters>
            <v-col cols="12">
              <ripa-form-header
                title="VERIFIED AGE"
                subtitle="§21214.7"
                v-on="$listeners"
              >
              </ripa-form-header>
              <ripa-number-input
                v-model="model.person.ebikeInfo.verifiedAge"
                label="Verified Age"
                :disabled="
                  disabled ||
                  model.person.ebikeInfo.declinedToProvideOrUncooperative
                "
                :rules="verifiedAgeRules"
                :min="1"
                :max="120"
              >
              </ripa-number-input>
            </v-col>
          </v-row>
        </div>

        <div class="tw-pb-4">
          <v-row no-gutters>
            <v-col cols="12">
              <ripa-switch
                v-model="
                  model.person.ebikeInfo.declinedToProvideOrUncooperative
                "
                label="Declined to provide/uncooperative"
                :disabled="disabled"
              >
              </ripa-switch>
            </v-col>
          </v-row>
        </div>
      </template>
    </v-container>

    <v-spacer></v-spacer>

    <template v-if="!isFormValid">
      <ripa-alert alert-type="error">
        Oops, you may have missed something! Please review your selections
        above.
      </ripa-alert>
    </template>

    <div class="tw-flex tw-mt-8 tw-justify-center">
      <v-btn outlined color="primary" class="tw-mr-2" @click="handleBack">
        Back
      </v-btn>
      <v-btn outlined color="error" class="tw-mr-2" @click="handleCancel">
        Cancel
      </v-btn>
      <v-btn color="primary" :disabled="!isFormValid" @click="handleNext">
        Next
      </v-btn>
    </div>
  </v-form>
</template>

<script>
import RipaAlert from '@/components/atoms/RipaAlert'
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaNumberInput from '@/components/atoms/RipaNumberInput'
import RipaRadioGroup from '@/components/atoms/RipaRadioGroup'
import RipaSwitch from '@/components/atoms/RipaSwitch'
import RipaFormStepMixin from '@/components/mixins/RipaFormStepMixin'
import { EBIKE_CLASSES } from '@/constants/form'

export default {
  name: 'ripa-form-step-ebike',

  mixins: [RipaFormStepMixin],

  components: {
    RipaAlert,
    RipaFormHeader,
    RipaNumberInput,
    RipaRadioGroup,
    RipaSwitch,
  },

  computed: {
    ebikeClasses() {
      return EBIKE_CLASSES
    },

    ebikeClassRules() {
      if (!this.model.person.ebikeInfo.stopInvolvedEbike) {
        return []
      }

      const allowedValues = (this.ebikeClasses || []).map(item => item.value)

      return [
        v => {
          const numericValue = typeof v === 'number' ? v : Number(v)
          return (
            allowedValues.includes(numericValue) ||
            'Select a valid E-Bike class'
          )
        },
      ]
    },

    verifiedAgeRules() {
      if (!this.model.person.ebikeInfo.stopInvolvedEbike) {
        return []
      }

      return [
        v => {
          const declined =
            this.model.person.ebikeInfo.declinedToProvideOrUncooperative ===
            true

          if (declined) {
            return true
          }

          const age = typeof v === 'number' ? v : Number(v)
          return (
            age > 0 || 'Enter verified age, or select declined/uncooperative'
          )
        },
      ]
    },
  },

  watch: {
    'model.person.ebikeInfo.declinedToProvideOrUncooperative'(newVal) {
      if (!this.model.person.ebikeInfo.stopInvolvedEbike) {
        return
      }

      if (newVal === true) {
        this.model.person.ebikeInfo.verifiedAge = null
      }

      this.$nextTick(() => {
        const form = this.$refs.stepForm
        if (form) {
          form.validate()
        }
      })
    },
  },

  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
