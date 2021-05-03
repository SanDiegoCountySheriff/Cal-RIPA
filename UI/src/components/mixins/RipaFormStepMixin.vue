<script>
import _ from 'lodash'

export default {
  data() {
    return {
      isValid: true,
      viewModel: this.value || {},
    }
  },

  computed: {
    model: {
      get() {
        return this.viewModel
      },
      set(newVal) {
        const mergedData = _.merge(this.viewModel, newVal)
        this.viewModel = mergedData
        // this.$forceUpdate()
        this.$emit('input', this.viewModel)
      },
    },
  },

  methods: {
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
