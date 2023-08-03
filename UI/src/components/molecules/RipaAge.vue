<template>
  <div class="ripa-age tw-pb-4">
    <ripa-form-header
      title="Perceived Age"
      required
      :subtitle="§999.226(a)(8)"
      v-on="$listeners"
    >
    </ripa-form-header>

    <v-container>
      <v-row no-gutters>
        <v-col cols="12" sm="12">
          <ripa-number-input
            v-model="model.person.perceivedAge"
            label="Perceived Age"
            :disabled="disabled"
            :min="1"
            :max="1250"
            :rules="ageRules"
          >
          </ripa-number-input>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaNumberInput from '@/components/atoms/RipaNumberInput'

export default {
  name: 'ripa-age',

  components: {
    RipaFormHeader,
    RipaNumberInput,
  },

  computed: {
    model: {
      get() {
        return this.value
      },
      set(newVal) {
        this.$emit('input', newVal)
      },
    },

    ageRules() {
      return [
        v => !!v || 'An age is required',
        v => (v >= 1 && v <= 120) || 'Age must be between 1 and 120 years',
      ]
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
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
