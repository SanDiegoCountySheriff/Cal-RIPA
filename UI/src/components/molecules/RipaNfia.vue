<template>
  <div>
    <ripa-form-header title="Mark Record as NFIA"> </ripa-form-header>
    <v-container>
      <v-row no-gutters>
        <v-col>
          Mark as "No Further Information Available"
          <v-dialog v-model="dialog" max-width="600">
            <template #activator="{ on, attrs }">
              <v-btn x-small icon v-on="on" v-bind="attrs">
                <v-icon>mdi-information-slab-circle-outline</v-icon>
              </v-btn>
            </template>

            <v-card>
              <v-card-title>Mark a record NFIA</v-card-title>
              <v-card-text>
                The user should use this flag only for those records that have
                been submitted with errors before and the user wants to indicate
                that the records cannot be updated any further. That will change
                the status of the record to "7" or "No further information
                available" and no further updates will be applied/accepted to
                the record.</v-card-text
              >
              <v-card-actions>
                <v-btn color="primary" text @click="dialog = !dialog">
                  Close
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
        <v-col cols="12" sm="12">
          <ripa-switch
            v-model="model.nfia"
            label="NFIA"
            :max-width="250"
            @input="handleInput"
          ></ripa-switch>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaSwitch from '@/components/atoms/RipaSwitch'

export default {
  name: 'ripa-nfia',

  components: { RipaFormHeader, RipaSwitch },

  data() {
    return {
      viewModel: this.value,
      dialog: false,
    }
  },

  computed: {
    model: {
      get() {
        return this.viewModel
      },
    },
  },

  methods: {
    handleInput() {
      this.$emit('input', this.viewModel)
    },
  },

  props: {
    value: {
      type: Object,
      required: true,
    },
  },
}
</script>
