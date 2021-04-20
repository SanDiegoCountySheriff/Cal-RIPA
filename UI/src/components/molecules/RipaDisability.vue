<template>
  <div class="ripa-disability tw-p-4">
    <ripa-form-header
      title="Perceived or Known Disability"
      required
      subtitle="§999.226(a)(9)">
    </ripa-form-header>

    <ripa-check-group
        v-model="model.disability"
        :items="disabilityItems"
        @input="handleInput">
    </ripa-check-group>
  </div>
</template>

<script>
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaCheckGroup from '@/components/atoms/RipaCheckGroup'

export default {
  name: 'ripa-disability',

  components: {
    RipaFormHeader,
    RipaCheckGroup,
  },

  data() {
    return {
      valid: true,
      disabilityItems: [
        { name: 'None', value: '1' },
        { name: 'Deafness or difficulty hearing', value: '2' },
        { name: 'Speech impairment or limited use of language', value: '3' },
        { name: 'Blind or limited vision', value: '4' },
        { name: 'Mental health condition', value: '5' },
        { name: 'Intellectual or developmental disability, including dementia', value: '6' },
        { name: 'Other disability', value: '7' },
      ],
      viewModel: {
        disability: this.value.disability || [],
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
      this.$emit('input', this.viewModel)
    },
  },

  props: {
    value: {
      type: Object,
      default: () => {},
    },
    items: {
      type: Object,
      default: () => {},
    },
  },
}
</script>
