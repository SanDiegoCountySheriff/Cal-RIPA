<template>
  <div class="ripa-header">
    <span class="tw-text-base md:tw-text-lg tw-uppercase">{{ value }}</span>
  </div>
</template>

<script>
export default {
  name: 'ripa-header',

  props: {
    value: {
      type: String,
      default: '',
    },
  },
}
</script>
