<template>
  <v-form ref="step2" lazy-validation>
    <ripa-student
      v-model="model.student"
      @input="handleInput"
      toggle
    ></ripa-student>
    <ripa-race v-model="model.perceivedRace"></ripa-race>
    <ripa-gender v-model="model.perceivedGender"></ripa-gender>
    <ripa-age v-model="model.perceivedAge"></ripa-age>
    <ripa-limited-english
      v-model="model.perceivedLimitedEnglish"
    ></ripa-limited-english>
    <ripa-disability
      v-model="model.perceivedOrKnownDisability"
    ></ripa-disability>
    <v-spacer></v-spacer>

    <template v-if="!isValid">
      <v-alert type="error">
        Oops, you may have missed something! Please review your selections
        above.
      </v-alert>
    </template>

    <div class="tw-flex tw-mt-8 tw-justify-center">
      <v-btn outlined color="primary" class="tw-mr-4" @click="back">
        Back
      </v-btn>
      <v-btn outlined color="error" class="tw-mr-4" @click="cancel">
        Cancel
      </v-btn>
      <v-btn color="primary" class="tw-mr-4" @click="next"> Next </v-btn>
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

export default {
  name: 'ripa-form-step2',

  components: {
    RipaAge,
    RipaDisability,
    RipaGender,
    RipaLimitedEnglish,
    RipaRace,
    RipaStudent,
  },

  data() {
    return {
      isValid: true,
      viewModel: {
        student: this.value?.student || null,
        perceivedRace: this.value?.perceivedRace || null,
        perceivedGender: this.value?.perceivedGender || null,
        perceivedAge: this.value?.perceivedGender || null,
        perceivedLimitedEnglish: this.value?.perceivedLimitedEnglish || null,
        perceivedOrKnownDisability:
          this.value?.perceivedOrKnownDisability || null,
      },
    }
  },

  computed: {
    model: {
      get() {
        return this.viewModel
      },
    },
  },

  methods: {
    handleInput() {
      this.$emit('input', this.viewModel)
    },

    back() {
      if (this.onBack) {
        this.onBack()
      }
    },

    next() {
      this.isValid = this.$refs.step2.validate()
      if (!this.isValid) {
        return
      }
      this.$emit('input', this.viewModel)
      if (this.onNext) {
        this.onNext()
      }
    },

    cancel() {
      if (this.onCancel) {
        this.onCancel()
      }
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
    onBack: {
      type: Function,
      default: () => {},
    },
    onNext: {
      type: Function,
      default: () => {},
    },
    onCancel: {
      type: Function,
      default: () => {},
    },
  },
}
</script>
