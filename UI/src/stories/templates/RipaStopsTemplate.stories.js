import RipaStopsTemplate from '@/components/templates/RipaStopsTemplate'

export default {
  title: 'Templates/RipaStopsTemplate',
  component: RipaStopsTemplate,
  parameters: {},
}

export const basic = () => ({
  components: { RipaStopsTemplate },
  data() {
    return {
      stops: [],
    }
  },
  template: '<ripa-stops-template :stops="stops"></ripa-stops-template>',
})
