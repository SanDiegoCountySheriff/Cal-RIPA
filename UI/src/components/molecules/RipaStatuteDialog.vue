<template>
  <v-dialog v-model="model" max-width="650px">
    <v-card>
      <v-card-title>
        <span>Statute {{ statuteTitle }}</span>
      </v-card-title>

      <v-card-text>
        <div class="ripa-statute">
          <ripa-tree :tree-data="statuteContent"></ripa-tree>
        </div>
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
      return (this.statute && this.statute.statute) || ''
    },

    statuteContent() {
      return (this.statute && this.statute.content) || {}
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
