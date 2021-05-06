<template>
  <v-form ref="stepForm" lazy-validation>
    <ripa-form-summary
      v-model="model"
      :on-edit-stop="onEditStop"
      :on-edit-person="onEditPerson"
      :on-delete-person="onDeletePerson"
    ></ripa-form-summary>
    <v-spacer></v-spacer>

    <template v-if="!isFormValid">
      <v-alert type="error">
        Oops, you may have missed something! Please review your selections
        above.
      </v-alert>
    </template>

    <div class="tw-flex tw-mt-4 tw-justify-center">
      <v-btn outlined color="primary" class="tw-mr-2" @click="handleAddPerson">
        <v-icon left> mdi-plus </v-icon>
        Add Person
      </v-btn>
    </div>
    <div class="tw-flex tw-mt-8 tw-justify-center">
      <v-btn outlined color="error" class="tw-mr-2" @click="handleCancel">
        Cancel
      </v-btn>
      <v-btn color="primary" @click="handleSubmit"> Submit </v-btn>
    </div>
  </v-form>
</template>

<script>
import RipaFormStepMixin from '@/components/mixins/RipaFormStepMixin'
import RipaFormSummary from '@/components/molecules/RipaFormSummary'

export default {
  name: 'ripa-form-step6',

  mixins: [RipaFormStepMixin],

  components: {
    RipaFormSummary,
  },
}
</script>
