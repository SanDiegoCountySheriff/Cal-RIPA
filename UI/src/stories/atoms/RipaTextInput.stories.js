import RipaTextInput from '@/components/atoms/RipaTextInput'

export default {
  title: 'Atoms/RipaTextInput',
  component: RipaTextInput,
  parameters: {},
}

export const basic = () => ({
  components: { RipaTextInput },
  data() {
    return {
      selection: null,
    }
  },
  template:
    '<div class="tw-p-4 tw-mt-4"><ripa-text-input v-model="selection" label="Text Input" hint="Text input hint goes here."></ripa-text-input>{{selection}}</div>',
})
