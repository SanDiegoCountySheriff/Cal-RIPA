import StoryRouter from 'storybook-vue-router'
import RipaUserContainer from './RipaUserContainer'
import { routesData } from '../data/routes'

export default {
  title: 'Pages/RipaUserContainer',
  component: RipaUserContainer,
  parameters: {},
  decorators: [
    StoryRouter(
      {},
      {
        routes: routesData,
        initialEntry: '/user',
      },
    ),
  ],
}

export const basic = () => ({
  components: { RipaUserContainer },
  template: '<ripa-user-container ></ripa-user-container>',
})
