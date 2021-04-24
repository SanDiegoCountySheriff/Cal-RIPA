<template>
  <v-card class="mx-auto" max-width="900" outlined>
    <v-card-text>
      <template v-if="stepIndex <= 5">
        <v-stepper v-model="stepIndex">
          <v-stepper-header>
            <v-stepper-step :complete="stepIndex > 1" step="1">
              Step 1
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="stepIndex > 2" step="2">
              Step 2
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="stepIndex > 3" step="3">
              Step 3
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="stepIndex > 4" step="4">
              Step 4
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="5"> Step 5 </v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="1">
              <v-card
                class="mb-12"
                color="grey lighten-1"
                height="200px"
              ></v-card>

              <v-btn color="primary" @click="stepIndex = 2"> Continue </v-btn>

              <v-btn text> Cancel </v-btn>
            </v-stepper-content>

            <v-stepper-content step="2">
              <v-card
                class="mb-12"
                color="grey lighten-1"
                height="200px"
              ></v-card>

              <v-btn color="primary" @click="stepIndex = 3"> Continue </v-btn>

              <v-btn text> Cancel </v-btn>
            </v-stepper-content>

            <v-stepper-content step="3">
              <v-card
                class="mb-12"
                color="grey lighten-1"
                height="200px"
              ></v-card>

              <v-btn color="primary" @click="stepIndex = 4"> Continue </v-btn>

              <v-btn text> Cancel </v-btn>
            </v-stepper-content>

            <v-stepper-content step="4">
              <v-card
                class="mb-12"
                color="grey lighten-1"
                height="200px"
              ></v-card>

              <v-btn color="primary" @click="stepIndex = 5"> Continue </v-btn>

              <v-btn text> Cancel </v-btn>
            </v-stepper-content>

            <v-stepper-content step="5">
              <v-card
                class="mb-12"
                color="grey lighten-1"
                height="200px"
              ></v-card>

              <v-btn color="primary" @click="stepIndex = 6"> Submit </v-btn>

              <v-btn text> Cancel </v-btn>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </template>
      <template v-if="stepIndex === 6">
        <ripa-confirmation></ripa-confirmation>
      </template>
    </v-card-text>
  </v-card>
</template>

<script>
import RipaConfirmation from '@/components/molecules/RipaConfirmation'

export default {
  name: 'ripa-form-wrapper',

  components: {
    RipaConfirmation,
  },

  data() {
    return {
      stepIndex: 1,
    }
  },
}
</script>
