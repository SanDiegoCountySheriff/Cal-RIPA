<template>
  <v-form ref="stepForm" lazy-validation>
    <ripa-form-summary
      v-model="model"
      v-on="$listeners"
      edit-buttons
      :api-stop="apiStop"
    ></ripa-form-summary>

    <v-spacer></v-spacer>

    <template v-if="isAdminEditing">
      <v-row>
        <v-col>
          <ripa-edit-stop-explanation
            v-model="model"
          ></ripa-edit-stop-explanation>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <ripa-override-pii
            :api-stop="apiStop"
            v-model="model"
          ></ripa-override-pii>
        </v-col>
        <v-col cols="6">
          <template v-if="isStopErrored">
            <ripa-nfia v-model="model"></ripa-nfia>
          </template>
        </v-col>
      </v-row>
    </template>

    <v-spacer></v-spacer>

    <template v-if="!isFormValid">
      <ripa-alert alert-type="error">
        Oops, you may have missed something! Please review your selections
        above.
      </ripa-alert>
    </template>

    <template v-if="!isAdminEditing && !isAdminViewing">
      <div class="tw-flex tw-mt-4 tw-justify-center">
        <v-btn color="primary" class="tw-mt-2" @click="handleAddPerson">
          <v-icon left> mdi-plus </v-icon>
          Add Person
        </v-btn>
      </div>
    </template>

    <template v-if="isAdminViewing">
      <div class="tw-flex tw-mt-8 tw-justify-center">
        <v-btn color="primary" class="tw-mr-2" @click="handleDone">
          Done
        </v-btn>
      </div>
    </template>

    <template v-else>
      <div class="tw-flex tw-mt-8 tw-justify-center">
        <v-btn color="primary" class="tw-mr-2" @click="handleBack">Back</v-btn>
        <v-btn color="error" class="tw-mr-2" @click="handleCancel">
          Cancel
        </v-btn>
        <v-btn color="primary" @click="handleSubmit"> Submit </v-btn>
      </div>
    </template>
  </v-form>
</template>

<script>
import RipaAlert from '@/components/atoms/RipaAlert'
import RipaFormStepMixin from '@/components/mixins/RipaFormStepMixin'
import RipaFormSummary from '@/components/molecules/RipaFormSummary'
import RipaEditStopExplanation from '@/components/molecules/RipaEditStopExplanation'
import RipaOverridePii from '@/components/molecules/RipaOverridePii'
import RipaNfia from '@/components/molecules/RipaNfia'

export default {
  name: 'ripa-form-step7',

  mixins: [RipaFormStepMixin],

  components: {
    RipaAlert,
    RipaFormSummary,
    RipaEditStopExplanation,
    RipaOverridePii,
    RipaNfia,
  },

  inject: ['isAdminEditing', 'isAdminViewing'],

  methods: {
    handleAddPerson() {
      this.$emit('on-add-person')
    },

    handleSubmit() {
      this.isFormValid = this.$refs.stepForm.validate()
      if (!this.isFormValid) {
        return
      }
      this.$emit('input', this.model)
      this.$emit('on-submit')
    },

    handleDone() {
      this.$emit('handle-done')
    },
  },

  computed: {
    isStopErrored() {
      return (
        this.apiStop.listSubmission?.some(s => {
          return s.listSubmissionError?.some(l => !!l)
        }) || false
      )
    },
  },

  props: {
    apiStop: {
      type: Object,
      default: () => {},
    },
  },
}
</script>
