<template>
  <div class="ripa-gender tw-pb-4">
    <template class="tw-mb-4">
      <ripa-form-header
        title="Perceived Gender"
        required
        subtitle="§999.226(a)(5)"
        :on-open-statute="onOpenStatute"
      >
      </ripa-form-header>

      <v-container>
        <v-row no-gutters>
          <v-col cols="12" sm="12">
            <ripa-radio-group
              v-model="model.person.perceivedGender"
              :disabled="disabled"
              :items="genderItems"
              :rules="genderRules"
              clear-selection
              @input="handleGenderInput"
            >
            </ripa-radio-group>
          </v-col>

          <v-col cols="12" sm="12">
            <ripa-switch
              v-model="model.person.genderNonconforming"
              label="Gender Nonconforming"
              :disabled="disabled"
              :max-width="250"
              :rules="genderRules"
              @input="handleInput"
            ></ripa-switch>
          </v-col>
        </v-row>
      </v-container>
    </template>

    <template>
      <ripa-form-header
        class="tw-mt-8"
        title="Perceived LGBT"
        required
        subtitle="§999.226(a)(6)"
        :on-open-statute="onOpenStatute"
      >
      </ripa-form-header>

      <v-container>
        <v-row no-gutters>
          <v-col cols="12" sm="12">
            <ripa-switch
              v-model="model.person.perceivedLgbt"
              label="Perceived as LGBT"
              :max-width="200"
              :disabled="isPerceivedLgbtDisabled"
              @input="handleInput"
            ></ripa-switch>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </div>
</template>

<script>
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaModelMixin from '@/components/mixins/RipaModelMixin'
import RipaRadioGroup from '@/components/atoms/RipaRadioGroup'
import RipaSwitch from '@/components/atoms/RipaSwitch'
import { GENDERS } from '@/constants/form'

export default {
  name: 'ripa-gender',

  mixins: [RipaModelMixin],

  components: {
    RipaFormHeader,
    RipaRadioGroup,
    RipaSwitch,
  },

  data() {
    return {
      genderItems: GENDERS,
      viewModel: this.syncModel(this.value),
    }
  },

  computed: {
    model: {
      get() {
        return this.viewModel
      },
    },

    genderRules() {
      const gender = this.viewModel.person.perceivedGender
      const checked = this.viewModel.person.genderNonconforming
      const isValid = gender !== null || checked

      return [isValid !== false || 'A gender is required']
    },

    isPerceivedLgbtDisabled() {
      return (
        this.disabled ||
        this.viewModel.person.perceivedGender === 3 ||
        this.viewModel.person.perceivedGender === 4
      )
    },
  },

  methods: {
    handleGenderInput() {
      if (
        this.viewModel.person.perceivedGender === 1 ||
        this.viewModel.person.perceivedGender === 2
      ) {
        this.viewModel.person.perceivedLgbt = false
      }
      this.handleInput()
    },

    handleInput() {
      this.updateModel()
      this.$emit('input', this.viewModel)
    },
  },

  watch: {
    value(newVal) {
      this.viewModel = this.syncModel(newVal)
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
