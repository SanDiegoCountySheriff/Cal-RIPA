<template>
  <v-form ref="stepForm" lazy-validation>
    <div>model.agencyQuestions: {{ model.agencyQuestions }}</div>
    <div>agencyQuestions: {{ agencyQuestions }}</div>

    <template v-if="questions.length > 0">
      <ripa-agency-question
        v-for="item in questions"
        v-bind:question="item"
        v-bind:name="item.Name"
        v-bind:prompt="item.Prompt"
        v-bind:hint="item.Hint"
        v-bind:maxLength="item.MaxLength"
        v-bind:required="item.Required"
        >Tacos</ripa-agency-question
      >
    </template>

    <ripa-agency-questions
      v-model="model"
      :on-open-statute="onOpenStatute"
    ></ripa-agency-questions>

    <v-spacer></v-spacer>

    <template v-if="!isFormValid">
      <ripa-alert alert-type="error">
        Oops, you may have missed something! Please review your selections
        above.
      </ripa-alert>
    </template>

    <div class="tw-flex tw-mt-8 tw-justify-center">
      <template v-if="backButtonVisible">
        <v-btn
          outlined
          color="primary"
          class="tw-mr-2"
          :disabled="isBackNextDisabled"
          @click="handleBack"
        >
          Back
        </v-btn>
      </template>
      <v-btn outlined color="error" class="tw-mr-2" @click="handleCancel">
        Cancel
      </v-btn>
      <v-btn color="primary" :disabled="isBackNextDisabled" @click="handleNext">
        Next
      </v-btn>
    </div>

    <div>questions: {{ questions }}</div>
  </v-form>
</template>

<script>
import RipaAlert from '@/components/atoms/RipaAlert'
import RipaAgencyQuestions from '@/components/molecules/RipaAgencyQuestions'
import RipaFormStepMixin from '@/components/mixins/RipaFormStepMixin'
import RipaAgencyQuestion from '@/components/molecules/RipaAgencyQuestion'

export default {
  name: 'ripa-form-step6',

  mixins: [RipaFormStepMixin],

  components: {
    RipaAlert,
    RipaAgencyQuestions,
  },

  props: {
    backButtonVisible: {
      type: Boolean,
      default: true,
    },
    questions: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
