<template>
  <div class="ripa-gender tw-pb-8">
    <template class="tw-mb-4">
      <ripa-form-header
        title="Perceived Gender"
        required
        subtitle="§999.226(a)(5)"
      >
      </ripa-form-header>

      <ripa-radio-group
        v-model="model.perceivedGender"
        :items="genderItems"
        @input="handleInput"
      >
      </ripa-radio-group>
    </template>

    <template>
      <ripa-form-header
        class="tw-mt-8"
        title="Perceived LGBT"
        required
        subtitle="§999.226(a)(6)"
      >
      </ripa-form-header>

      <ripa-switch
        v-model="model.perceivedLgbt"
        label="Perceived as LGBT"
        :max-width="200"
        @input="handleInput"
      ></ripa-switch>
    </template>
  </div>
</template>

<script>
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaRadioGroup from '@/components/atoms/RipaRadioGroup'
import RipaSwitch from '@/components/atoms/RipaSwitch'
import { GENDERS } from '@/constants/form'

export default {
  name: 'ripa-gender',

  components: {
    RipaFormHeader,
    RipaRadioGroup,
    RipaSwitch,
  },

  data() {
    return {
      valid: true,
      genderItems: GENDERS,
      viewModel: {
        perceivedGender: this.value?.perceivedGender || null,
        perceivedLgbt: this.value?.perceivedLgbt || false,
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
      this.updatePerceivedLgbtModel()
      this.$emit('input', this.viewModel)
    },

    updatePerceivedLgbtModel() {
      if (
        this.viewModel.perceivedGender === 3 ||
        this.viewModel.perceivedGender === 4
      ) {
        this.viewModel.perceivedLgbt = true
      }
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
