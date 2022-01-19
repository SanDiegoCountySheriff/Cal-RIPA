<template>
  <v-text-field
    class="left-align"
    v-model="model"
    :label="label"
    :rules="rules"
    append-icon="mdi-clock-time-four-outline"
    type="time"
  ></v-text-field>
</template>

<script>
export default {
  name: 'ripa-time-picker',

  data() {
    return {
      modal: false,
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
  },

  watch: {
    value(newVal) {
      this.viewModel = newVal
    },
  },

  props: {
    value: {
      type: String,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: '',
    },
    rules: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

<style>
::-webkit-calendar-picker-indicator {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: auto;
  height: auto;
  color: transparent;
  background: transparent;
}
.left-align input {
  text-align: left;
}s
</style>
