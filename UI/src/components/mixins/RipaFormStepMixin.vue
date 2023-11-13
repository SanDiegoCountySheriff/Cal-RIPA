<script>
export default {
  data() {
    return {
      isFormValid: true,
      showConfirmDialog: false,
    }
  },

  computed: {
    model: {
      get() {
        return this.value
      },
      set(newVal) {
        this.$emit('input', newVal)
        setTimeout(() => {
          const form = this.$refs.stepForm
          this.isFormValid = form ? form.validate() : false
        }, 500)
      },
    },

    isBackNextDisabled() {
      return (
        this.loadingGps ||
        this.loadingPiiStep1 ||
        this.loadingPiiStep3 ||
        this.loadingPiiStep4
      )
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

  mounted() {
    this.isFormValid = this.$refs.stepForm.validate()
  },

  props: {
    value: {
      type: Object,
      required: true,
    },
  },
}
</script>
