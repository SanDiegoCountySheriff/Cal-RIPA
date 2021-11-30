<template>
  <v-container class="tw-mt-2">
    <v-data-table></v-data-table>
  </v-container>
</template>

<script>
export default {
  name: 'ripa-cpra-report-history',

  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
