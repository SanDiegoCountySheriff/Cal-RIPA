<template>
  <div class="ripa-officer tw-pb-8">
    <template v-if="!toggle || (toggle && model.officer.editOfficer)">
      <ripa-form-header
        title="Officer Years of Experience"
        required
        subtitle="§999.226(a)(15)"
        class="tw-mb-4"
        :on-open-statute="onOpenStatute"
      >
      </ripa-form-header>
    </template>

    <v-container>
      <v-row no-gutters>
        <v-col cols="12" sm="12">
          <template v-if="toggle">
            <ripa-switch
              v-model="model.officer.editOfficer"
              label="Edit Officer Experience and Assignment"
              :max-width="350"
              :rules="editOfficerRules"
              @input="handleInput"
            ></ripa-switch>
          </template>
        </v-col>
      </v-row>

      <template v-if="!toggle || (toggle && model.officer.editOfficer)">
        <v-row no-gutters>
          <v-col cols="12" sm="12" md="6">
            <div class="md:tw-mr-4">
              <ripa-text-input
                v-model="model.officer.startDate"
                label="Start Date"
                disabled
              >
              </ripa-text-input>
            </div>
          </v-col>

          <v-col cols="12" sm="12" md="6">
            <div>
              <ripa-number-input
                v-model="model.officer.yearsExperience"
                label="Years of Experience"
                disabled
              >
              </ripa-number-input>
            </div>
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col cols="12" sm="12">
            <ripa-select
              v-model="model.officer.assignment"
              label="Officer Assignment"
              :items="assignmentItems"
              itemText="name"
              itemValue="value"
              :rules="assignmentRules"
              @input="handleInput"
            >
            </ripa-select>
          </v-col>
        </v-row>

        <template v-if="model.officer.assignment === 10">
          <v-row no-gutters>
            <v-col cols="12" sm="12">
              <ripa-text-input
                v-model="model.officer.otherType"
                label="Other Type"
                :rules="otherTypeRules"
                @input="handleInput"
              >
              </ripa-text-input>
            </v-col>
          </v-row>
        </template>
      </template>
    </v-container>
  </div>
</template>

<script>
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaFormMixin from '@/components/mixins/RipaFormMixin'
import RipaNumberInput from '@/components/atoms/RipaNumberInput'
import RipaSelect from '@/components/atoms/RipaSelect'
import RipaSwitch from '@/components/atoms/RipaSwitch'
import RipaTextInput from '@/components/atoms/RipaTextInput'
import { OFFICER_ASSIGNMENTS } from '@/constants/form'

export default {
  name: 'ripa-officer',

  mixins: [RipaFormMixin],

  components: {
    RipaFormHeader,
    RipaNumberInput,
    RipaSelect,
    RipaSwitch,
    RipaTextInput,
  },

  data() {
    return {
      valid: true,
      yearsExperienceRules: [
        v => !!v || 'Years of Experience is required',
        v =>
          (v >= 1 && v <= 50) ||
          'Years of Experience must be between 1 and 50 Years',
      ],
      assignmentRules: [v => !!v || 'An assignment is required'],
      assignmentItems: OFFICER_ASSIGNMENTS,
      viewModel: this.loadModel(this.value),
    }
  },

  computed: {
    model: {
      get() {
        return this.viewModel
      },
    },

    editOfficerRules() {
      const checked = this.viewModel.officer.editOfficer
      const yearsExperience = this.viewModel.officer.yearsExperience
      const assignment = this.viewModel.officer.assignment
      return [
        checked ||
          (!checked && yearsExperience > 0 && assignment !== null) ||
          'Years experience and an assignment is required',
      ]
    },

    otherTypeRules() {
      const assignment = this.viewModel.officer.assignment
      const otherType = this.viewModel.officer.otherType
      if (assignment !== 10) {
        return []
      }

      return [
        (otherType && otherType.length > 0) || 'Other type is required',
        v => (v || '').length <= 60 || 'Max 60 characters',
        v => (v || '').length >= 5 || 'Min 5 characters',
      ]
    },
  },

  methods: {
    handleInput() {
      this.updateOtherTypeModel()
      this.$emit('input', this.viewModel)
    },

    updateOtherTypeModel() {
      if (this.viewModel.officer.assignment !== 10) {
        this.viewModel.officer.otherType = null
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
    toggle: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
