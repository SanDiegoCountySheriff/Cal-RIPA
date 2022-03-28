<template>
  <v-dialog v-model="showDialog" max-width="350px" persistent>
    <v-card>
      <v-card-title>{{ title }}</v-card-title>
      <v-spacer></v-spacer>
      <v-card-subtitle>{{ subtitle }}</v-card-subtitle>
      <v-card-actions class="tw-mb-4 tw-w-full">
        <v-spacer></v-spacer>
        <div class="tw-flex tw-justify-end tw-w-full">
          <v-btn color="blue darken-1" class="tw-mr-4" @click="handleCancel">
            No
          </v-btn>
          <v-btn
            color="blue darken-1"
            class="tw-w-24"
            @click="handleConfirm"
            :disabled="isConfirmDisabled"
          >
            Yes
          </v-btn>
        </div>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ripa-confirm-dialog',

  data() {
    return {
      isConfirmDisabled: false,
    }
  },

  methods: {
    handleCancel() {
      this.onClose()
    },

    handleConfirm() {
      this.isConfirmDisabled = true
      this.viewModel = false
      this.onConfirm()
      this.handleCancel()
    },
  },

  watch: {
    showDialog(value) {
      this.showDialog = value
      if (value) {
        this.isConfirmDisabled = false
      }
    },
  },

  props: {
    title: {
      type: String,
      default: '',
    },
    subtitle: {
      type: String,
      default: '',
    },
    showDialog: {
      type: Boolean,
      default: false,
    },
    onClose: {
      type: Function,
      required: true,
    },
    onConfirm: {
      type: Function,
      required: true,
    },
  },
}
</script>
