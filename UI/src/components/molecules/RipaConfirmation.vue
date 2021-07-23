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
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'ripa-confirmation',

  props: {
    onStartNew: {
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
