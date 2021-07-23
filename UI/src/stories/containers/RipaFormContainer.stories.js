import StoryRouter from 'storybook-vue-router'
import RipaFormContainer from './RipaFormContainer'
import { routesData } from '../data/routes'
import RipaEditStopMixin from '@/components/mixins/RipaEditStopMixin'
import { editApiStop1 } from '../data/formStop'

export default {
  title: 'Pages/RipaFormContainer',
  component: RipaFormContainer,
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
  components: { RipaFormContainer },
  template: '<ripa-form-container admin></ripa-form-container>',
  mounted() {
    this.$vuetify.theme.dark = true
  },
})

export const editAdmin = () => ({
  mixins: [RipaEditStopMixin],
  components: { RipaFormContainer },
  data() {
    return {
      apiStop: editApiStop1,
      admin: false,
    }
  },
  methods: {
    handleEdit() {
      this.handleEditStopByAdmin(this.apiStop, 'https://www.google.com')
      window.location.reload()
    },
  },
  template:
    '<div><v-btn text @click="handleEdit">Admin Edit</v-btn><ripa-form-container :admin="admin"></ripa-form-container></div>',
  mounted() {
    this.$vuetify.theme.dark = true
  },
})
