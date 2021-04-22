import RipaUserTemplate from '@/components/templates/RipaUserTemplate'

export default {
  title: 'Templates/RipaUserTemplate',
  component: RipaUserTemplate,
  parameters: {},
}

export const basic = () => ({
  components: { RipaUserTemplate },
  data() {
    return {}
  },
  template: '<ripa-user-template></ripa-user-template>',
})
