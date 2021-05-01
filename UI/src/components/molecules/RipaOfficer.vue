<template>
  <div class="ripa-officer tw-pb-8">
    <template v-if="toggle">
      <ripa-switch
        v-model="model.editOfficer"
        label="Edit Officer Experience and Assignment"
        :max-width="330"
        @input="handleInput"
      ></ripa-switch>
    </template>

    <template v-if="!toggle || (toggle && model.editOfficer)">
      <ripa-form-header title="Officer Years of Experience" required>
      </ripa-form-header>

      <ripa-number-input
        v-model="model.yearsExperience"
        label="Years of Experience"
        :rules="yearsExperienceRules"
        @input="handleInput"
      >
      </ripa-number-input>

      <ripa-select
        v-model="model.assignment"
        label="Officer Assignment"
        :items="assignmentItems"
        itemText="name"
        itemValue="value"
        :rules="assignmentRules"
        @input="handleInput"
      >
      </ripa-select>

      <template v-if="model.assignment === 10">
        <ripa-text-input
          v-model="model.otherrType"
          label="Other Type"
          @input="handleInput"
        >
        </ripa-text-input>
      </template>
    </template>
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
        editOfficer: this.value?.editOfficer || false,
        yearsExperience: this.value?.yearsExperience || null,
        assignment: this.value?.assignment || null,
        otherType: this.value?.otherType || null,
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
      if (this.viewModel.assignment !== 10) {
        this.viewModel.otherType = null
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
