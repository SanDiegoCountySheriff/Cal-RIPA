<template>
  <div class="ripa-form-header">
    <v-row class="tw-ml-1 tw-mt-1">
      <template v-if="required">
        <v-tooltip top color="error">
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              color="error"
              size="16"
              v-bind="attrs"
              v-on="on"
              class="mr-1"
            >
              mdi-alert
            </v-icon>
          </template>

          <span>Required</span>
        </v-tooltip>
      </template>

      <template v-if="subtitle.length > 0">
        <v-icon
          class="icon"
          size="16"
          @click="handleSubtitleClick"
          color="primary"
        >
          mdi-scale-balance
        </v-icon>
      </template>

      <ripa-header :value="title"></ripa-header>
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
      this.$emit('on-open-statute', this.subtitle)
    },
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

<style>
.icon {
  margin-right: 5px;
  margin-bottom: 2px;
}
</style>
