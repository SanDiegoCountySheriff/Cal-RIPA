<template>
  <v-snackbar v-model="model" :timeout="getTimeout" :top="top">
    {{ text }}

    <template v-slot:action="{ attrs }">
      <template v-if="viewButtonVisible">
        <v-btn color="blue" text v-bind="attrs" @click="handleViewClick">
          View
        </v-btn>
      </template>
      <v-btn color="blue" text v-bind="attrs" @click="model = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  name: 'ripa-snackbar',

  data() {
    return {
      viewModel: this.value,
    }
  },

  computed: {
    model: {
      get() {
        return this.viewModel
      },
      set(newVal) {
        this.viewModel = newVal
        this.$emit('input', newVal)
      },
    },

    getTimeout() {
      return this.autoClose ? this.timeout : -1
    },
  },

  methods: {
    handleViewClick() {
      this.$emit('on-view')
      this.model = false
    },
  },

  watch: {
    value(newVal) {
      this.viewModel = newVal
    },
  },

  props: {
    value: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
      default: '',
    },
    timeout: {
      type: Number,
      default: 6000,
    },
    autoClose: {
      type: Boolean,
      default: true,
    },
    viewButtonVisible: {
      type: Boolean,
      default: false,
    },
    top: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
