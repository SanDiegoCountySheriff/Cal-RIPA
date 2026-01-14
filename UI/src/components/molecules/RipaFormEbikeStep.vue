<template>
  <v-form ref="stepForm" lazy-validation>
    <div
      v-if="$vuetify.breakpoint.mobile"
      class="tw-flex tw-mb-5 tw-justify-center"
    >
      <template v-if="backButtonVisible">
        <v-btn outlined color="primary" class="tw-mr-2" @click="handleBack">
          Back
        </v-btn>
      </template>
      <v-btn outlined color="error" class="tw-mr-2" @click="handleCancel">
        Cancel
      </v-btn>
      <v-btn color="primary" :disabled="!isFormValid" @click="handleNext">
        Next
      </v-btn>
    </div>

    <ripa-form-header
      title="Student"
      required
      :subtitle="
        model.stopVersion === 1 ? '§999.224(a)(16)' : '§999.224(a)(22)'
      "
      v-on="$listeners"
    >
    </ripa-form-header>

    <template v-if="!isFormValid">
      <ripa-alert alert-type="error">
        Oops, you may have missed something! Please review your selections
        above.
      </ripa-alert>
    </template>

    <div class="tw-flex tw-mt-8 tw-justify-center">
      <template v-if="backButtonVisible">
        <v-btn outlined color="primary" class="tw-mr-2" @click="handleBack">
          Back
        </v-btn>
      </template>
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
import RipaFormStepMixin from '@/components/mixins/RipaFormStepMixin'
import RipaFormHeader from '@/components/molecules/RipaFormHeader'

export default {
  name: 'ripa-form-ebike-step',

  mixins: [RipaFormStepMixin, RipaFormHeader],

  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    backButtonVisible: {
      type: Boolean,
      default: true,
    },
  },
}
</script>
