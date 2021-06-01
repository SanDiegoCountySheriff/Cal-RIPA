<template>
  <v-expansion-panels>
    <v-expansion-panel
      class="stopAccordionWrapper"
      v-for="(item, i) in items"
      :key="i"
    >
      <v-expansion-panel-header>
        <v-row>
          <v-col cols="12">
            <h3>Stop #{{ item.id }}</h3>
            <span class="stopAccordionWrapper--dateTime text--secondary">
              {{ formatStopDate(item.stopDateTime) }}
            </span>
          </v-col>
        </v-row>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <ripa-form-summary :apiStop="item"> </ripa-form-summary>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import RipaFormSummary from '@/components/molecules/RipaFormSummary'
import { format } from 'date-fns'

export default {
  name: 'ripa-accordion',

  components: {
    RipaFormSummary,
  },

  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },

  methods: {
    formatStopDate(date) {
      return format(new Date(date), 'MM-dd-yyyy')
    },
  },
}
</script>

<style lang="scss">
.stopAccordionWrapper {
  margin: 10px 0;

  h3 {
    font-size: 18px;
  }

  .stopAccordionWrapper--dateTime {
    display: block;
    margin-top: 10px;
  }

  .stopAccordionWrapper--detailSection {
    margin: 0px 0;
    padding: 20px 0 20px 10px;
    border-bottom: 1px solid #cccccc;

    .col {
      padding-left: 0px;
    }

    .listItems {
      display: block;
    }
  }

  .stopAccordionWrapper--personWrapper {
    &.lastPerson {
      border-bottom: none;
    }
  }
}
</style>
