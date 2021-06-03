import RipaAgencyQuestions from '@/components/molecules/RipaAgencyQuestions'

export default {
  title: 'Molecules/RipaAgencyQuestions',
  component: RipaAgencyQuestions,
  parameters: {},
}

export const basic = () => ({
  components: { RipaAgencyQuestions },
  data() {
    return {
      stop: {
        agencyQuestions: [],
      },
    }
  },
  template:
    '<div><ripa-agency-questions v-model="stop"></ripa-agency-questions>{{stop}}</div>',
})
