import RipaAppBar from '@/components/molecules/RipaAppBar'

export default {
  title: 'Molecules/RipaAppBar',
  component: RipaAppBar,
  parameters: {},
}

export const basic = () => ({
  components: { RipaAppBar },
  template: '<ripa-app-bar></ripa-app-bar>',
})
