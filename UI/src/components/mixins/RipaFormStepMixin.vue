<script>
export default {
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

    handleBack() {
      if (this.onBack) {
        this.onBack()
      }
    },

    handleNext() {
      this.isValid = this.$refs.stepForm.validate()
      if (!this.isValid) {
        return
      }
      this.$emit('input', this.viewModel)
      if (this.onNext) {
        this.onNext()
      }
    },

    handleSubmit() {
      this.isValid = this.$refs.stepForm.validate()
      if (!this.isValid) {
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
    cities: {
      type: Array,
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
