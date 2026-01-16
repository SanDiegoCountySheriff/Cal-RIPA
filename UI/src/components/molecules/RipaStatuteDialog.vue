<template>
  <v-dialog v-model="model" max-width="650px">
    <v-card>
      <v-card-title>
        <span>{{ dialogTitle }}</span>
      </v-card-title>

      <v-card-text>
        <template v-if="showAb2234Link">
          <div class="tw-text-content">Vehicle Code §21214.7</div>

          <div class="tw-mt-4">
            <v-btn
              color="primary"
              :href="ab2234Url"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open AB 2234 bill text
            </v-btn>
          </div>
        </template>

        <template v-else>
          <div class="ripa-statute">
            <ripa-tree :tree-data="statuteContent"></ripa-tree>
          </div>
        </template>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="handleClose"> Close </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import RipaTree from '@/components/molecules/RipaTree'

export default {
  name: 'ripa-statute-dialog',

  components: {
    RipaTree,
  },

  data() {
    return {
      viewModel: this.showDialog,
    }
  },

  computed: {
    model: {
      get() {
        return this.viewModel
      },
      set(newValue) {
        if (!newValue) {
          this.handleClose()
        }
        this.viewModel = newValue
      },
    },

    statuteTitle() {
      if (typeof this.statute === 'string') {
        return this.statute
      }

      return (this.statute && this.statute.statute) || ''
    },

    statuteContent() {
      if (typeof this.statute === 'string') {
        return null
      }

      return (this.statute && this.statute.content) || {}
    },

    showAb2234Link() {
      const statuteTitle = this.statuteTitle || ''
      const normalized = statuteTitle.toUpperCase().replace(/[^A-Z0-9]/g, '')

      return normalized.includes('AB2234') || statuteTitle.includes('21214.7')
    },

    dialogTitle() {
      if (this.showAb2234Link) {
        return 'AB 2234 — E-Bike Safety Pilot Program'
      }

      return `Statute ${this.statuteTitle}`
    },

    ab2234Url() {
      return 'https://leginfo.legislature.ca.gov/faces/billTextClient.xhtml?bill_id=202320240AB2234'
    },
  },

  methods: {
    handleClose() {
      this.$emit('on-close')
    },
  },

  watch: {
    showDialog(newValue) {
      this.viewModel = newValue
    },
  },

  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    statute: {
      type: Object,
      default: () => {},
    },
  },
}
</script>

<style lang="scss">
.v-dialog:not(.v-dialog--fullscreen) {
  max-height: 600px !important;
}
</style>
