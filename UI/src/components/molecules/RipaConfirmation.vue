<template>
  <v-card class="ripa-confirmation mx-auto my-12" flat max-width="650">
    <v-card-title class="tw-uppercase">RIPA Stops</v-card-title>

    <v-card-text>
      <div>Thank you for your submission.</div>
      <div class="tw-my-4 tw-flex tw-justify-center">
        <v-btn color="secondary" to="/stops">My Stops</v-btn>
        <v-btn color="primary" class="tw-ml-4" @click="onStartNew"
          >Start New</v-btn
        >
      </div>

      <v-divider></v-divider>

      <template v-if="anyStopsWithErrors">
        <v-divider></v-divider>
        <div class="tw-mb-4">
          <v-container fluid>
            <v-row no-gutters dense>
              <v-col cols="12" sm="12" class="tw-mt-4 tw-text-center">
                <v-btn color="error" @click="handleOpenStopsWithErrors">
                  STOPS WITH ERRORS
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </div>
      </template>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'ripa-confirmation',

  computed: {
    anyStopsWithErrors() {
      return this.stopsWithErrors.length > 0
    },
  },

  methods: {
    handleOpenStopsWithErrors() {
      if (this.onOpenStopsWithErrors) {
        this.onOpenStopsWithErrors()
      }
    },
  },

  props: {
    stopsWithErrors: {
      type: Array,
      default: () => [],
    },
    onStartNew: {
      type: Function,
      default: () => {},
    },
    onOpenStopsWithErrors: {
      type: Function,
      default: () => {},
    },
  },
}
</script>

<style lang="scss">
.ripa-confirmation {
  border: 1px solid #ccc !important;
}
</style>
