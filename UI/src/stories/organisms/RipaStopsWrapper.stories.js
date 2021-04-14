import RipaStopsWrapper from '@/components/organisms/RipaStopsWrapper'

export default {
  title: 'Organisms/RipaStopsWrapper',
  component: RipaStopsWrapper,
  parameters: {},
}

export const basic = () => ({
  components: { RipaStopsWrapper },
  data() {
    return {
      stops: [],
    }
  },
  template: '<ripa-stops-wrapper :stops="stops"></ripa-stops-wrapper>',
})
