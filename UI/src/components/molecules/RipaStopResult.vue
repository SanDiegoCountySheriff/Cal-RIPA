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
      <ripa-checkbox
        v-model="value1"
        label="Warning (verbal or written)"
        @input="handleInput"
      ></ripa-checkbox>

      <template v-if="value1">
        <ripa-autocomplete
          v-model="model.stopResult.warningCodes"
          hint="Select Up to 5 Offense Codes (required)"
          persistent-hint
          item-text="fullName"
          item-value="code"
          label="Offense Code"
          :items="offenseCodes"
          multiple
          chips
          small-chips
          deletable-chips
          :max-selections="5"
          @input="handleInput"
        ></ripa-autocomplete>
      </template>

      <ripa-checkbox
        v-model="value2"
        label="Citation for infraction"
        @input="handleInput"
      ></ripa-checkbox>

      <template v-if="value2">
        <ripa-autocomplete
          v-model="model.stopResult.citationCodes"
          hint="Select Up to 5 Offense Codes (required)"
          persistent-hint
          item-text="fullName"
          item-value="code"
          label="Offense Code"
          :items="offenseCodes"
          multiple
          chips
          small-chips
          deletable-chips
          @input="handleInput"
        ></ripa-autocomplete>
      </template>

      <ripa-checkbox
        label="In-field cite and release"
        @input="handleInput"
      ></ripa-checkbox>

      <ripa-checkbox
        label="Custodial arrest pursurant to outstanding warrant"
        @input="handleInput"
      ></ripa-checkbox>

      <ripa-checkbox
        label="Custodial arrest without warrant"
        @input="handleInput"
      ></ripa-checkbox>

      <ripa-checkbox
        label="Field interview card completed"
        @input="handleInput"
      ></ripa-checkbox>

      <ripa-checkbox
        label="Psychiatric hold"
        @input="handleInput"
      ></ripa-checkbox>

      <ripa-checkbox
        label="Noncriminal transport or caretaking transport"
        @input="handleInput"
      ></ripa-checkbox>

      <ripa-checkbox
        label="Contacted parent/legal guardian or other person responsible for the minor"
        @input="handleInput"
      ></ripa-checkbox>

      <ripa-checkbox
        label="Contacted U.S. Department of Homeland Security"
        @input="handleInput"
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
import RipaAutocomplete from '@/components/atoms/RipaAutocomplete'
import RipaCheckbox from '@/components/atoms/RipaCheckbox'
import RipaSwitch from '@/components/atoms/RipaSwitch'
import { STOP_RESULTS } from '@/constants/form'

export default {
  name: 'ripa-stop-result',

  components: {
    RipaFormHeader,
    RipaAutocomplete,
    RipaCheckbox,
    RipaSwitch,
  },

  data() {
    return {
      valid: true,
      stopResultItems: STOP_RESULTS,
      value1: this.value?.stop?.actionsTakenDuringStop.includes(1) || false,
      value2: this.value?.stop?.actionsTakenDuringStop.includes(2) || false,
      viewModel: {
        stopReason: this.value?.stopReason || null,
        stopResult: {
          anyActionsTaken: this.value?.stopResult?.anyActionsTaken || false,
          actionsTakenDuringStop:
            this.value?.stopResult?.actionsTakenDuringStop || [],
          warningCodes: this.value?.stopResult?.warningCodes || [],
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
      this.updateActionsTakenModel()
      this.$emit('input', this.viewModel)
    },

    updateActionsTakenModel() {
      if (this.value1) {
        if (
          this.viewModel.stopResult.actionsTakenDuringStop.indexOf(1) === -1
        ) {
          this.viewModel.stopResult.actionsTakenDuringStop.push(1)
        }
      } else {
        this.viewModel.stopResult.actionsTakenDuringStop = this.viewModel.stopResult.actionsTakenDuringStop.filter(
          item => item !== 1,
        )
      }

      if (this.value2) {
        if (
          this.viewModel.stopResult.actionsTakenDuringStop.indexOf(2) === -1
        ) {
          this.viewModel.stopResult.actionsTakenDuringStop.push(2)
        }
      } else {
        this.viewModel.stopResult.actionsTakenDuringStop = this.viewModel.stopResult.actionsTakenDuringStop.filter(
          item => item !== 2,
        )
      }
    },
  },

  props: {
    value: {
      type: Object,
      default: () => {},
    },
    offenseCodes: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
