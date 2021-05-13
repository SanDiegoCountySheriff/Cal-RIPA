import StoryRouter from 'storybook-vue-router'
import RipaOfficerStopsContainer from './RipaOfficerStopsContainer'
import { routesData } from '../data/routes'

export default {
  title: 'Pages/RipaOfficerStopsContainer',
  component: RipaOfficerStopsContainer,
  parameters: {},
  decorators: [
    StoryRouter(
      {},
      {
        routes: routesData,
        initialEntry: '/stops',
      },
    ),
  ],
}

export const admin = () => ({
  components: { RipaOfficerStopsContainer },
  template:
    '<ripa-officer-stops-container admin></ripa-officer-stops-container>',
})

export const nonAdmin = () => ({
  components: { RipaOfficerStopsContainer },
  template: '<ripa-officer-stops-container></ripa-officer-stops-container>',
})
