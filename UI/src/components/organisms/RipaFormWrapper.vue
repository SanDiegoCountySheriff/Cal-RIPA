<template>
  <div class="ripa-form-wrapper">
    <ripa-alert
      v-if="isDomainDataEmptyAdministrator"
      :alert-outlined="false"
      alert-type="error"
      >In order to finish initializing the RIPA application please upload CLEW
      data by
      <a
        class="text-decoration-underline white--text font-weight-bold"
        @click="$router.push('/admin/domains')"
        >clicking here</a
      >
      and uploading the CLEW spreadsheet including cities, schools and
      statutes.</ripa-alert
    >
    <ripa-alert
      v-if="isDomainDataEmptyUser"
      :alert-outlined="false"
      alert-type="error"
      >This application is currently not ready for data submission. Please
      contact your systems administrator before creating RIPA Stops.</ripa-alert
    >
    <v-card class="mx-auto" max-width="900" outlined v-if="!isApiUnavailable">
      <v-card-text>
        <template v-if="stepIndex == 0">
          <ripa-template
            v-on="$listeners"
            :disable-buttons="
              isDomainDataEmptyUser ||
              isDomainDataEmptyAdministrator ||
              !isAuthenticated
            "
          ></ripa-template>
        </template>

        <template
          v-if="stepIndex >= 1 && stepIndex <= 7 && model.stopVersion === 1"
        >
          <v-stepper v-model="stepIndex">
            <v-stepper-header>
              <v-stepper-step :complete="stepIndex > 1" step="1">
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="stepIndex > 2" step="2">
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="stepIndex > 3" step="3">
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="stepIndex > 4" step="4">
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="stepIndex > 5" step="5">
              </v-stepper-step>

              <v-divider></v-divider>

              <template v-if="anyAgencyQuestions">
                <v-stepper-step :complete="stepIndex > 6" step="6">
                </v-stepper-step>

                <v-divider></v-divider>
              </template>

              <v-stepper-step
                class="ripa-form-wrapper--summary-step-top"
                step="7"
              ></v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
              <v-stepper-content step="1">
                <template v-if="stepIndex === 1">
                  <ripa-form-step-1
                    v-model="model"
                    v-on="$listeners"
                    @on-next="handleNext"
                    @on-cancel="handleCancel"
                  ></ripa-form-step-1>
                </template>
              </v-stepper-content>

              <v-stepper-content step="2">
                <template v-if="stepIndex === 2">
                  <ripa-subheader
                    class="tw-text-right"
                    :text="getEditPersonText"
                    no-margins
                  ></ripa-subheader>

                  <ripa-form-step-2
                    v-model="model"
                    v-on="$listeners"
                    :disabled="isFormStep2Disabled"
                    :back-button-visible="getFormStep2BackButtonVisible"
                    @on-back="handleBack"
                    @on-next="handleNext"
                    @on-cancel="handleCancel"
                  ></ripa-form-step-2>
                </template>
              </v-stepper-content>

              <v-stepper-content step="3">
                <template v-if="stepIndex === 3">
                  <ripa-subheader
                    class="tw-text-right"
                    :text="getEditPersonText"
                    no-margins
                  ></ripa-subheader>

                  <ripa-form-step-3
                    v-model="model"
                    v-on="$listeners"
                    @on-back="handleBack"
                    @on-next="handleNext"
                    @on-cancel="handleCancel"
                  ></ripa-form-step-3>
                </template>
              </v-stepper-content>

              <v-stepper-content step="4">
                <template v-if="stepIndex === 4">
                  <ripa-subheader
                    class="tw-text-right"
                    :text="getEditPersonText"
                    no-margins
                  ></ripa-subheader>

                  <ripa-form-step-4
                    v-model="model"
                    v-on="$listeners"
                    @on-back="handleBack"
                    @on-next="handleNext"
                    @on-cancel="handleCancel"
                  ></ripa-form-step-4>
                </template>
              </v-stepper-content>

              <v-stepper-content step="5">
                <template v-if="stepIndex === 5">
                  <ripa-subheader
                    class="tw-text-right"
                    :text="getEditPersonText"
                    no-margins
                  ></ripa-subheader>

                  <ripa-form-step-5
                    v-model="model"
                    v-on="$listeners"
                    @on-back="handleBack"
                    @on-next="handleNext"
                    @on-cancel="handleCancel"
                  ></ripa-form-step-5>
                </template>
              </v-stepper-content>

              <v-stepper-content step="6">
                <template v-if="stepIndex === 6">
                  <ripa-form-step-6
                    v-model="model"
                    :back-button-visible="getFormStep6BackButtonVisible"
                    @on-back="handleBack"
                    @on-next="handleNext"
                    @on-cancel="handleCancel"
                  ></ripa-form-step-6>
                </template>
              </v-stepper-content>

              <v-stepper-content step="7">
                <template v-if="stepIndex === 7">
                  <ripa-form-step-7
                    v-model="model"
                    :api-stop="getApiStop"
                    @on-add-person="handleAddPerson"
                    @on-back="handleBack"
                    @on-copy-person="handleCopyPerson"
                    @on-delete-person="handleCallDeletePerson"
                    @on-edit-agency-questions="handleEditAgencyQuestions"
                    @on-edit-person="handleEditPerson"
                    @on-edit-stop="handleEditStop"
                    @on-submit="handleSubmit"
                    @on-cancel="handleCancel"
                    @handle-done="handleDone"
                  ></ripa-form-step-7>
                </template>
              </v-stepper-content>
            </v-stepper-items>

            <v-stepper-header>
              <v-stepper-step :complete="stepIndex > 1" step="1">
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="stepIndex > 2" step="2">
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="stepIndex > 3" step="3">
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="stepIndex > 4" step="4">
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="stepIndex > 5" step="5">
              </v-stepper-step>

              <v-divider></v-divider>

              <template v-if="anyAgencyQuestions">
                <v-stepper-step :complete="stepIndex > 6" step="6">
                </v-stepper-step>

                <v-divider></v-divider>
              </template>

              <v-stepper-step
                class="ripa-form-wrapper--summary-step-bottom"
                step="7"
              ></v-stepper-step>
            </v-stepper-header>
          </v-stepper>

          <template v-if="displayDebugger">
            <v-btn class="tw-mt-3" text @click="handleDebugger">Debugger</v-btn>
          </template>
        </template>

        <template
          v-if="stepIndex >= 1 && stepIndex <= 8 && model.stopVersion === 2"
        >
          <v-stepper v-model="stepIndex">
            <v-stepper-header>
              <v-stepper-step :complete="stepIndex > 1" step="1">
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="stepIndex > 2" step="2">
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="stepIndex > 3" step="3">
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="stepIndex > 4" step="4">
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="stepIndex > 5" step="5">
              </v-stepper-step>

              <v-divider></v-divider>
              <v-stepper-step :complete="stepIndex > 6" step="6">
              </v-stepper-step>

              <v-divider></v-divider>

              <template v-if="anyAgencyQuestions">
                <v-stepper-step :complete="stepIndex > 7" step="7">
                </v-stepper-step>

                <v-divider></v-divider>
              </template>

              <v-stepper-step
                class="ripa-form-wrapper--summary-step-top"
                step="8"
              ></v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
              <v-stepper-content step="1">
                <template v-if="stepIndex === 1">
                  <ripa-form-step-1
                    v-model="model"
                    v-on="$listeners"
                    @on-next="handleNext"
                    @on-cancel="handleCancel"
                  ></ripa-form-step-1>
                </template>
              </v-stepper-content>

              <v-stepper-content step="2">
                <template v-if="stepIndex === 2">
                  <ripa-subheader
                    class="tw-text-right"
                    :text="getEditPersonText"
                    no-margins
                  ></ripa-subheader>

                  <ripa-form-step-2
                    v-model="model"
                    v-on="$listeners"
                    :disabled="isFormStep2Disabled"
                    :back-button-visible="getFormStep2BackButtonVisible"
                    @on-back="handleBack"
                    @on-next="handleNext"
                    @on-cancel="handleCancel"
                  ></ripa-form-step-2>
                </template>
              </v-stepper-content>

              <v-stepper-content step="3">
                <template v-if="stepIndex === 3">
                  <ripa-subheader
                    class="tw-text-right"
                    :text="getEditPersonText"
                    no-margins
                  ></ripa-subheader>

                  <ripa-form-step-3
                    v-model="model"
                    v-on="$listeners"
                    @on-back="handleBack"
                    @on-next="handleNext"
                    @on-cancel="handleCancel"
                  ></ripa-form-step-3>
                </template>
              </v-stepper-content>

              <v-stepper-content step="4">
                <template v-if="stepIndex === 4">
                  <ripa-subheader
                    class="tw-text-right"
                    :text="getEditPersonText"
                    no-margins
                  ></ripa-subheader>

                  <ripa-form-step-4
                    v-model="model"
                    v-on="$listeners"
                    @on-back="handleBack"
                    @on-next="handleNext"
                    @on-cancel="handleCancel"
                  ></ripa-form-step-4>
                </template>
              </v-stepper-content>

              <v-stepper-content step="5">
                <template v-if="stepIndex === 5">
                  <ripa-subheader
                    class="tw-text-right"
                    :text="getEditPersonText"
                    no-margins
                  ></ripa-subheader>

                  <ripa-form-step-force-actions
                    v-model="model"
                    v-on="$listeners"
                    @on-back="handleBack"
                    @on-next="handleNext"
                    @on-cancel="handleCancel"
                  ></ripa-form-step-force-actions>
                </template>
              </v-stepper-content>

              <v-stepper-content step="6">
                <template v-if="stepIndex === 6">
                  <ripa-subheader
                    class="tw-text-right"
                    :text="getEditPersonText"
                    no-margins
                  ></ripa-subheader>

                  <ripa-form-step-5
                    v-model="model"
                    v-on="$listeners"
                    @on-back="handleBack"
                    @on-next="handleNext"
                    @on-cancel="handleCancel"
                  ></ripa-form-step-5>
                </template>
              </v-stepper-content>

              <v-stepper-content step="7">
                <template v-if="stepIndex === 7">
                  <ripa-form-step-6
                    v-model="model"
                    :back-button-visible="getFormStep6BackButtonVisible"
                    @on-back="handleBack"
                    @on-next="handleNext"
                    @on-cancel="handleCancel"
                  ></ripa-form-step-6>
                </template>
              </v-stepper-content>

              <v-stepper-content step="8">
                <template v-if="stepIndex === 8">
                  <ripa-form-step-7
                    v-model="model"
                    :api-stop="getApiStop"
                    @on-add-person="handleAddPerson"
                    @on-back="handleBack"
                    @on-copy-person="handleCopyPerson"
                    @on-delete-person="handleCallDeletePerson"
                    @on-edit-agency-questions="handleEditAgencyQuestions"
                    @on-edit-person="handleEditPerson"
                    @on-edit-stop="handleEditStop"
                    @on-submit="handleSubmit"
                    @on-cancel="handleCancel"
                    @handle-done="handleDone"
                  ></ripa-form-step-7>
                </template>
              </v-stepper-content>
            </v-stepper-items>

            <v-stepper-header>
              <v-stepper-step :complete="stepIndex > 1" step="1">
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="stepIndex > 2" step="2">
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="stepIndex > 3" step="3">
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="stepIndex > 4" step="4">
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="stepIndex > 5" step="5">
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="stepIndex > 6" step="6">
              </v-stepper-step>

              <v-divider></v-divider>

              <template v-if="anyAgencyQuestions">
                <v-stepper-step :complete="stepIndex > 7" step="7">
                </v-stepper-step>

                <v-divider></v-divider>
              </template>

              <v-stepper-step
                class="ripa-form-wrapper--summary-step-bottom"
                step="8"
              ></v-stepper-step>
            </v-stepper-header>
          </v-stepper>

          <template v-if="displayDebugger">
            <v-btn class="tw-mt-3" text @click="handleDebugger">Debugger</v-btn>
          </template>
        </template>

        <template v-if="stepIndex === confirmationStepIndex">
          <ripa-confirmation
            @on-start-new="handleStartNew"
            @go-home="onGoHome"
          ></ripa-confirmation>
        </template>
      </v-card-text>
    </v-card>

    <ripa-json-viewer-dialog
      :stop="model"
      :api-stop="getApiStop"
      :show-dialog="showDialog"
      @on-close="handleCloseDialog"
    ></ripa-json-viewer-dialog>

    <ripa-confirm-dialog
      :show-dialog="showCancelFormDialog"
      @on-close="handleCloseDialog"
      @on-confirm="handleCancelForm"
      title="Confirm Cancel"
      subtitle="Are you sure you want to cancel the form? You will lose all changes."
    >
    </ripa-confirm-dialog>

    <ripa-confirm-dialog
      :show-dialog="showCancelActionDialog"
      @on-close="handleCloseDialog"
      @on-confirm="handleCancelAction"
      title="Confirm Cancel"
      subtitle="Are you sure you want to cancel the action? You will lose all changes."
    >
    </ripa-confirm-dialog>

    <ripa-confirm-dialog
      :show-dialog="showDeletePersonDialog"
      @on-close="handleCloseDialog"
      @on-confirm="handleDeletePerson"
      title="Confirm Delete"
      subtitle="Are you sure you want to delete the person?"
    >
    </ripa-confirm-dialog>

    <ripa-confirm-dialog
      :show-dialog="showConfirmDialog"
      @on-close="handleCloseDialog"
      @on-confirm="handleConfirmSubmit"
      title="Confirm Submission"
      subtitle="Are you sure you want to submit the form?"
    >
    </ripa-confirm-dialog>
  </div>
</template>

<script>
import RipaAlert from '@/components/atoms/RipaAlert'
import RipaConfirmation from '@/components/molecules/RipaConfirmation'
import RipaConfirmDialog from '@/components/atoms/RipaConfirmDialog'
import RipaFormStep1 from '@/components/molecules/RipaFormStep1'
import RipaFormStep2 from '@/components/molecules/RipaFormStep2'
import RipaFormStep3 from '@/components/molecules/RipaFormStep3'
import RipaFormStep4 from '@/components/molecules/RipaFormStep4'
import RipaFormStep5 from '@/components/molecules/RipaFormStep5'
import RipaFormStep6 from '@/components/molecules/RipaFormStep6'
import RipaFormStep7 from '@/components/molecules/RipaFormStep7'
import RipaFormStepForceActions from '@/components/molecules/RipaFormStepForceActions'
import RipaJsonViewerDialog from '@/components/molecules/RipaJsonViewerDialog'
import RipaSubheader from '@/components/atoms/RipaSubheader'
import RipaTemplate from '@/components/molecules/RipaTemplate'
import { fullStopToApiStop, fullStopToApiStopV2 } from '@/utilities/stop'

export default {
  name: 'ripa-form-wrapper',

  components: {
    RipaAlert,
    RipaConfirmation,
    RipaConfirmDialog,
    RipaFormStep1,
    RipaFormStep2,
    RipaFormStep3,
    RipaFormStep4,
    RipaFormStep5,
    RipaFormStep6,
    RipaFormStep7,
    RipaFormStepForceActions,
    RipaJsonViewerDialog,
    RipaSubheader,
    RipaTemplate,
  },

  data() {
    return {
      stepIndex: this.formStepIndex,
      confirmationStepIndex: 9,
      stop: this.value,
      stepTrace: null,
      showDialog: false,
      showCancelFormDialog: false,
      showCancelActionDialog: false,
      showConfirmDialog: false,
      showDeletePersonDialog: false,
      deletePersonId: null,
    }
  },

  inject: [
    'isAdminEditing',
    'isAdmin',
    'beats',
    'countyCities',
    'nonCountyCities',
    'schools',
    'statutes',
    'displayDebugger',
    'formStepIndex',
    'fullStop',
    'isAuthenticated',
    'isOnlineAndAuthenticated',
    'isApiUnavailable',
  ],

  computed: {
    model: {
      get() {
        return this.value
      },
      set(newVal) {
        this.$emit('input', newVal)
      },
    },

    anyAgencyQuestions() {
      const questions = this.model?.agencyQuestions || []
      return questions.length > 0
    },

    getEditPersonText() {
      const personIndex = this.model.person?.index || 1
      return `Person: ${personIndex}`
    },

    getFormStep2BackButtonVisible() {
      return this.isCreateForm()
    },

    getFormStep6BackButtonVisible() {
      return this.isCreateForm()
    },

    getApiStop() {
      if (this.fullStop?.stopVersion) {
        let apiStop

        this.fullStop.stopVersion === 1
          ? (apiStop = fullStopToApiStop(
              this.isOnlineAndAuthenticated,
              this.fullStop,
              this.beats,
              this.countyCities,
              this.nonCountyCities,
              this.schools,
              this.statutes,
            ))
          : (apiStop = fullStopToApiStopV2(
              this.isOnlineAndAuthenticated,
              this.fullStop,
              this.beats,
              this.countyCities,
              this.nonCountyCities,
              this.schools,
              this.statutes,
            ))

        return apiStop
      }

      return {}
    },

    isFormStep2Disabled() {
      return this.isAdminEditing && this.stepIndex === 2
    },

    isDomainDataEmpty() {
      return (
        this.beats.length === 0 &&
        this.countyCities.length === 0 &&
        this.statutes.length === 0 &&
        this.schools.length === 0
      )
    },

    isDomainDataEmptyUser() {
      return this.isDomainDataEmpty && !this.isAdmin
    },

    isDomainDataEmptyAdministrator() {
      return this.isDomainDataEmpty && this.isAdmin
    },
  },

  methods: {
    onGoHome() {
      this.stepIndex = 0
      this.$emit('on-step-index-change', this.stepIndex)
    },

    handleDebugger() {
      this.showDialog = true
    },

    handleDone() {
      this.$emit('handle-done')
    },

    handleCloseDialog() {
      this.showDialog = false
      this.showConfirmDialog = false
      this.showCancelFormDialog = false
      this.showCancelActionDialog = false
      this.showDeletePersonDialog = false
    },

    isCreateForm() {
      return (
        !this.isEditStop() &&
        !this.isEditPerson() &&
        !this.isEditAgencyQuestions()
      )
    },

    isEditStop() {
      const value = localStorage.getItem('ripa_form_edit_stop')
      return value ? value === '1' : false
    },

    isEditPerson() {
      const value = localStorage.getItem('ripa_form_edit_person')
      return value ? value === '1' : false
    },

    isEditAgencyQuestions() {
      const value = localStorage.getItem('ripa_form_edit_agency_questions')
      return value ? value === '1' : false
    },

    handleAddPerson() {
      this.stepIndex = 2
      this.$emit('on-step-index-change', this.stepIndex)
      this.$emit('on-add-person')
    },

    handleBack() {
      this.stepIndex = this.stepIndex - 1
      this.$emit('on-step-index-change', this.stepIndex)
      window.scrollTo(0, 0)
    },

    handleCancel() {
      if (
        this.isEditStop() ||
        this.isEditPerson() ||
        this.isEditAgencyQuestions()
      ) {
        this.showCancelActionDialog = true
      } else {
        this.showCancelFormDialog = true
      }
    },

    handleCancelForm() {
      this.stepIndex = 0
      this.$emit('on-step-index-change', this.stepIndex)
      this.$emit('on-cancel-form')
    },

    handleCancelAction() {
      this.$emit('on-cancel-action')
    },

    handleCopyPerson(id) {
      this.stepIndex = 2
      this.$emit('on-step-index-change', this.stepIndex)
      this.$emit('on-copy-person', id)
    },

    handleCallDeletePerson(id) {
      this.deletePersonId = id
      this.showDeletePersonDialog = true
    },

    handleDeletePerson() {
      if (this.deletePersonId) {
        this.$emit('on-delete-person', this.deletePersonId)
      }
    },

    handleEditPerson(id) {
      this.stepIndex = 2
      this.$emit('on-step-index-change', this.stepIndex)
      this.$emit('on-edit-person', id)
    },

    handleEditStop() {
      this.stepIndex = 1
      this.$emit('on-step-index-change', this.stepIndex)
      this.$emit('on-edit-stop')
    },

    handleEditAgencyQuestions() {
      this.stepIndex = this.model.stopVersion === 1 ? 6 : 7
      this.$emit('on-step-index-change', this.stepIndex)
      this.$emit('on-edit-agency-questions')
    },

    getNextStepIndex() {
      if (!this.isCreateForm()) {
        if (this.isEditStop() && !this.isEditPerson()) {
          const stopReason = this.model?.stopReason?.reasonForStop || null
          const validReason = stopReason !== null
          if (!validReason) {
            localStorage.removeItem('ripa_form_edit_stop')
            localStorage.setItem('ripa_form_edit_person', '1')
            return 3
          } else if (this.model.stopVersion === 1) {
            return 7
          } else if (this.model.stopVersion === 2) {
            return 8
          }
        }

        if (
          !this.isEditStop() &&
          this.isEditPerson() &&
          this.stepIndex === 5 &&
          this.model.stopVersion === 1
        ) {
          return 7
        } else if (
          !this.isEditStop() &&
          this.isEditPerson() &&
          this.stepIndex === 5 &&
          this.model.stopVersion === 2
        ) {
          return 6
        } else if (
          !this.isEditStop() &&
          this.isEditPerson() &&
          this.stepIndex === 6 &&
          this.model.stopVersion === 2
        ) {
          return 8
        }
      }

      if (this.isCreateForm()) {
        if (
          !this.anyAgencyQuestions &&
          this.stepIndex === 5 &&
          this.model.stopVersion === 1
        ) {
          return 7
        } else if (
          !this.anyAgencyQuestions &&
          this.stepIndex === 5 &&
          this.model.stopVersion === 2
        ) {
          return 6
        } else if (
          !this.anyAgencyQuestions &&
          this.stepIndex === 6 &&
          this.model.stopVersion === 2
        ) {
          return 8
        }
      }

      return this.stepIndex + 1
    },

    handleNext() {
      this.stepIndex = this.getNextStepIndex()
      this.$emit('on-step-index-change', this.stepIndex)
      window.scrollTo(0, 0)
    },

    handleStartNew() {
      this.stepIndex = 0
      this.$emit('on-step-index-change', this.stepIndex)
      this.$emit('on-cancel-form')
    },

    handleSubmit() {
      this.showConfirmDialog = true
    },

    handleConfirmSubmit() {
      this.stepIndex = this.confirmationStepIndex
      this.$emit('on-step-index-change', this.stepIndex)
      const apiStop = this.getApiStop
      console.log('Submitted Stop', apiStop)
      this.$emit('on-submit-stop', apiStop)
      this.$emit('on-cancel-form')
    },

    createStepTrace(index, startTimeStamp) {
      if (!this.isAdminEditing) {
        this.stepTrace = {
          index,
          startTimeStamp,
        }
      }
    },

    updateStepTrace(endTimeStamp) {
      if (!this.isAdminEditing && this.stepTrace) {
        this.stepTrace.endTimeStamp = endTimeStamp
        this.model.stepTrace.push(this.stepTrace)
      }
    },

    getFormSummaryStepText() {
      if (this.agencyQuestions && this.model.stopVersion === 1) {
        return '7'
      } else if (this.agencyQuestions && this.model.stopVersion === 2) {
        return '8'
      } else if (!this.agencyQuestions && this.model.stopVersion === 1) {
        return '6'
      } else if (!this.agencyQuestions && this.model.stopVersion === 2) {
        return '7'
      }
    },

    updateFormStepNumbers() {
      this.$nextTick(() => {
        const [top] = document.getElementsByClassName(
          'ripa-form-wrapper--summary-step-top',
        )

        if (top) {
          const [firstSpan] = top.getElementsByClassName(
            'v-stepper__step__step',
          )
          if (firstSpan) {
            firstSpan.innerText = this.getFormSummaryStepText()
          }
        }

        const [bottom] = document.getElementsByClassName(
          'ripa-form-wrapper--summary-step-bottom',
        )

        if (bottom) {
          const [firstSpan] = bottom.getElementsByClassName(
            'v-stepper__step__step',
          )
          if (firstSpan) {
            firstSpan.innerText = this.getFormSummaryStepText()
          }
        }
      })
    },
  },

  watch: {
    formStepIndex(newVal, oldVal) {
      this.updateFormStepNumbers()
      if (newVal !== oldVal) {
        if (newVal > 0 && oldVal > 0 && oldVal < 7) {
          this.updateStepTrace(new Date())
        }
        if (newVal > 0 && newVal < 7) {
          this.createStepTrace(newVal, new Date())
        }
        if (newVal === 0) {
          this.stepTrace = null
        }
      }
      this.stepIndex = newVal
      this.$emit('on-step-index-change', this.stepIndex)
    },

    'model.stopVersion'(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.updateFormStepNumbers()
      }
    },
  },

  props: {
    value: {
      type: Object,
      default: () => {},
    },
  },
}
</script>

<style lang="scss">
@media only screen and (max-width: 370px) {
  .v-stepper__step {
    padding: 16px !important;

    .v-stepper__step__step {
      height: 16px !important;
      min-width: 16px !important;
      width: 16px !important;
    }
  }
}

@media only screen and (max-width: 600px) {
  .v-stepper__content {
    padding: 16px 16px 8px;
  }
}
</style>
