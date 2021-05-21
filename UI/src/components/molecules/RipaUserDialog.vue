<template>
  <v-dialog
    v-model="modelDialog"
    max-width="650px"
    :light="getLight"
    :dark="getDark"
  >
    <v-card>
      <v-card-title>
        <span>Manage User</span>
      </v-card-title>

      <v-card-text>
        <ripa-officer v-model="modelStop"></ripa-officer>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="handleClose"> Cancel </v-btn>
        <v-btn color="blue darken-1" text @click="handleSave"> Save </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import RipaOfficer from '@/components/molecules/RipaOfficer'

export default {
  name: 'ripa-user-dialog',

  components: {
    RipaOfficer,
  },

  data() {
    return {
      viewModelDialog: this.showDialog,
      viewModelStop: this.stop,
    }
  },

  computed: {
    modelDialog: {
      get() {
        return this.viewModelDialog
      },
      set(newValue) {
        if (!newValue) {
          if (this.onClose) {
            this.onClose()
          }
        }
        this.viewModelDialog = newValue
      },
    },

    modelStop: {
      get() {
        return this.viewModelStop
      },
      set(newValue) {
        this.viewModelStop = newValue
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

    handleSave() {
      if (this.onSave) {
        this.onSave(this.viewModelStop)
      }
      this.handleClose()
    },
  },

  watch: {
    showDialog(newValue) {
      this.viewModelDialog = newValue
    },
    stop(newValue) {
      this.viewModelStop = newValue
    },
  },

  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    stop: {
      type: Object,
      default: () => {},
    },
    onClose: {
      type: Function,
      default: () => {},
    },
    onSave: {
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
