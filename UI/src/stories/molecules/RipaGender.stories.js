import RipaGender from '@/components/molecules/RipaGender'

export default {
  title: 'Molecules/RipaGender',
  component: RipaGender,
  parameters: {},
}

export const basic = () => ({
  components: { RipaGender },
  data() {
    return {
      stop: {},
    }
  },
  template: '<div><ripa-gender v-model="stop"></ripa-gender>{{stop}}</div>',
})
