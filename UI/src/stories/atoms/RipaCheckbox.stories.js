import RipaCheckbox from '@/components/atoms/RipaCheckbox'

export default {
  title: 'Atoms/RipaCheckbox',
  component: RipaCheckbox,
  parameters: {},
}

export const basic = () => ({
  components: { RipaCheckbox },
  data() {
    return {
      selection: false,
    }
  },
  template:
    '<div class="tw-p-4 tw-mt-4"><ripa-checkbox v-model="selection" label="Warning (verbal or written)"></ripa-checkbox>{{selection}}</div>',
})
