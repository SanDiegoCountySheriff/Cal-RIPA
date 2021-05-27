<template>
  <div class="ripa-gender tw-pb-8">
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
              :items="genderItems"
              clear-selection
              @input="handleInput"
            >
            </ripa-radio-group>
          </v-col>

          <v-col cols="12" sm="12">
            <ripa-switch
              v-model="model.person.genderNonconforming"
              label="Gender Nonconforming"
              :max-width="250"
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
import RipaFormMixin from '@/components/mixins/RipaFormMixin'
import RipaRadioGroup from '@/components/atoms/RipaRadioGroup'
import RipaSwitch from '@/components/atoms/RipaSwitch'
import { GENDERS } from '@/constants/form'

export default {
  name: 'ripa-gender',

  mixins: [RipaFormMixin],

  components: {
    RipaFormHeader,
    RipaRadioGroup,
    RipaSwitch,
  },

  data() {
    return {
      genderItems: GENDERS,
      viewModel: this.loadModel(this.value),
    }
  },

  computed: {
    model: {
      get() {
        return this.viewModel
      },
    },

    isPerceivedLgbtDisabled() {
      return (
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

    updatePerceivedLgbtModel() {
      if (
        this.viewModel.person.perceivedGender === 3 ||
        this.viewModel.person.perceivedGender === 4
      ) {
        this.viewModel.person.perceivedLgbt = true
      }
    },
  },

  watch: {
    value(newVal) {
      this.viewModel = this.loadModel(newVal)
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
