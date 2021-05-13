import StoryRouter from 'storybook-vue-router'
import RipaConfirmation from '@/components/molecules/RipaConfirmation'
import { routesData } from '../data/routes'

export default {
  title: 'Molecules/RipaConfirmation',
  component: RipaConfirmation,
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
  components: { RipaConfirmation },
  template:
    '<div class="tw-p-4 tw-mt-4"><ripa-confirmation></ripa-confirmation></div>',
})
