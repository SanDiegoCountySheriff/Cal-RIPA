import RipaHomeContainer from './RipaHomeContainer'

export default {
  title: 'Pages/RipaHomeContainer',
  component: RipaHomeContainer,
  parameters: {},
}

export const basic = () => ({
  components: { RipaHomeContainer },
  template: '<ripa-home-container ></ripa-home-container>',
})
