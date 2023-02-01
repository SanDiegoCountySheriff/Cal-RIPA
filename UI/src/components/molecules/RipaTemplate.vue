<template>
  <v-card class="mx-auto" max-width="500" flat>
    <v-card-text>
      <div class="tw-mt-4 tw-mb-4">
        <v-container fluid>
          <ripa-alert alert-type="error" v-if="!isOnline && isAuthenticated">
            You are currently offline. You may create stops but MUST log in to
            submit them.
          </ripa-alert>
          <ripa-alert alert-type="error" v-if="!isOnline && !isAuthenticated">
            You are currently offline. You must log in to create stops.
          </ripa-alert>
          <v-row no-gutters dense>
            <v-col cols="12" sm="12" class="tw-mt-4 tw-text-center">
              <v-btn
                :disabled="disableButtons"
                color="primary"
                @click="handleDefaultTemplate"
              >
                BASIC STOP
              </v-btn>
            </v-col>
          </v-row>

          <v-row>
            <v-col
              cols="12"
              sm="6"
              class="tw-text-center"
              v-for="(template, index) in stopTemplates"
              :key="index"
            >
              <v-btn
                :disabled="disableButtons"
                outlined
                color="primary"
                @click="handleDynamicTemplates(template.displayName)"
              >
                {{ template.displayName }}
              </v-btn>
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
        <a
          href="https://oag.ca.gov/sites/all/files/agweb/pdfs/ripa/stop-data-reg-final-text-110717.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          these regulations
        </a>
        on November 7, 2017. For more information please see the
        <a
          href="https://oag.ca.gov/ab953/regulations"
          target="_blank"
          rel="noopener noreferrer"
        >
          AG's Website </a
        >.
      </p>
      <p v-if="displayReportingEmail">
        If you experience issues please contact us at
        <a @click="handleEmail">{{ reportingEmailAddress }}</a>
      </p>
      <v-divider></v-divider>
    </v-card-text>
  </v-card>
</template>

<script>
import RipaAlert from '@/components/atoms/RipaAlert.vue'

export default {
  name: 'ripa-template',

  components: {
    RipaAlert,
  },

  inject: [
    'displayReportingEmail',
    'reportingEmailAddress',
    'isOnline',
    'isAuthenticated',
    'stopTemplates',
  ],

  methods: {
    handleDynamicTemplates(name) {
      if (this.onOpenTemplate) {
        this.onOpenTemplate(name)
      }
    },

    handleDefaultTemplate() {
      if (this.onOpenTemplate) {
        this.onOpenTemplate()
      }
    },

    handleEmail() {
      if (this.reportingEmailAddress) {
        window.open(`mailto:${this.reportingEmailAddress}`)
      }
    },
  },

  props: {
    onOpenTemplate: {
      type: Function,
      required: true,
    },
    disableButtons: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
