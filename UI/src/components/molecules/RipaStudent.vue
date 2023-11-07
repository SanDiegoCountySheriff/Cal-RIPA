<template>
  <div class="ripa-student tw-pb-4">
    <ripa-form-header
      title="Student"
      required
      subtitle="§999.224(a)(16)"
      v-on="$listeners"
    >
    </ripa-form-header>

    <v-container>
      <v-row no-gutters>
        <v-col cols="12" sm="12">
          <ripa-switch
            v-model="model.person.isStudent"
            :max-width="250"
            @input="handleInput"
            label="K-12 Public School Student"
          ></ripa-switch>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaSwitch from '@/components/atoms/RipaSwitch'

export default {
  name: 'ripa-student',

  components: {
    RipaSwitch,
    RipaFormHeader,
  },

  methods: {
    handleInput() {
      this.updateModel()
      this.$emit('input', this.model)
    },

    updateModel() {
      if (!this.model.person.isStudent) {
        this.model.stopResult.resultsOfStop12 = false
        this.model.stopResult.resultsOfStop13 = false
        this.model.person.perceivedOrKnownDisability =
          this.model.person.perceivedOrKnownDisability.filter(
            disability => disability !== 7,
          )
        this.model.nonForceActionsTaken.nonForceActionsTakenDuringStop =
          this.model.nonForceActionsTaken.nonForceActionsTakenDuringStop.filter(
            item => item !== 1,
          )
        if (
          this.model.stopReason.reasonForStop === 7 ||
          this.model.stopReason.reasonForStop === 8
        ) {
          this.model.stopReason.reasonForStop = null
          this.model.stopReason.educationViolation = null
          this.model.stopReason.educationViolationCode = null
        }

        if (
          this.model.actionsTaken?.actionsTakenDuringStop !== null &&
          this.model.actionsTaken?.actionsTakenDuringStop.length > 0
        ) {
          this.model.actionsTaken.actionsTakenDuringStop =
            this.model.actionsTaken.actionsTakenDuringStop.filter(
              item => item !== 23,
            )
        }
      }
    },
  },

  computed: {
    model: {
      get() {
        return this.value
      },
    },
  },

  props: {
    value: {
      type: Object,
      default: () => {},
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
