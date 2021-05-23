<template>
  <v-dialog
    v-model="model"
    max-width="650px"
    :light="getLight"
    :dark="getDark"
    persistent
  >
    <v-card>
      <v-card-title>
        <span>Statute §999.226(a)(2)</span>
      </v-card-title>

      <v-card-text>
        <div class="ripa-statute">
          <h1>Article 3. Data Elements To Be Reported</h1>
          <h2>§ 999.226</h2>
          <ul>
            <li>
              (a) The data elements regarding stops that shall be collected by
              peace officers subject to this chapter are defined as follows:
              <ul>
                <li>
                  (1) “ORI number” is the data element that refers to the
                  reporting agency’s Originating Agency Identifier, a unique
                  identification code number assigned by the Federal Bureau of
                  Investigation.
                </li>
                <li>(2) Date, Time, and Duration of Stop</li>
                <ul>
                  <li>
                    (A) “Date of Stop” refers to the year, month, and day when
                    the stop occurred. It shall be recorded as the date on which
                    the stop began. If the stop extends over two days (e.g., if
                    a stop began at 2330 hours on January 1st and concluded at
                    0030 hours on January 2nd), the “Date of Stop” should be
                    recorded as the first date (in this example, January 1st).
                  </li>
                  <li>
                    (B) “Time of Stop” refers to the approximate time that the
                    stop began and shall be recorded using a 24-hour clock
                    (i.e., military time).
                  </li>
                  <li>
                    (C) “Duration of Stop” is the approximate length of the stop
                    measured from the time the reporting officer, or any other
                    officer, first detains or, if no initial detention, first
                    searches the stopped person until the time when the person
                    is free to leave or taken into physical custody. In
                    reporting this data element, the officer shall enter the
                    approximate length of the stop in minutes.
                    <ul>
                      <li>
                        1. Example: Officer A stops a vehicle for suspected
                        driving under the influence (DUI) at 1300 hours. Officer
                        B then arrives at the scene 15 minutes later and
                        conducts a field sobriety test on the driver, who fails
                        the tests. Officer B then arrests and takes the driver
                        into custody at 1345. “Duration of Stop” would be
                        reported as 45 minutes.
                      </li>
                      <li>
                        2. Example: Officer A begins interviewing witnesses to a
                        robbery at 1100 hours. After approximately 30 minutes of
                        interviews with different witnesses, Officer A observes
                        what looks like a switchblade knife protruding from the
                        waistband of one of the witnesses. Officer A then
                        searches that person. “Duration of Stop” is measured
                        from the time the person is searched (1130 hours) and
                        not the time during which the officer began interviewing
                        the witnesses to the robbery (1100 hours).
                      </li>
                    </ul>
                  </li>
                </ul>
              </ul>
            </li>
          </ul>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="handleClose"> Cancel </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ripa-statute-dialog',

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

    getLight() {
      return this.$vuetify.theme.dark
    },

    getDark() {
      return !this.$vuetify.theme.dark
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
    showDialog: {
      type: Boolean,
      default: false,
    },
    onClose: {
      type: Function,
      default: () => {},
    },
  },
}
</script>

<style lang="scss">
.v-dialog:not(.v-dialog--fullscreen) {
  max-height: 600px !important;
}
</style>
