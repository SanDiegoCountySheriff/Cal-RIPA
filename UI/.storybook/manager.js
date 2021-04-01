import { addons } from '@storybook/addons'
import ripaTheme from './theme'

addons.setConfig({
  isFullscreen: false,
  showNav: true,
  showPanel: false,
  panelPosition: 'right',
  sidebarAnimations: true,
  enableShortcuts: true,
  isToolshown: true,
  theme: ripaTheme,
  selectedPanel: undefined,
  initialActive: 'sidebar',
  showRoots: true,
})
