<template>
  <v-card class="mx-auto my-12" max-width="600">
    <v-card-title>RIPA Stop App</v-card-title>

    <v-card-text>
      <div>Thank you for your submission.</div>
      <div class="tw-mt-4 tw-mb-4">
        <v-container fluid>
          <v-row no-gutters dense>
            <v-col cols="12" sm="6" class="tw-text-center">
              <v-btn color="secondary" to="/stops">My Stops</v-btn>
            </v-col>
            <v-col cols="12" sm="6" class="tw-text-center">
              <v-btn color="primary" to="/form" class="tw-mt-4 sm:tw-mt-0"
                >Start New</v-btn
              >
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'ripa-confirmation',
}
</script>
