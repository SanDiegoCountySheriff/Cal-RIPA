import RipaAdminContainer from './RipaAdminContainer'

export default {
  title: 'Pages/RipaAdminContainer',
  component: RipaAdminContainer,
  parameters: {},
}

export const basic = () => ({
  components: { RipaAdminContainer },
  template: '<ripa-admin-container ></ripa-admin-container>',
})
