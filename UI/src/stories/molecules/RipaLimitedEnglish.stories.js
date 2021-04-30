import RipaLimitedEnglish from '@/components/molecules/RipaLimitedEnglish'

export default {
  title: 'Molecules/RipaLimitedEnglish',
  component: RipaLimitedEnglish,
  parameters: {},
}

export const basic = () => ({
  components: { RipaLimitedEnglish },
  data() {
    return {
      noEnglish: {},
    }
  },
  template:
    '<div><ripa-limited-english v-model="noEnglish"></ripa-limited-english>{{noEnglish}}</div>',
})
