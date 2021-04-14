<template>
  <div>
    <v-form ref="step3" lazy-validation>
      <ripa-stop-reason
        ref="stopReason1"
        v-model="stopReason1"
      ></ripa-stop-reason>
      <!-- <ripa-stop-reason
        ref="stopReason2"
        v-model="stopReason2"
      ></ripa-stop-reason> -->
    </v-form>
    <v-btn color="primary" class="tw-mr-4" @click="submit"> Submit </v-btn>
    <v-btn color="error" class="tw-mr-4" @click="reset"> Reset </v-btn>
  </div>
</template>

<script>
import RipaStopReason from '@/components/molecules/RipaStopReason'

export default {
  name: 'ripa-form-step3',

  components: { RipaStopReason },

  data() {
    return {
      stopReason1: {
        name: this.value.name1,
      },
      stopReason2: {
        name: this.value.name2,
      },
    }
  },

  methods: {
    submit() {
      const isValid = this.$refs.step3.validate()
      if (!isValid) {
        return
      }
      const stopReason1Form = this.$refs.stopReason1
      const stopReason2Form = this.$refs.stopReason2
      this.$emit('input', {
        stopReason1: {
          name: stopReason1Form.name,
          year: stopReason1Form.email,
          select: stopReason1Form.select,
          checkbox: stopReason1Form.checkbox,
        },
        stopReason2: {
          name: stopReason2Form.name,
          year: stopReason2Form.email,
          select: stopReason2Form.select,
          checkbox: stopReason2Form.checkbox,
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
