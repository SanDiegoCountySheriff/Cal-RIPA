<template>
  <div class="ripa-form-header tw-my-8">
    <ripa-subheader :text="title"></ripa-subheader>
    <div class="tw-flex">
      <template v-if="required">
        <v-chip class="tw-mt-1 tw-mr-2" color="red" text-color="white" small>
          required
        </v-chip>
      </template>
      <template v-if="subtitle.length > 0">
        <v-chip
          class="tw-mt-1"
          color="primary"
          outlined
          pill
          small
          @click="handleSubtitleClick"
        >
          <v-icon left size="16"> mdi-scale-balance </v-icon>
          {{ subtitle }}
        </v-chip>
      </template>
    </div>
  </div>
</template>

<script>
import RipaSubheader from '@/components/atoms/RipaSubheader'

export default {
  name: 'ripa-form-subheader',

  components: {
    RipaSubheader,
  },

  methods: {
    handleSubtitleClick() {
      alert('do something...')
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
