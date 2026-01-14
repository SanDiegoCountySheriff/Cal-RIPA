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

    {{ model }}

    <ripa-ebike v-model="model" v-on="$listeners" />

    <template v-if="model.ebike">
      <ripa-ebike-class />
    </template>

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
import RipaEbike from '@/components/molecules/RipaEbike.vue'
import RipaEbikeClass from '@/components/molecules/RipaEbikeClass.vue'

export default {
  name: 'ripa-form-ebike-step',

  components: {
    RipaEbike,
    RipaEbikeClass,
  },

  mixins: [RipaFormStepMixin],

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
