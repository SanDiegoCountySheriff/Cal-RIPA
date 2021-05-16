import RipaSwitch from '@/components/atoms/RipaSwitch'

export default {
  title: 'Atoms/RipaSwitch',
  component: RipaSwitch,
  parameters: {},
}

export const basic = () => ({
  components: { RipaSwitch },
  data() {
    return {
      getLabelText: 'no',
    }
  },
  template:
    '<div class="tw-p-4 tw-mt-4"><ripa-switch v-model="getLabelText"></ripa-switch>{{getLabelText}}</div>',
})
