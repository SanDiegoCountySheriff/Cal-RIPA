<template>
  <v-form ref="stepForm" lazy-validation>
    <ripa-form-summary
      v-model="model"
      edit-buttons
      :api-stop="apiStop"
      :admin-editing="adminEditing"
      :on-edit-agency-questions="onEditAgencyQuestions"
      :on-edit-stop="onEditStop"
      :on-edit-person="onEditPerson"
      :on-delete-person="onDeletePerson"
    ></ripa-form-summary>

    <v-spacer></v-spacer>

    <template v-if="adminEditing">
      <ripa-edit-stop-explanation v-model="model"></ripa-edit-stop-explanation>
      <ripa-override-pii
        :api-stop="apiStop"
        v-model="model"
      ></ripa-override-pii>
    </template>

    <v-spacer></v-spacer>

    <template v-if="!isFormValid">
      <ripa-alert alert-type="error">
        Oops, you may have missed something! Please review your selections
        above.
      </ripa-alert>
    </template>

    <template v-if="!adminEditing">
      <div class="tw-flex tw-mt-4 tw-justify-center">
        <v-btn
          outlined
          color="primary"
          class="tw-mt-2"
          @click="handleAddPerson"
        >
          <v-icon left> mdi-plus </v-icon>
          Add Person
        </v-btn>
      </div>
    </template>

    <div class="tw-flex tw-mt-8 tw-justify-center">
      <v-btn outlined color="error" class="tw-mr-2" @click="handleCancel">
        Cancel
      </v-btn>
      <v-btn color="primary" @click="handleSubmit"> Submit </v-btn>
    </div>
  </v-form>
</template>

<script>
import RipaAlert from '@/components/atoms/RipaAlert'
import RipaFormStepMixin from '@/components/mixins/RipaFormStepMixin'
import RipaFormSummary from '@/components/molecules/RipaFormSummary'
import RipaEditStopExplanation from '@/components/molecules/RipaEditStopExplanation'
import RipaOverridePii from '@/components/molecules/RipaOverridePii'

export default {
  name: 'ripa-form-step7',

  mixins: [RipaFormStepMixin],

  components: {
    RipaAlert,
    RipaFormSummary,
    RipaEditStopExplanation,
    RipaOverridePii,
  },

  props: {
    apiStop: {
      type: Object,
      default: () => {},
    },
  },
}
</script>
