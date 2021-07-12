<template>
  <v-dialog v-model="model" max-width="1000px">
    <v-card>
      <v-card-title>
        <span>Stops With Errors</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <ripa-stops-with-errors-grid
                :items="stopsWithErrors"
                :on-edit-stop="handleEditStop"
              ></ripa-stops-with-errors-grid>
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
import RipaStopsWithErrorsGrid from '@/components/molecules/RipaStopsWithErrorsGrid'

export default {
  name: 'ripa-stops-with-errors-dialog',

  components: {
    RipaStopsWithErrorsGrid,
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
    handleEditStop(internalId) {
      if (this.onEditStop) {
        this.onEditStop(internalId)
      }
    },
  },

  watch: {
    showDialog(newValue) {
      this.viewModel = newValue
    },
  },

  props: {
    stopsWithErrors: {
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
    onEditStop: {
      type: Function,
      default: () => {},
    },
  },
}
</script>
