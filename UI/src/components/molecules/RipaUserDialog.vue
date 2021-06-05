<template>
  <v-dialog v-model="modelDialog" max-width="650px" persistent>
    <v-card>
      <v-card-title>
        <span>Manage User</span>
      </v-card-title>

      <v-card-text>
        <v-form ref="dialogForm" lazy-validation>
          <ripa-user
            v-model="modelUser"
            :is-invalid-user="isInvalidUser"
          ></ripa-user>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <template v-if="!isInvalidUser">
          <v-btn color="blue darken-1" text @click="handleClose">
            Cancel
          </v-btn>
        </template>
        <v-btn color="blue darken-1" text @click="handleSave"> Save </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import RipaUser from '@/components/molecules/RipaUser'

export default {
  name: 'ripa-user-dialog',

  components: {
    RipaUser,
  },

  data() {
    return {
      isFormValid: false,
      viewModelDialog: this.showDialog,
      viewModelUser: this.user,
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

    modelUser: {
      get() {
        return this.viewModelUser
      },
      set(newValue) {
        this.viewModelUser = newValue
      },
    },
  },

  methods: {
    handleClose() {
      this.isFormValid = this.$refs.dialogForm.validate()
      if (!this.isFormValid) {
        return
      }
      if (this.onClose) {
        this.onClose()
      }
    },

    handleSave() {
      this.isFormValid = this.$refs.dialogForm.validate()
      if (!this.isFormValid) {
        return
      }
      if (this.onSave) {
        this.onSave(this.viewModelUser)
      }
      this.handleClose()
    },
  },

  watch: {
    showDialog(newValue) {
      this.viewModelDialog = newValue
    },
    user(newValue) {
      this.viewModelUser = newValue
    },
  },

  props: {
    isInvalidUser: {
      type: Boolean,
      default: false,
    },
    showDialog: {
      type: Boolean,
      default: false,
    },
    user: {
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
