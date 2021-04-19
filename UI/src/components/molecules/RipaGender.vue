<template>
  <div class="ripa-gender tw-p-4">
    <template class="tw-mb-4"> 
        <ripa-form-header
        title="Perceived Gender"
        required
        subtitle="§999.226(a)(5)">
        </ripa-form-header>

        <ripa-radio-group
            v-model="model.perceivedGender"
            :items="genderItems"
            @input="handleInput">
        </ripa-radio-group>

        <ripa-checkbox
            v-model="model.checkbox"
            cbLabel="Gender Nonconforming"
            @input="handleInput">
        </ripa-checkbox>
    </template>


    <template>
        <ripa-form-header
        title="Perceived LGBT"
        required
        subtitle="§999.226(a)(6)">
        </ripa-form-header>

        <ripa-radio-group
            v-model="model.perceivedLgbt"  
            :items="lgbtItems"
            @input="handleInput">
        </ripa-radio-group>
    </template>
  </div>
</template>

<script>
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaRadioGroup from '@/components/atoms/RipaRadioGroup'
import RipaCheckbox from '@/components/atoms/RipaCheckbox'


export default {
  name: 'ripa-stop-reason',

  components: {
    RipaFormHeader,
    RipaRadioGroup,
    RipaCheckbox
  },

  data() {
    return {
      valid: true,
      checkbox: this.value.checkbox || false,
      genderItems: [
        { name: 'Male', value: '1' },
        { name: 'Female', value: '2' },
        { name: 'Transgender Male', value: '3' },
        { name: 'Transgender Female', value: '4' }
      ],
    
      lgbtItems: [
        { name: 'Yes', value: 'A' },
        { name: 'No', value: 'B' },
      ],

      viewModel: {
        perceivedGender: this.value.perceivedGender || null,
        perceivedLgbt: this.value.perceivedLgbt || null,
        checkbox: this.value.checkbox || []
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
    if (this.viewModel.perceivedGender === 3 || 4 ) {
        this.viewModel.perceivedLgbt = 'A'
      }
      this.$emit('input', this.viewModel)
    },
  },

  props: {
    value: {
      type: Object,
      default: () => {},
    },
    statutes: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
