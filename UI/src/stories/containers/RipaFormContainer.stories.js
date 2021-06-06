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
        initialEntry: '/',
      },
    ),
  ],
}

export const admin = () => ({
  components: { RipaFormContainer },
  template: '<ripa-form-container admin></ripa-form-container>',
})

export const nonAdmin = () => ({
  components: { RipaFormContainer },
  template: '<ripa-form-container></ripa-form-container>',
})
