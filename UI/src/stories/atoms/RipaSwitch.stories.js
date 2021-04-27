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
      selection: '',
    }
  },
  template:
    '<div"><ripa-switch v-model="selection"></ripa-switch>{{selection}}</div>',
})
