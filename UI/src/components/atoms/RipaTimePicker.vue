<template>
  <!-- <v-dialog
    ref="dialog"
    v-model="modal"
    :return-value.sync="model"
    persistent
    width="290px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        v-model="model"
        :disabled="disabled"
        :label="label"
        append-icon="mdi-clock-time-four-outline"
        readonly
        v-bind="attrs"
        v-on="on"
        :rules="rules"
      ></v-text-field>
    </template>
    <v-time-picker v-if="modal" v-model="model" full-width>
    <v-spacer></v-spacer>
    <v-btn text color="primary" @click="modal = false"> Cancel </v-btn>
    <v-btn text color="primary" @click="$refs.dialog.save(model)"> OK </v-btn>
    </v-time-picker>
  </v-dialog> -->

  <v-text-field
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
input[type='time']::-webkit-calendar-picker-indicator {
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
</style>
