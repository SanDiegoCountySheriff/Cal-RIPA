<template>
  <v-dialog v-model="model" max-width="1000px">
    <v-card>
      <v-card-title>
        <span>Stop Errors</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <ripa-stop-errors-grid
                :items="persons"
                :on-open-person="onOpenPerson"
              ></ripa-stop-errors-grid>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="handleClose"> Cancel </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import RipaStopErrorsGrid from '@/components/molecules/RipaStopErrorsGrid'

export default {
  name: 'ripa-stop-error-dialog',

  components: {
    RipaStopErrorsGrid,
  },

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
    persons: {
      type: Array,
      default: () => [],
    },
    showDialog: {
      type: Boolean,
      default: false,
    },
    onClose: {
      type: Function,
      default: () => {},
    },
    onOpenPerson: {
      type: Function,
      default: () => {},
    },
  },
}
</script>
