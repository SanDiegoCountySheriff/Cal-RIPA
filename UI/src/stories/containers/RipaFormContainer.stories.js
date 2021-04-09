import RipaFormContainer from './RipaFormContainer'

export default {
  title: 'Pages/RipaFormContainer',
  component: RipaFormContainer,
  parameters: {},
}

export const basic = () => ({
  components: { RipaFormContainer },
  template: '<ripa-form-container ></ripa-form-container>',
})
