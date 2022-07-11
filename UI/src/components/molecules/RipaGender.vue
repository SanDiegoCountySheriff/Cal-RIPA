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
              @input="handleGenderInput"
            >
            </ripa-radio-group>
          </v-col>
        </v-row>
      </v-container>
    </template>

    <template>
      <ripa-form-header
        class="tw-mt-8"
        title="Perceived Sexual Orientation"
        required
        subtitle="§999.226(a)(6)"
        :on-open-statute="onOpenStatute"
      >
      </ripa-form-header>

      <v-container>
        <v-row no-gutters>
          <v-col cols="12" sm="12">
            <ripa-radio-group
              v-model="model.person.perceivedOrientation"
              :items="orientationItems"
              :rules="orientationRules"
              label="Perceived Sexual Orientation"
              :max-width="200"
              @input="handleInput"
            >
            </ripa-radio-group>
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
import { GENDERS, SEXUAL_ORIENTATIONS } from '@/constants/form'

export default {
  name: 'ripa-gender',

  mixins: [RipaModelMixin],

  components: {
    RipaFormHeader,
    RipaRadioGroup,
  },

  data() {
    return {
      genderItems: GENDERS.filter(item => !item.disabled),
      orientationItems: SEXUAL_ORIENTATIONS,
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
      const isValid = gender !== null

      return [isValid !== false || 'A gender is required']
    },

    orientationRules() {
      return [
        !!this.viewModel.person.perceivedOrientation ||
          'A perceived orientation is required',
      ]
    },
  },

  methods: {
    handleGenderInput() {
      if (
        this.viewModel.person.perceivedGender === 1 ||
        this.viewModel.person.perceivedGender === 2 ||
        this.viewModel.person.perceivedGender === 5 ||
        this.viewModel.person.perceivedGender === 6
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
