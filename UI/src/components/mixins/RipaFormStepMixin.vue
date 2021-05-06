<script>
export default {
  data() {
    return {
      isFormValid: true,
      viewModel: this.value || {},
    }
  },

  computed: {
    model: {
      get() {
        return this.viewModel
      },
      set(newVal) {
        const updatedModel = {
          actionsTaken: newVal?.actionsTaken
            ? newVal.actionsTaken
            : this.viewModel.actionsTaken || {},
          location: newVal?.location
            ? newVal.location
            : this.viewModel.location || {},
          officer: newVal?.officer
            ? newVal.officer
            : this.viewModel.officer || {},
          person: newVal?.person ? newVal.person : this.viewModel.person || {},
          stopDate: newVal?.stopDate
            ? newVal.stopDate
            : this.viewModel.stopDate || {},
          stopReason: newVal?.stopReason
            ? newVal.stopReason
            : this.viewModel.stopReason || {},
          stopResult: newVal?.stopResult
            ? newVal.stopResult
            : this.viewModel.stopResult || {},
          updated: newVal?.updated
            ? newVal.updated
            : this.viewModel.updated || new Date(),
        }
        this.viewModel = Object.assign({}, updatedModel)
        setTimeout(() => {
          this.isFormValid = this.$refs.stepForm.validate()
        }, 500)
        this.$emit('input', this.viewModel)
      },
    },
  },

  methods: {
    handleAddPerson() {
      if (this.onAddPerson) {
        this.onAddPerson()
      }
    },

    handleBack() {
      if (this.onBack) {
        this.onBack()
      }
    },

    handleNext() {
      this.isFormValid = this.$refs.stepForm.validate()
      if (!this.isFormValid) {
        return
      }
      this.$emit('input', this.viewModel)
      if (this.onNext) {
        this.onNext()
      }
    },

    handleSubmit() {
      this.isFormValid = this.$refs.stepForm.validate()
      if (!this.isFormValid) {
        return
      }
      this.$emit('input', this.viewModel)
      if (this.onSubmit) {
        this.onSubmit()
      }
    },

    handleCancel() {
      if (this.onCancel) {
        this.onCancel()
      }
    },
  },

  watch: {
    value(newVal) {
      this.viewModel = newVal
    },
  },

  props: {
    value: {
      type: Object,
      default: () => {},
    },
    schools: {
      type: Array,
      default: () => {},
    },
    beats: {
      type: Array,
      default: () => {},
    },
    countyCities: {
      type: Array,
      default: () => {},
    },
    nonCountyCities: {
      type: Array,
      default: () => {},
    },
    onAddPerson: {
      type: Function,
      default: () => {},
    },
    onBack: {
      type: Function,
      default: () => {},
    },
    onCancel: {
      type: Function,
      default: () => {},
    },
    onNext: {
      type: Function,
      default: () => {},
    },
    onSubmit: {
      type: Function,
      default: () => {},
    },
  },
}
</script>
