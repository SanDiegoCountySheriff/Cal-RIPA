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
    '<div"><ripa-switch v-model="getLabelText"></ripa-switch>{{getLabelText}}</div>',
})
