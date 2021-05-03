<template>
  <ripa-label class="tw-my-4" :value="text" bold></ripa-label>
</template>

<script>
import RipaLabel from '@/components/atoms/RipaLabel'

export default {
  name: 'ripa-header',

  components: { RipaLabel },

  props: {
    text: {
      type: String,
      default: '',
    },
  },
}
</script>
