<template>
  <ripa-label
    :class="[noMargins ? null : 'tw-my-4']"
    :value="text"
    bold
  ></ripa-label>
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
    noMargins: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
