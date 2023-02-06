<script>
export default {
  data() {
    return {
      isFormValid: true,
      viewModel: this.value || {},
      showConfirmDialog: false,
    }
  },

  computed: {
    model: {
      get() {
        return this.viewModel
      },
      set(newVal) {
        this.viewModel = Object.assign({}, newVal)
        setTimeout(() => {
          const form = this.$refs.stepForm
          this.isFormValid = form ? form.validate() : false
        }, 500)
        this.$emit('input', this.viewModel)
      },
    },

    isBackNextDisabled() {
      return this.loadingGps || this.loadingPii
    },
  },

  methods: {
    handleConfirm() {
      this.handleNext()
    },

    handleAddPerson() {
      this.$emit('on-add-person')
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
      this.$emit('on-next')
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
      this.$emit('on-cancel')
    },

    handleDone() {
      this.$emit('handle-done')
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
    loadingGps: {
      type: Boolean,
      defaeult: false,
    },
    loadingPii: {
      type: Boolean,
      default: false,
    },
    nonCountyCities: {
      type: Array,
      default: () => [],
    },
    onEditPerson: {
      type: Function,
      default: () => {},
    },
    onBack: {
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
