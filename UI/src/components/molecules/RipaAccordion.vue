<template>
  <v-expansion-panels>
    <v-expansion-panel v-for="(item, i) in items" :key="i">
      <v-expansion-panel-header>
        {{ item.stopDateTime }}
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <div class="tw-text-xs tw-break-words">{{ item }}</div>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
export default {
  name: 'ripa-accordion',

  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
