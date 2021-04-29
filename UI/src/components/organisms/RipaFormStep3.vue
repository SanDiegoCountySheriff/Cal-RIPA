<template>
  <div>
    <v-form ref="step3" lazy-validation>
      <ripa-stop-reason
        ref="stopReason"
        v-model="stopReason"
      ></ripa-stop-reason>
    </v-form>
    <v-divider></v-divider>
    <div class="tw-flex tw-mt-8">
      <v-btn color="primary" class="tw-mr-4" @click="submit"> Submit </v-btn>
      <v-btn color="error" class="tw-mr-4" @click="reset"> Reset </v-btn>
    </div>
  </div>
</template>

<script>
import RipaStopReason from '@/components/molecules/RipaStopReason'

export default {
  name: 'ripa-form-step3',

  components: { RipaStopReason },

  data() {
    return {
      stopReason: {
        reason: 2,
        explanation: 'steve',
        // trafficViolation: this.value?.trafficViolation || null,
        // trafficViolationCode: this.value?.trafficViolationCode || null,
        // reasonableSuspicionValues: this.value?.reasonableSuspicionValues || [],
      },
    }
  },

  methods: {
    submit() {
      const isValid = this.$refs.step3.validate()
      if (!isValid) {
        return
      }
      const stopReasonForm = this.$refs.stopReason
      this.$emit('input', {
        stopReason: {
          reason: stopReasonForm.reason,
          explanation: stopReasonForm.explanation,
        },
      })
    },

    reset() {
      this.$refs.step3.reset()
    },
  },

  props: {
    value: {
      type: Object,
      default: () => {},
    },
  },
}
</script>
