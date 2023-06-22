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
            label="K-12 Public School Student"
            :max-width="250"
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

  computed: {
    model: {
      get() {
        return this.value
      },
      set(newVal) {
        if (!newVal.person.isStudent) {
          newVal.stopResult.resultsOfStop12 = false
          newVal.stopResult.resultsOfStop13 = false

          if (
            newVal.stopReason.reasonForStop === 7 ||
            newVal.stopReason.reasonForStop === 8
          ) {
            newVal.stopReason.reasonForStop = null
            newVal.stopReason.educationViolation = null
            newVal.stopReason.educationViolationCode = null
          }

          if (
            newVal.actionsTaken.actionsTakenDuringStop !== null &&
            newVal.actionsTaken.actionsTakenDuringStop.length > 0
          ) {
            newVal.actionsTaken.actionsTakenDuringStop =
              newVal.actionsTaken.actionsTakenDuringStop.filter(
                item => item !== 23,
              )
          }
        }

        this.$emit('input', newVal)
      },
    },
  },

  watch: {
    model: {
      handler: function (newVal) {
        this.model = newVal
      },
      deep: true,
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
