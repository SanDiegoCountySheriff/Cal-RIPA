<template>
  <v-card class="mx-auto my-12" max-width="600">
    <v-card-title class="tw-uppercase">Ripa Stop App</v-card-title>

    <v-card-text>
      <div>Thank you for your submission.</div>
      <div class="tw-mt-6 tw-mb-4 tw-flex tw-justify-center">
        <v-btn color="secondary" to="/stops">My Stops</v-btn>
        <v-btn color="primary" to="/form" class="tw-ml-4">Start New</v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'ripa-confirmation',
}
</script>
