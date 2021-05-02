<template>
  <div class="ripa-action-taken tw-p-4">
    <ripa-form-header
      title="Result of Stop"
      required
      subtitle="§999.226(a)(13)"
    >
    </ripa-form-header>

    <ripa-switch
      v-model="model.stopResult.anyActionsTaken"
      label="Any Actions Taken?"
      :max-width="200"
      @input="handleInput"
    ></ripa-switch>

    <template v-if="model.stopResult.anyActionsTaken">
      <ripa-checkbox label="Warning (verbal or written)"></ripa-checkbox>
      <ripa-checkbox label="Citation for infraction"></ripa-checkbox>
      <ripa-checkbox label="In-field cite and release"></ripa-checkbox>
      <ripa-checkbox
        label="Custodial arrest pursurant to outstanding warrant"
      ></ripa-checkbox>
      <ripa-checkbox label="Custodial arrest without warrant"></ripa-checkbox>
      <ripa-checkbox label="Field interview card completed"></ripa-checkbox>
      <ripa-checkbox label="Psychiatric hold"></ripa-checkbox>
      <ripa-checkbox
        label="Noncriminal transport or caretaking transport"
      ></ripa-checkbox>
      <ripa-checkbox
        label="Contacted parent/legal guardian or other person responsible for the minor"
      ></ripa-checkbox>
      <ripa-checkbox
        label="Contacted U.S. Department of Homeland Security"
      ></ripa-checkbox>

      <template v-if="isHomelandSecuritySelected">
        <v-alert class="tw-mt-8" dense outlined type="error" prominent>
          Are you sure you want to select 'Contacted U.S. Department of Homeland
          Security?'
        </v-alert>
      </template>
    </template>
  </div>
</template>

<script>
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaCheckbox from '@/components/atoms/RipaCheckbox'
import RipaSwitch from '@/components/atoms/RipaSwitch'
import { STOP_RESULTS } from '@/constants/form'

export default {
  name: 'ripa-stop-result',

  components: {
    RipaFormHeader,
    RipaCheckbox,
    RipaSwitch,
  },

  data() {
    return {
      valid: true,
      stopResultItems: STOP_RESULTS,
      viewModel: {
        stopReason: this.value?.stopReason || null,
        stopResult: {
          anyActionsTaken: this.value?.stopResult?.anyActionsTaken || false,
          actionsTakenDuringStop:
            this.value?.stopResult?.actionsTakenDuringStop || [],
        },
      },
    }
  },

  computed: {
    model: {
      get() {
        return this.viewModel
      },
    },

    isHomelandSecuritySelected() {
      return this.viewModel.stopResult.actionsTakenDuringStop.includes(10)
    },
  },

  methods: {
    handleInput() {
      this.$emit('input', this.viewModel)
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
