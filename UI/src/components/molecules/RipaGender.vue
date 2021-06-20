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
              @input="handleInput"
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
      viewModel: this.updateModel(this.value),
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
      const valid = gender || checked

      return [
        valid || 'A gender is required or Gender Nonconforming must be checked',
      ]
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
    handleInput() {
      this.updatePerceivedLgbtModel()
      this.$emit('input', this.viewModel)
    },
  },

  watch: {
    value(newVal) {
      this.viewModel = this.updateModel(newVal)
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
