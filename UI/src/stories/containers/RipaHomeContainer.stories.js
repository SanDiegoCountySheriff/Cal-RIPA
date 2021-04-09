import StoryRouter from 'storybook-vue-router'
import RipaHomeContainer from './RipaHomeContainer'
import { routesData } from '../data/routes'

export default {
  title: 'Pages/RipaHomeContainer',
  component: RipaHomeContainer,
  parameters: {},
  decorators: [
    StoryRouter(
      {},
      {
        routes: routesData,
        initialEntry: '/',
      },
    ),
  ],
}

export const basic = () => ({
  components: { RipaHomeContainer },
  template: '<ripa-home-container ></ripa-home-container>',
})
