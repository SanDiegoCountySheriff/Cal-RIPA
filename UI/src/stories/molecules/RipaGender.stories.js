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
        perceivedGender: {},
    }
  },
  template:
    '<div><ripa-gender v-model="perceivedGender"></ripa-gender>{{perceivedGender}}</div>',
})
