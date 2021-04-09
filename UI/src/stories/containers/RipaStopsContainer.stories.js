import StoryRouter from 'storybook-vue-router'
import RipaStopsContainer from './RipaStopsContainer'
import { routesData } from '../data/routes'

export default {
  title: 'Pages/RipaStopsContainer',
  component: RipaStopsContainer,
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

export const basic = () => ({
  components: { RipaStopsContainer },
  template: '<ripa-stops-container ></ripa-stops-container>',
})
