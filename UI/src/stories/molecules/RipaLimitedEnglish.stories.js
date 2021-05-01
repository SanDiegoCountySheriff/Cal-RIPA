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
      stop: {},
    }
  },
  template:
    '<div><ripa-limited-english v-model="stop"></ripa-limited-english>{{stop}}</div>',
})
