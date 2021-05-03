<template>
  <v-dialog
    ref="dialog"
    v-model="modal"
    :return-value.sync="model"
    persistent
    width="290px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        v-model="model"
        :label="label"
        append-icon="mdi-clock-time-four-outline"
        readonly
        v-bind="attrs"
        v-on="on"
      ></v-text-field>
    </template>
    <v-time-picker v-if="modal" v-model="model" full-width>
      <v-spacer></v-spacer>
      <v-btn text color="primary" @click="modal = false"> Cancel </v-btn>
      <v-btn text color="primary" @click="$refs.dialog.save(time)"> OK </v-btn>
    </v-time-picker>
  </v-dialog>
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

    getTime() {
      if (this.model) {
        const array = this.model.split(':')
        const hour = array[0]
        const minute = array[1]
        if (hour > 0 && hour < 12) {
          return `${hour}:${minute} AM`
        }
        if (hour === 0) {
          return `${hour + 12}:${minute} AM`
        }
        if (hour === 12) {
          return `${hour}:${minute} PM`
        }
        return `${hour - 12}:${minute} PM`
      }

      return null
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
    label: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="scss"></style>
