<template>
  <div>
    <ripa-form-header :title="getTitle"></ripa-form-header>
    <template v-if="loading">
      <v-skeleton-loader
        v-bind="attrs"
        type="list-item-three-line, card-heading, list-item-three-line, card-heading, list-item-three-line, card-heading"
      ></v-skeleton-loader>
    </template>
    <template v-if="!loading">
      <ripa-accordion :items="items"></ripa-accordion>
    </template>
  </div>
</template>

<script>
import RipaAccordion from '@/components/molecules/RipaAccordion'
import RipaFormHeader from '@/components/molecules/RipaFormHeader'

export default {
  name: 'ripa-officer-stops-wrapper',

  components: {
    RipaAccordion,
    RipaFormHeader,
  },

  data() {
    return {
      attrs: {
        class: 'mb-6',
        boilerplate: true,
        elevation: 2,
      },
    }
  },

  computed: {
    getTitle() {
      return `Last ${this.items.length} Stops`
    },
  },

  props: {
    items: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
