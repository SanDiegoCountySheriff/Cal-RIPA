import Vuetify from 'vuetify'
import { addDecorator, addParameters } from '@storybook/vue'
import '@/plugins/storybook'
import '@/plugins/tailwind'
import '@mdi/font/css/materialdesignicons.css'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'

const customViewports = {
  panasonicCf33: {
    name: 'Panasonic CF-33',
    styles: {
      width: '2160px',
      height: '1440px',
    },
  },
  7202: {
    name: '7202',
    styles: {
      width: '1366px',
      height: '768px',
    },
  },
  7212: {
    name: '7212',
    styles: {
      width: '1920px',
      height: '1080px',
    },
  },
  7220: {
    name: '7212',
    styles: {
      width: '1920px',
      height: '1080px',
    },
  },
}

addParameters({
  viewport: {
    viewports: { ...INITIAL_VIEWPORTS, ...customViewports },
    defaultViewport: '7202',
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
