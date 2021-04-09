import StoryRouter from 'storybook-vue-router'
import RipaAdminContainer from './RipaAdminContainer'
import { routesData } from '../data/routes'

export default {
  title: 'Pages/RipaAdminContainer',
  component: RipaAdminContainer,
  parameters: {},
  decorators: [
    StoryRouter(
      {},
      {
        routes: routesData,
        initialEntry: '/admin',
      },
    ),
  ],
}

export const admin = () => ({
  components: { RipaAdminContainer },
  template: '<ripa-admin-container admin></ripa-admin-container>',
})

export const nonAdmin = () => ({
  components: { RipaAdminContainer },
  template: '<ripa-admin-container></ripa-admin-container>',
})
