import StoryRouter from 'storybook-vue-router'
import RipaFormContainer from './RipaFormContainer'
import { routesData } from '../data/routes'

export default {
  title: 'Pages/RipaFormContainer',
  component: RipaFormContainer,
  parameters: {},
  decorators: [
    StoryRouter(
      {},
      {
        routes: routesData,
        initialEntry: '/form',
      },
    ),
  ],
}

export const basic = () => ({
  components: { RipaFormContainer },
  template: '<ripa-form-container ></ripa-form-container>',
})
