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

    handleBack() {
      this.$emit('on-back')
    },

    handleNext() {
      this.isFormValid = this.$refs.stepForm.validate()
      if (!this.isFormValid) {
        return
      }
      this.$emit('on-next')
    },

    handleCancel() {
      this.$emit('on-cancel')
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
  },
}
</script>
