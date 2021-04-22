import RipaTextArea from '@/components/atoms/RipaTextArea'

export default {
  title: 'Atoms/RipaTextArea',
  component: RipaTextArea,
  parameters: {},
}

export const basic = () => ({
  components: { RipaTextArea },
  data() {
    return {
      selection: null,
    }
  },
  template:
    '<div class="tw-p-4 tw-mt-4"><ripa-text-area v-model="selection" label="Text Area" hint="Text area hint goes here."></ripa-text-area>{{selection}}</div>',
})
