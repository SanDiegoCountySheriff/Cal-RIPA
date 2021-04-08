import Vuetify from 'vuetify'
import { addDecorator, addParameters } from '@storybook/vue'
import '@/plugins/storybook'
import '@/plugins/tailwind'
import '@mdi/font/css/materialdesignicons.css'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import '../src/assets/tailwind.css'

addParameters({
  viewport: {
    viewports: INITIAL_VIEWPORTS,
  },
})

const vuetifyOptions = {
  icons: {
    iconfont: 'mdi',
  },
}

addDecorator(() => ({
  vuetify: new Vuetify(vuetifyOptions),
  template: '<v-app><v-main fluid><story/></v-main></v-app>',
}))

addParameters({
  a11y: {
    element: '#root',
    config: {},
    options: {},
    manual: true,
  },
})

addParameters({
  options: {
    storySort: {
      order: [
        'Design',
        'Pages',
        'Templates',
        'Organisms',
        'Molecules',
        'Atoms',
      ],
    },
  },
})
