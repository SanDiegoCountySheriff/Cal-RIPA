<template>
  <v-dialog v-model="model" max-width="800px">
    <v-card>
      <v-card-title>
        <span>JSON Viewer</span>
      </v-card-title>

      <v-card-text>
        <v-tabs v-model="tab">
          <v-tab>API Stop</v-tab>
          <v-tab>RIPA Full Stop</v-tab>
          <v-tab>RIPA Stop</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item>
            <ripa-json-viewer :data="apiStop"></ripa-json-viewer>
          </v-tab-item>
          <v-tab-item>
            <ripa-json-viewer :data="fullStop"></ripa-json-viewer>
          </v-tab-item>
          <v-tab-item>
            <ripa-json-viewer :data="stop"></ripa-json-viewer>
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="handleClose"> Close </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import RipaJsonViewer from '@/components/molecules/RipaJsonViewer'

export default {
  name: 'ripa-json-viewer-dialog',

  components: {
    RipaJsonViewer,
  },

  data() {
    return {
      viewModel: this.showDialog,
      tab: 0,
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
    stop: {
      type: Object,
      default: () => {},
    },
    fullStop: {
      type: Object,
      default: () => {},
    },
    apiStop: {
      type: Object,
      default: () => {},
    },
    showDialog: {
      type: Boolean,
      default: false,
    },
    onClose: {
      type: Function,
      required: true,
    },
  },
}
</script>
