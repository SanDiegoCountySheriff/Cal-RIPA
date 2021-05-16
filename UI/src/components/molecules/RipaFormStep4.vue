<template>
  <v-form ref="stepForm" lazy-validation>
    <ripa-actions-taken
      v-model="model"
      :loading-pii="loadingPii"
    ></ripa-actions-taken>
    <ripa-contraband v-model="model"></ripa-contraband>

    <v-spacer></v-spacer>

    <template v-if="!isFormValid">
      <ripa-alert alert-type="error">
        Oops, you may have missed something! Please review your selections
        above.
      </ripa-alert>
    </template>

    <div class="tw-flex tw-mt-8 tw-justify-center">
      <v-btn outlined color="primary" class="tw-mr-2" @click="handleBack">
        Back
      </v-btn>
      <v-btn outlined color="error" class="tw-mr-2" @click="handleCancel">
        Cancel
      </v-btn>
      <v-btn color="primary" @click="handleStep3Next"> Next </v-btn>
    </div>
  </v-form>
</template>

<script>
import RipaActionsTaken from '@/components/molecules/RipaActionsTaken'
import RipaAlert from '@/components/atoms/RipaAlert'
import RipaContraband from '@/components/molecules/RipaContraband'
import RipaFormStepMixin from '@/components/mixins/RipaFormStepMixin'

export default {
  name: 'ripa-form-step4',

  mixins: [RipaFormStepMixin],

  components: {
    RipaActionsTaken,
    RipaAlert,
    RipaContraband,
  },

  methods: {
    handleStep3Next() {
      const piiFound =
        this.viewModel.actionsTaken?.basisForSearchPiiFound || false
      if (piiFound) {
        this.$confirm({
          title: 'Confirm Cancel',
          message: `This page contains personally identifying information. Are you sure you want to continue?`,
          button: {
            no: 'No',
            yes: 'Yes',
          },
          callback: confirm => {
            if (confirm) {
              this.handleNext()
            }
          },
        })
      } else {
        this.handleNext()
      }
    },
  },

  props: {
    statutes: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
