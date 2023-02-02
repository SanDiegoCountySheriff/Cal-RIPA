<template>
  <div>
    <div v-if="loading" class="text-center">
      <v-progress-circular indeterminate color="primary" :size="150" :width="3">
        Submitting Stop <br />
        Please Wait
      </v-progress-circular>
    </div>
    <v-card v-else class="ripa-confirmation mx-auto my-12" flat max-width="650">
      <v-card-title class="tw-uppercase">RIPA Stops</v-card-title>

      <v-card-text v-if="isAuthenticated">
        <div>Thank you for your submission.</div>
        <div class="tw-my-4 tw-flex tw-justify-center">
          <v-btn color="secondary" to="/stops">My Stops</v-btn>
          <v-btn color="primary" class="tw-ml-4" @click="onStartNew"
            >Start New</v-btn
          >
        </div>
      </v-card-text>

      <v-card-text v-else>
        <div>You must be logged in to create more stops</div>
        <div class="tw-my-4 tw-flex tw-justify-center">
          <v-btn color="primary" @click="onGoHome">Home</v-btn>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'ripa-confirmation',

  methods: {
    onGoHome() {
      this.$emit('go-home')
    },
  },

  inject: ['isAuthenticated', 'loading'],

  props: {
    onStartNew: {
      type: Function,
      required: true,
    },
  },
}
</script>

<style lang="scss">
.ripa-confirmation {
  border: 1px solid #ccc !important;
}
</style>
