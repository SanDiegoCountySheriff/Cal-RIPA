<template>
  <div class="ripa-header">
    <span class="tw-text-xl tw-uppercase">{{ value }}</span>
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
