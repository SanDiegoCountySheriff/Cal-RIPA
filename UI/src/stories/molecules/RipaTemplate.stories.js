import StoryRouter from 'storybook-vue-router'
import RipaTemplate from '@/components/molecules/RipaTemplate'
import { routesData } from '../data/routes'

export default {
  title: 'Molecules/RipaTemplate',
  component: RipaTemplate,
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
  components: { RipaTemplate },
  template: '<div class="tw-p-4 tw-mt-4"><ripa-template></ripa-template></div>',
})
