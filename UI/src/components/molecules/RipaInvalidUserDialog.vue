<template>
  <v-dialog v-model="model" max-width="400px" :light="getLight" :dark="getDark">
    <v-card>
      <v-card-title>
        <span>User Not Authorized</span>
      </v-card-title>

      <v-card-text>
        <p>You are not authorized to use this application.</p>
        <p>
          Please check with your administrator to ensure you have the correct
          permissions.
        </p>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ripa-invalid-user-dialog',

  data() {
    return {
      viewModel: this.showDialog,
    }
  },

  computed: {
    model: {
      get() {
        return this.viewModel
      },
      set(newValue) {
        if (!newValue) {
          if (this.onClose) {
            this.onClose()
          }
        }
        this.viewModel = newValue
      },
    },

    getLight() {
      return this.$vuetify.theme.dark
    },

    getDark() {
      return !this.$vuetify.theme.dark
    },
  },

  methods: {
    handleClose() {
      if (this.onClose) {
        this.onClose()
      }
    },
  },

  watch: {
    showDialog(newValue) {
      this.viewModel = newValue
    },
  },

  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    onClose: {
      type: Function,
      default: () => {},
    },
  },
}
</script>

<style lang="scss">
.v-dialog:not(.v-dialog--fullscreen) {
  max-height: 600px !important;
}
</style>
