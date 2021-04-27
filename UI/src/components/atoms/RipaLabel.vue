<template>
  <div :class="['ripa-label', boldClass]">
    <span>
      {{ value }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'ripa-label',

  computed: {
    boldClass() {
      return this.bold ? 'tw-font-bold' : ''
    },
  },

  props: {
    value: {
      type: String,
      default: '',
    },
    bold: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
