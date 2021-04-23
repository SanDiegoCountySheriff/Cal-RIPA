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
  dellLat7202: {
    name: 'Dell Lat 7202',
    styles: {
      width: '1366px',
      height: '768px',
    },
  },
  dellLat7212: {
    name: 'Dell Lat 7212',
    styles: {
      width: '1920px',
      height: '1080px',
    },
  },
  dellLat7220: {
    name: 'Dell Lat 7220',
    styles: {
      width: '1920px',
      height: '1080px',
    },
  },
}

addParameters({
  viewport: {
    viewports: { ...INITIAL_VIEWPORTS, ...customViewports },
    defaultViewport: 'dellLat7202',
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
