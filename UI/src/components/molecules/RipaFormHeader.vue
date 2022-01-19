<template>
  <div class="ripa-form-header">
    <v-row class="tw-m-1">
      <ripa-header :value="title"></ripa-header>
      <template v-if="subtitle.length > 0">
        <v-icon
          class="tw-ml-2"
          size="16"
          @click="handleSubtitleClick"
          color="primary"
        >
          mdi-scale-balance
        </v-icon>
      </template>
    </v-row>
  </div>
</template>

<script>
import RipaHeader from '@/components/atoms/RipaHeader'

export default {
  name: 'ripa-form-header',

  components: {
    RipaHeader,
  },

  methods: {
    handleSubtitleClick() {
      if (this.onOpenStatute) {
        this.onOpenStatute(this.subtitle)
      }
    },
  },

  props: {
    title: {
      type: String,
      default: '',
    },
    subtitle: {
      type: String,
      default: '',
    },
    onOpenStatute: {
      type: Function,
      default: () => {},
    },
  },
}
</script>
