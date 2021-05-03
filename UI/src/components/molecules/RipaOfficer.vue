<template>
  <div class="ripa-officer tw-pb-8">
    <template v-if="!toggle || (toggle && model.officer.editOfficer)">
      <ripa-form-header
        title="Officer Years of Experience"
        required
        subtitle="§999.226(a)(15)"
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
              @input="handleInput"
            ></ripa-switch>
          </template>
        </v-col>
      </v-row>

      <template v-if="!toggle || (toggle && model.officer.editOfficer)">
        <v-row no-gutters>
          <v-col cols="12" sm="12" md="6">
            <div class="tw-mr-4">
              <ripa-number-input
                v-model="model.officer.yearsExperience"
                label="Years of Experience"
                :rules="yearsExperienceRules"
                @input="handleInput"
              >
              </ripa-number-input>
            </div>
          </v-col>

          <v-col cols="12" sm="12" md="6">
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
import RipaNumberInput from '@/components/atoms/RipaNumberInput'
import RipaSelect from '@/components/atoms/RipaSelect'
import RipaSwitch from '@/components/atoms/RipaSwitch'
import RipaTextInput from '@/components/atoms/RipaTextInput'
import { OFFICER_ASSIGNMENTS } from '@/constants/form'

export default {
  name: 'ripa-officer',

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
      yearsExperienceRules: [v => !!v || 'Years experience is required'],
      assignmentRules: [v => !!v || 'An assignment is required'],
      assignmentItems: OFFICER_ASSIGNMENTS,
      viewModel: {
        officer: {
          editOfficer: this.value?.officer?.editOfficer || false,
          yearsExperience: this.value?.officer?.yearsExperience || null,
          assignment: this.value?.officer?.assignment || null,
          otherType: this.value?.officer?.otherType || null,
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
      this.updateOtherTypeModel()
      this.$emit('input', this.viewModel)
    },

    updateOtherTypeModel() {
      if (this.viewModel.officer.assignment !== 10) {
        this.viewModel.officer.otherType = null
      }
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
