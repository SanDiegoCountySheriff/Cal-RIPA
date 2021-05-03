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
            <ripa-radio-group
              v-model="model.person.perceivedGender"
              :items="genderItems"
              @input="handleInput"
            >
            </ripa-radio-group>
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
        person: {
          perceivedGender: this.value?.person?.perceivedGender || null,
          perceivedLgbt: this.value?.person?.perceivedLgbt || false,
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
  },

  methods: {
    handleInput() {
      this.updatePerceivedLgbtModel()
      this.$emit('input', this.viewModel)
    },

    updatePerceivedLgbtModel() {
      this.viewModel.person.perceivedLgbt =
        this.viewModel.person.perceivedGender === 3 ||
        this.viewModel.person.perceivedGender === 4
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
