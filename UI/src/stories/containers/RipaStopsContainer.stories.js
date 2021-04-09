import RipaStopsContainer from './RipaStopsContainer'

export default {
  title: 'Pages/RipaStopsContainer',
  component: RipaStopsContainer,
  parameters: {},
}

export const basic = () => ({
  components: { RipaStopsContainer },
  template: '<ripa-stops-container ></ripa-stops-container>',
})
