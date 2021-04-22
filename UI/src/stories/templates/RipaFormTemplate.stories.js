import RipaFormTemplate from '@/components/templates/RipaFormTemplate'

export default {
  title: 'Templates/RipaFormTemplate',
  component: RipaFormTemplate,
  parameters: {},
}

export const basic = () => ({
  components: { RipaFormTemplate },
  data() {
    return {}
  },
  template: '<ripa-form-template></ripa-form-template>',
})
