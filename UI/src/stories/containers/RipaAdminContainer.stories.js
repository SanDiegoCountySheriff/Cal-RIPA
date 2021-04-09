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

export const basic = () => ({
  components: { RipaAdminContainer },
  template: '<ripa-admin-container ></ripa-admin-container>',
})
