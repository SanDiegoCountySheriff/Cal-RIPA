import RipaNumberInput from '@/components/atoms/RipaNumberInput'

export default {
  title: 'Atoms/RipaNumberInput',
  component: RipaNumberInput,
  parameters: {},
}

export const basic = () => ({
  components: { RipaNumberInput },
  data() {
    return {
      selection: 12,
    }
  },
  template:
    '<div class="tw-p-4 tw-mt-4"><ripa-number-input v-model="selection" label="Number Input" hint="Number input hint goes here."></ripa-number-input>{{selection}}</div>',
})
