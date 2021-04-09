import RipaUserContainer from './RipaUserContainer'

export default {
  title: 'Pages/RipaUserContainer',
  component: RipaUserContainer,
  parameters: {},
}

export const basic = () => ({
  components: { RipaUserContainer },
  template: '<ripa-user-container ></ripa-user-container>',
})
