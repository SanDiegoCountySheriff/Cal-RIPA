<template>
  <v-alert :outlined="alertOutlined" :type="alertType" dense>
    <slot></slot>
  </v-alert>
</template>

<script>
export default {
  name: 'ripa-alert',

  props: {
    alertType: {
      type: String,
      default: 'info',
    },
    alertOutlined: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
