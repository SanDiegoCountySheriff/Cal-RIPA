<template>
  <div class="ripa-form-header tw-mb-6">
    <ripa-header :value="title"></ripa-header>
    <div class="tw-flex">
      {{ required }}
      {{ subtitle }}
    </div>
  </div>
</template>

<script>
import RipaHeader from '@/components/atoms/RipaHeader'

export default {
  name: 'ripa-form-header',

  components: {
    RipaHeader,
  },

  props: {
    title: {
      type: String,
      default: '',
    },
    required: {
      type: Boolean,
      default: false,
    },
    subtitle: {
      type: String,
      default: '',
    },
  },
}
</script>
