import RipaUserWrapper from '@/components/organisms/RipaUserWrapper'

export default {
  title: 'Organisms/RipaUserWrapper',
  component: RipaUserWrapper,
  parameters: {},
}

export const basic = () => ({
  components: { RipaUserWrapper },
  data() {
    return {}
  },
  template: '<ripa-user-wrapper></ripa-user-wrapper>',
})
