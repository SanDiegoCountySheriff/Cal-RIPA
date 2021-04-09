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

export const admin = () => ({
  components: { RipaHomeContainer },
  template: '<ripa-home-container admin></ripa-home-container>',
})

export const nonAdmin = () => ({
  components: { RipaHomeContainer },
  template: '<ripa-home-container></ripa-home-container>',
})
