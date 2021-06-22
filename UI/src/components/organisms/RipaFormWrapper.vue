<template>
  <div class="ripa-form-wrapper">
    <v-card class="mx-auto" max-width="900" outlined>
      <v-card-text>
        <template v-if="stepIndex == 0">
          <ripa-template :on-open-template="onOpenTemplate"></ripa-template>
        </template>
        <template v-if="stepIndex >= 1 && stepIndex <= 7">
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
                    v-model="stop"
                    :on-next="handleNext"
                    :on-cancel="handleCancel"
                    :beats="beats"
                    :county-cities="countyCities"
                    :display-user-edit="displayUserEdit"
                    :display-beat-input="displayBeatInput"
                    :is-authenticated="isAuthenticated"
                    :admin-editing="adminEditing"
                    :last-location="lastLocation"
                    :loading-gps="loadingGps"
                    :loading-pii="loadingPiiStep1"
                    :non-county-cities="nonCountyCities"
                    :schools="schools"
                    :user="user"
                    :valid-last-location="validLastLocation"
                    :on-open-favorites="onOpenLocationFavorites"
                    :on-open-last-location="onOpenLastLocation"
                    :on-open-statute="onOpenStatute"
                    :on-save-favorite="onSaveLocationFavorite"
                    :on-gps-location="onGpsLocation"
                    :on-update-user="onUpdateUser"
                    @input="handleInput"
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
                    v-model="stop"
                    :disabled="isFormStep2Disabled"
                    :on-back="handleBack"
                    :on-next="handleNext"
                    :on-cancel="handleCancel"
                    :on-open-statute="onOpenStatute"
                    :back-button-visible="getFormStep2BackButtonVisible"
                    @input="handleInput"
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
                    v-model="stop"
                    :last-reason="lastReason"
                    :loading-pii="loadingPiiStep3"
                    :on-back="handleBack"
                    :on-next="handleNext"
                    :on-cancel="handleCancel"
                    :on-open-favorites="onOpenReasonFavorites"
                    :on-open-statute="onOpenStatute"
                    :on-save-favorite="onSaveReasonFavorite"
                    :statutes="statutes"
                    @input="handleInput"
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
                    v-model="stop"
                    :loading-pii="loadingPiiStep4"
                    :on-back="handleBack"
                    :on-next="handleNext"
                    :on-cancel="handleCancel"
                    :on-open-statute="onOpenStatute"
                    :statutes="statutes"
                    @input="handleInput"
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
                    v-model="stop"
                    :last-result="lastResult"
                    :on-back="handleBack"
                    :on-next="handleNext"
                    :on-cancel="handleCancel"
                    :on-open-favorites="onOpenResultFavorites"
                    :on-open-statute="onOpenStatute"
                    :on-save-favorite="onSaveResultFavorite"
                    :statutes="statutes"
                    @input="handleInput"
                  ></ripa-form-step-5>
                </template>
              </v-stepper-content>

              <v-stepper-content step="6">
                <template v-if="stepIndex === 6">
                  <ripa-form-step-6
                    v-model="stop"
                    :on-back="handleBack"
                    :on-next="handleNext"
                    :on-cancel="handleCancel"
                    :back-button-visible="getFormStep6BackButtonVisible"
                    @input="handleInput"
                  ></ripa-form-step-6>
                </template>
              </v-stepper-content>

              <v-stepper-content step="7">
                <template v-if="stepIndex === 7">
                  <ripa-form-step-7
                    v-model="stop"
                    :admin-editing="adminEditing"
                    :api-stop="getApiStop"
                    :on-add-person="handleAddPerson"
                    :on-back="handleBack"
                    :on-delete-person="handleDeletePerson"
                    :on-edit-agency-questions="handleEditAgencyQuestions"
                    :on-edit-person="handleEditPerson"
                    :on-edit-stop="handleEditStop"
                    :on-submit="handleSubmit"
                    :on-cancel="handleCancel"
                    @input="handleInput"
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
        <template v-if="stepIndex === confirmationStepIndex">
          <ripa-confirmation :on-start-new="handleStartNew"></ripa-confirmation>
        </template>
      </v-card-text>
    </v-card>

    <ripa-json-viewer-dialog
      :full-stop="fullStop"
      :api-stop="getApiStop"
      :show-dialog="showDialog"
      :on-close="handleCloseDialog"
    ></ripa-json-viewer-dialog>
  </div>
</template>

<script>
import RipaConfirmation from '@/components/molecules/RipaConfirmation'
import RipaFormStep1 from '@/components/molecules/RipaFormStep1'
import RipaFormStep2 from '@/components/molecules/RipaFormStep2'
import RipaFormStep3 from '@/components/molecules/RipaFormStep3'
import RipaFormStep4 from '@/components/molecules/RipaFormStep4'
import RipaFormStep5 from '@/components/molecules/RipaFormStep5'
import RipaFormStep6 from '@/components/molecules/RipaFormStep6'
import RipaFormStep7 from '@/components/molecules/RipaFormStep7'
import RipaJsonViewerDialog from '@/components/molecules/RipaJsonViewerDialog'
import RipaSubheader from '@/components/atoms/RipaSubheader'
import RipaTemplate from '@/components/molecules/RipaTemplate'
import { fullStopToApiStop } from '@/utilities/stop'

export default {
  name: 'ripa-form-wrapper',

  components: {
    RipaConfirmation,
    RipaFormStep1,
    RipaFormStep2,
    RipaFormStep3,
    RipaFormStep4,
    RipaFormStep5,
    RipaFormStep6,
    RipaFormStep7,
    RipaJsonViewerDialog,
    RipaSubheader,
    RipaTemplate,
  },

  data() {
    return {
      stepIndex: this.formStepIndex,
      confirmationStepIndex: 8,
      stop: this.value,
      stepTrace: null,
      showDialog: false,
    }
  },

  computed: {
    anyAgencyQuestions() {
      const questions = this.stop.agencyQuestions || []
      return questions.length > 0
    },

    displayUserEdit() {
      return !this.adminEditing
    },

    getEditPersonText() {
      const personIndex = this.stop.person?.index || 1
      return `Person: ${personIndex}`
    },

    getFormStep2BackButtonVisible() {
      return this.isCreateForm()
    },

    getFormStep6BackButtonVisible() {
      return this.isCreateForm()
    },

    getApiStop() {
      return fullStopToApiStop(
        this.fullStop,
        this.beats,
        this.countyCities,
        this.nonCountyCities,
        this.schools,
        this.statutes,
      )
    },

    isFormStep2Disabled() {
      return this.adminEditing && this.stepIndex === 2
    },
  },

  methods: {
    handleDebugger() {
      this.showDialog = true
    },

    handleCloseDialog() {
      this.showDialog = false
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

    handleInput(newVal) {
      this.stop = Object.assign({}, newVal)
      this.$emit('input', this.stop)
    },

    handleAddPerson() {
      this.stepIndex = 2
      if (this.onStepIndexChange) {
        this.onStepIndexChange(this.stepIndex)
      }
      if (this.onAddPerson) {
        this.onAddPerson()
      }
    },

    handleBack() {
      this.stepIndex = this.stepIndex - 1
      if (this.onStepIndexChange) {
        this.onStepIndexChange(this.stepIndex)
      }
      window.scrollTo(0, 0)
    },

    handleCancel() {
      if (
        this.isEditStop() ||
        this.isEditPerson() ||
        this.isEditAgencyQuestions()
      ) {
        this.handleCancelAction()
      } else {
        this.handleCancelForm()
      }
    },

    handleCancelForm() {
      this.$confirm({
        title: 'Confirm Cancel',
        message: `Are you sure you want to cancel the form? You will lose all changes.`,
        button: {
          no: 'No',
          yes: 'Yes',
        },
        callback: confirm => {
          if (confirm) {
            this.stepIndex = 0
            if (this.onStepIndexChange) {
              this.onStepIndexChange(this.stepIndex)
            }
            if (this.onCancelForm) {
              this.onCancelForm()
            }
          }
        },
      })
    },

    handleCancelAction() {
      this.$confirm({
        title: 'Confirm Cancel',
        message: `Are you sure you want to cancel the action? You will lose all changes.`,
        button: {
          no: 'No',
          yes: 'Yes',
        },
        callback: confirm => {
          if (confirm) {
            if (this.onCancelAction) {
              this.onCancelAction()
            }
          }
        },
      })
    },

    handleDeletePerson(id) {
      this.$confirm({
        title: 'Confirm Delete',
        message: `Are you sure you want to delete the person?`,
        button: {
          no: 'No',
          yes: 'Yes',
        },
        callback: confirm => {
          if (confirm) {
            if (this.onDeletePerson) {
              this.onDeletePerson(id)
            }
          }
        },
      })
    },

    handleEditPerson(id) {
      this.stepIndex = 2
      if (this.onStepIndexChange) {
        this.onStepIndexChange(this.stepIndex)
      }
      if (this.onEditPerson) {
        this.onEditPerson(id)
      }
    },

    handleEditStop() {
      this.stepIndex = 1
      if (this.onStepIndexChange) {
        this.onStepIndexChange(this.stepIndex)
      }
      if (this.onEditStop) {
        this.onEditStop()
      }
    },

    handleEditAgencyQuestions() {
      this.stepIndex = 6
      if (this.onStepIndexChange) {
        this.onStepIndexChange(this.stepIndex)
      }
      if (this.onEditAgencyQuestions) {
        this.onEditAgencyQuestions()
      }
    },

    getNextStepIndex() {
      if (!this.isCreateForm()) {
        if (this.isEditStop() && !this.isEditPerson()) {
          const stopReason = this.stop?.stopReason?.reasonForStop || null
          const validReason = stopReason !== null
          if (!validReason) {
            localStorage.removeItem('ripa_form_edit_stop')
            localStorage.setItem('ripa_form_edit_person', '1')
            return 3
          } else {
            return 7
          }
        }

        if (!this.isEditStop() && this.isEditPerson() && this.stepIndex === 5) {
          return 7
        }
      }

      if (this.isCreateForm()) {
        if (!this.anyAgencyQuestions && this.stepIndex === 5) {
          return 7
        }
      }

      return this.stepIndex + 1
    },

    handleNext() {
      this.stepIndex = this.getNextStepIndex()
      if (this.onStepIndexChange) {
        this.onStepIndexChange(this.stepIndex)
      }
      window.scrollTo(0, 0)
    },

    handleStartNew() {
      this.stepIndex = 0
      if (this.onStepIndexChange) {
        this.onStepIndexChange(this.stepIndex)
      }
      if (this.onCancelForm) {
        this.onCancelForm()
      }
    },

    handleSubmit() {
      this.$confirm({
        title: 'Confirm Submission',
        message: `Are you sure you want to submit the form?`,
        button: {
          no: 'No',
          yes: 'Yes',
        },
        callback: confirm => {
          if (confirm) {
            this.stepIndex = this.confirmationStepIndex
            if (this.onStepIndexChange) {
              this.onStepIndexChange(this.stepIndex)
            }
            if (this.onSubmitStop) {
              const apiStop = this.getApiStop
              if (this.adminEditing) {
                const explanation = this.stop.editStopExplanation || 'None'
                apiStop.editStopExplanation = explanation
              }
              this.onSubmitStop(this.getApiStop)
            }
            if (this.adminEditing && this.onSubmitAudit) {
              const route = localStorage.getItem('ripa_form_edit_route')
              const parsedRoute = route || '/'
              this.onSubmitAudit(parsedRoute)
            }
            if (this.onCancelForm) {
              this.onCancelForm()
            }
          }
        },
      })
    },

    createStepTrace(index, startTimeStamp) {
      this.stepTrace = {
        index,
        startTimeStamp,
      }
    },

    updateStepTrace(endTimeStamp) {
      if (this.stepTrace) {
        this.stepTrace.endTimeStamp = endTimeStamp
        this.stop.stepTrace.push(this.stepTrace)
      }
    },

    getFormSummaryStepText() {
      return this.anyAgencyQuestions ? '7' : '6'
    },
  },

  mounted() {
    this.$nextTick(() => {
      const [top] = document.getElementsByClassName(
        'ripa-form-wrapper--summary-step-top',
      )
      if (top) {
        const [firstSpan] = top.getElementsByClassName('v-stepper__step__step')
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

  watch: {
    value(newVal) {
      this.stop = newVal
    },

    formStepIndex(newVal, oldVal) {
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
      if (this.onStepIndexChange) {
        this.onStepIndexChange(this.stepIndex)
      }
    },
  },

  props: {
    value: {
      type: Object,
      default: () => {},
    },
    adminEditing: {
      type: Boolean,
      default: false,
    },
    schools: {
      type: Array,
      default: () => [],
    },
    beats: {
      type: Array,
      default: () => [],
    },
    countyCities: {
      type: Array,
      default: () => [],
    },
    displayBeatInput: {
      type: Boolean,
      default: false,
    },
    displayDebugger: {
      type: Boolean,
      default: false,
    },
    formStepIndex: {
      type: Number,
      default: 1,
    },
    fullStop: {
      type: Object,
      default: () => {},
    },
    isAuthenticated: {
      type: Boolean,
      default: false,
    },
    lastLocation: {
      type: Object,
      default: () => {},
    },
    lastReason: {
      type: Object,
      default: () => {},
    },
    lastResult: {
      type: Object,
      default: () => {},
    },
    loadingGps: {
      type: Boolean,
      default: false,
    },
    loadingPiiStep1: {
      type: Boolean,
      default: false,
    },
    loadingPiiStep3: {
      type: Boolean,
      default: false,
    },
    loadingPiiStep4: {
      type: Boolean,
      default: false,
    },
    nonCountyCities: {
      type: Array,
      default: () => [],
    },
    statutes: {
      type: Array,
      default: () => [],
    },
    user: {
      type: Object,
      default: () => {},
    },
    validLastLocation: {
      type: Boolean,
      default: false,
    },
    onAddPerson: {
      type: Function,
      default: () => {},
    },
    onCancelForm: {
      type: Function,
      default: () => {},
    },
    onCancelAction: {
      type: Function,
      default: () => {},
    },
    onDeletePerson: {
      type: Function,
      default: () => {},
    },
    onEditAgencyQuestions: {
      type: Function,
      default: () => {},
    },
    onEditPerson: {
      type: Function,
      default: () => {},
    },
    onEditStop: {
      type: Function,
      default: () => {},
    },
    onOpenLocationFavorites: {
      type: Function,
      default: () => {},
    },
    onOpenReasonFavorites: {
      type: Function,
      default: () => {},
    },
    onOpenResultFavorites: {
      type: Function,
      default: () => {},
    },
    onOpenLastLocation: {
      type: Function,
      default: () => {},
    },
    onOpenStatute: {
      type: Function,
      default: () => {},
    },
    onSaveLocationFavorite: {
      type: Function,
      default: () => {},
    },
    onSaveReasonFavorite: {
      type: Function,
      default: () => {},
    },
    onSaveResultFavorite: {
      type: Function,
      default: () => {},
    },
    onStepIndexChange: {
      type: Function,
      default: () => {},
    },
    onSubmitStop: {
      type: Function,
      default: () => {},
    },
    onSubmitAudit: {
      type: Function,
      default: () => {},
    },
    onGpsLocation: {
      type: Function,
      default: () => {},
    },
    onOpenTemplate: {
      type: Function,
      default: () => {},
    },
    onUpdateUser: {
      type: Function,
      default: () => {},
    },
  },
}
</script>

<style lang="scss">
@media only screen and (max-width: 600px) {
  .v-stepper__content {
    padding: 16px 16px 8px;
  }
}
</style>
