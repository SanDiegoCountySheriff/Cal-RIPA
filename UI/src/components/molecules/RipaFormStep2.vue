<template>
  <v-form ref="stepForm" lazy-validation>
    <template v-if="isSchool">
      <ripa-student
        v-model="model"
        v-on="$listeners"
        :disabled="disabled"
      ></ripa-student>
    </template>

    <ripa-race
      v-model="model"
      v-on="$listeners"
      :disabled="disabled"
    ></ripa-race>

    <ripa-gender
      v-model="model"
      v-on="$listeners"
      :disabled="disabled"
    ></ripa-gender>

    <ripa-age v-model="model" v-on="$listeners" :disabled="disabled"></ripa-age>

    <ripa-limited-english
      v-model="model"
      v-on="$listeners"
      :disabled="disabled"
    ></ripa-limited-english>

    <ripa-disability
      v-model="model"
      v-on="$listeners"
      :disabled="disabled"
    ></ripa-disability>

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
  </v-form>
</template>

<script>
import RipaPerceivedUnhoused from '@/components/molecules/RipaPerceivedUnhoused'
import RipaAge from '@/components/molecules/RipaAge'
import RipaAlert from '@/components/atoms/RipaAlert'
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
    RipaAlert,
    RipaDisability,
    RipaGender,
    RipaLimitedEnglish,
    RipaRace,
    RipaStudent,
    RipaPerceivedUnhoused,
  },

  computed: {
    isSchool() {
      return this.model?.location?.isSchool || false
    },
  },

  props: {
    backButtonVisible: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
