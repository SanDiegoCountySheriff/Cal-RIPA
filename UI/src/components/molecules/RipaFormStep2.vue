<template>
  <v-form ref="stepForm" lazy-validation>
    <template v-if="isSchool">
      <ripa-student v-model="model" toggle></ripa-student>
    </template>
    <ripa-race v-model="model"></ripa-race>
    <ripa-gender v-model="model"></ripa-gender>
    <ripa-age v-model="model"></ripa-age>
    <ripa-limited-english v-model="model"></ripa-limited-english>
    <ripa-disability v-model="model"></ripa-disability>

    <v-spacer></v-spacer>

    <template v-if="!isFormValid">
      <v-alert type="error">
        Oops, you may have missed something! Please review your selections
        above.
      </v-alert>
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
      <v-btn color="primary" @click="handleNext"> Next </v-btn>
    </div>
  </v-form>
</template>

<script>
import RipaAge from '@/components/molecules/RipaAge'
import RipaDisability from '@/components/molecules/RipaDisability'
import RipaGender from '@/components/molecules/RipaGender'
import RipaLimitedEnglish from '@/components/molecules/RipaLimitedEnglish'
import RipaRace from '@/components/molecules/RipaRace'
import RipaStudent from '@/components/molecules/RipaStudent'
import RipaFormStepMixin from '@/components/mixins/RipaFormStepMixin'

export default {
  name: 'ripa-form-step2',

  mixins: [RipaFormStepMixin],

  components: {
    RipaAge,
    RipaDisability,
    RipaGender,
    RipaLimitedEnglish,
    RipaRace,
    RipaStudent,
  },

  computed: {
    isSchool() {
      return this.viewModel.location.isSchool
    },
  },

  props: {
    backButtonVisible: {
      type: Boolean,
      default: true,
    },
  },
}
</script>
