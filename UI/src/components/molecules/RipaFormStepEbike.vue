<template>
  <v-form ref="stepForm" lazy-validation>
    <div
      v-if="$vuetify.breakpoint.mobile"
      class="tw-flex tw-mb-5 tw-justify-center"
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

    <ripa-form-header
      title="E-BIKE SAFETY PILOT PROGRAM (AB2234)"
      required
      subtitle="§21214.7"
      v-on="$listeners"
    >
    </ripa-form-header>

    <v-container>
      <v-row no-gutters>
        <v-col cols="12">
          <ripa-switch
            v-model="model.person.ebikeInfo.stopInvolvedEbike"
            label="This stop involved an E-Bike."
            :disabled="disabled"
            :rules="ebikeRules"
          >
          </ripa-switch>
        </v-col>
      </v-row>

      <template v-if="model.person.ebikeInfo.stopInvolvedEbike">
        <v-row no-gutters class="tw-mt-4">
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

        <v-row no-gutters class="tw-mt-4">
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
              :disabled="disabled"
              :min="1"
              :max="120"
            >
            </ripa-number-input>
          </v-col>
        </v-row>

        <v-row no-gutters class="tw-mt-4">
          <v-col cols="12">
            <ripa-switch
              v-model="model.person.ebikeInfo.declinedToProvieOrUncooperative"
              label="Declined to provie/uncooperative"
              :disabled="disabled"
            >
            </ripa-switch>
          </v-col>
        </v-row>

        <v-row no-gutters class="tw-mt-4">
          <v-col cols="12">
            <ripa-form-header
              title="CITATION/WARNING"
              subtitle="§21214.7(c)"
              v-on="$listeners"
            >
            </ripa-form-header>
            <ripa-switch
              v-model="model.person.ebikeInfo.citationIssued"
              label="Citation issued (if false, warning issued)"
              :disabled="disabled"
            >
            </ripa-switch>
          </v-col>
        </v-row>

        <v-row no-gutters class="tw-mt-4">
          <v-col cols="12">
            <ripa-text-input
              v-model="model.person.ebikeInfo.violationCode"
              label="Violation Code"
              hint="Vehicle Code §21214.7"
              :disabled="disabled"
            >
            </ripa-text-input>
          </v-col>
        </v-row>

        <v-row no-gutters class="tw-mt-4">
          <v-col cols="12">
            <ripa-form-header
              title="TRAINING COURSE"
              subtitle="§21214.7(c)(2)"
              v-on="$listeners"
            >
            </ripa-form-header>
            <ripa-switch
              v-model="model.person.ebikeInfo.trainingCourseCompleted"
              label="Person completed e-bike safety training program (§894 Streets & Highways Code) in lieu of fine"
              :disabled="disabled"
            >
            </ripa-switch>
          </v-col>
        </v-row>
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
import RipaTextInput from '@/components/atoms/RipaTextInput'
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
    RipaTextInput,
  },

  computed: {
    ebikeClasses() {
      return EBIKE_CLASSES
    },

    ebikeRules() {
      return [
        v => v !== null || 'Please indicate if this stop involved an E-Bike',
      ]
    },

    ebikeClassRules() {
      if (this.model.person.ebikeInfo.stopInvolvedEbike) {
        return [
          v => !!v || 'E-Bike class is required when stop involves an E-Bike',
        ]
      }
      return []
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
