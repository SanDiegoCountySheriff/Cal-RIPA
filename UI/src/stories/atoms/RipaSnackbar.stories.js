import { action } from '@storybook/addon-actions'
import RipaSnackbar from '@/components/atoms/RipaSnackbar'

export default {
  title: 'Atoms/RipaSnackbar',
  component: RipaSnackbar,
  parameters: {},
}

export const autoClose = () => ({
  components: { RipaSnackbar },
  data() {
    return {
      snackbarText: 'Snackbar text will go here',
      snackbarVisible: true,
    }
  },
  template:
    '<div class="tw-p-4 tw-mt-4"><ripa-snackbar :text="snackbarText" v-model="snackbarVisible" multi-line></ripa-snackbar></div>',
})

export const viewOption = () => ({
  components: { RipaSnackbar },
  data() {
    return {
      snackbarText: 'Snackbar text will go here',
      snackbarVisible: true,
    }
  },
  methods: {
    handleViewClick: action('view button clicked'),
  },
  template:
    '<div class="tw-p-4 tw-mt-4"><ripa-snackbar :text="snackbarText" v-model="snackbarVisible" multi-line :auto-close="false" view-button-visible :on-view="handleViewClick"></ripa-snackbar></div>',
})
