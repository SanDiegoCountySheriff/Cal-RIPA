import RipaFormWrapper from '@/components/organisms/RipaFormWrapper'

export default {
  title: 'Organisms/RipaFormWrapper',
  component: RipaFormWrapper,
  parameters: {},
}

export const basic = () => ({
  components: { RipaFormWrapper },
  data() {
    return {}
  },
  template: '<ripa-form-wrapper></ripa-form-wrapper>',
})
