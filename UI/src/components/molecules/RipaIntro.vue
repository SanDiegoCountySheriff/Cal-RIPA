<template>
  <v-card class="mx-auto" max-width="650">
    <v-card-title class="tw-uppercase">Ripa Stops</v-card-title>

    <v-card-text>
      <div>Initiate a new Stop:</div>
      <div class="tw-mt-4 tw-mb-4">
        <v-container fluid>
          <v-row no-gutters dense>
            <v-col cols="12" sm="6" class="tw-text-center">
              <v-btn outlined color="primary" @click="handleMotorTemplate"
                >Motor/Traffic Template</v-btn
              >
            </v-col>
            <v-col cols="12" sm="6" class="tw-text-center">
              <v-btn
                outlined
                color="primary"
                @click="handleProbationTemplate"
                class="tw-mt-4 sm:tw-mt-0"
                >Probation Contact Template</v-btn
              >
            </v-col>
          </v-row>
          <v-row no-gutters dense>
            <v-col cols="12" sm="12" class="tw-mt-4 tw-text-center">
              <v-btn color="primary" @click="handleDefaultTemplate"
                >Default Template</v-btn
              >
            </v-col>
          </v-row>
        </v-container>
      </div>
      <v-divider></v-divider>
      <div class="tw-mt-4">About this App:</div>
      <p>
        The Racial and Identity Profiling Act of 2015 (AB 953) requires state
        and local law enforcement agencies, to collect data regarding stops of
        individuals, including perceived demographic information on the person
        stopped, and to report this data to the California Attorney General's
        (AG) Office.
      </p>
      <p>
        The AG’s Office has adopted
        <a href="https://ripademo.azurewebsites.net/regulation"
          >these regulations</a
        >
        on November 7, 2017. For more information please see the
        <a href="https://oag.ca.gov/ab953/regulations">AG's Website</a>.
      </p>
      <v-divider></v-divider>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'ripa-intro',

  methods: {
    handleMotorTemplate() {
      if (this.onTemplate) {
        this.onTemplate('motor')
      }
    },

    handleProbationTemplate() {
      if (this.onTemplate) {
        this.onTemplate('probation')
      }
    },

    handleDefaultTemplate() {
      if (this.onTemplate) {
        this.onTemplate()
      }
    },
  },

  props: {
    onTemplate: {
      type: Function,
      default: () => {},
    },
  },
}
</script>
