<template>
  <div class="ripa-gender tw-pb-8">
    <template class="tw-mb-4">
      <ripa-form-header
        title="Perceived Gender"
        required
        subtitle="§999.226(a)(5)"
      >
      </ripa-form-header>

      <v-container>
        <v-row no-gutters>
          <v-col cols="12" sm="12">
            <template v-if="isGenderListVisible">
              <ripa-radio-group
                v-model="model.person.perceivedGender"
                :items="genderItems"
                :rules="genderRules"
                @input="handleInput"
              >
              </ripa-radio-group>
            </template>
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
      >
      </ripa-form-header>

      <v-container>
        <v-row no-gutters>
          <v-col cols="12" sm="12">
            <ripa-switch
              v-model="model.person.perceivedLgbt"
              label="Perceived as LGBT"
              :max-width="200"
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
      valid: true,
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

    genderRules() {
      if (!this.isGenderListVisible) {
        return []
      }

      return [v => !!v || 'A gender is required']
    },

    isGenderListVisible() {
      const gc = this.viewModel.person?.genderNonconforming || false
      return !gc
    },
  },

  methods: {
    handleInput() {
      this.updateGenderModel()
      this.updatePerceivedLgbtModel()
      this.$emit('input', this.viewModel)
    },

    updateGenderModel() {
      const gc = this.viewModel.person?.genderNonconforming || false
      if (gc) {
        this.viewModel.person.perceivedGender = null
      }
    },

    updatePerceivedLgbtModel() {
      this.viewModel.person.perceivedLgbt =
        this.viewModel.person.perceivedGender === 3 ||
        this.viewModel.person.perceivedGender === 4
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
