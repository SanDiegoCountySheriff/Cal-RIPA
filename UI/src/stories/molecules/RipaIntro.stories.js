import StoryRouter from 'storybook-vue-router'
import RipaIntro from '@/components/molecules/RipaIntro'
import { routesData } from '../data/routes'

export default {
  title: 'Molecules/RipaIntro',
  component: RipaIntro,
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
  components: { RipaIntro },
  template: '<div class="tw-p-4 tw-mt-4"><ripa-intro></ripa-intro></div>',
})
