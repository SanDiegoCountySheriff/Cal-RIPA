<template>
  <div class="ripa-statutes-grid">
    <p class="ripa-statutes-grid--info">
      Data in this table is provided by CA DOJ and maintained periodically on
      CLEW (<a
        href="https://clew.doj.ca.gov/sd-ab953"
        target="_blank"
        rel="noopener noreferrer"
      >
        https://clew.doj.ca.gov/sd-ab953 </a
      >). Exercise caution when uploading data. Any mismatches will produce
      errors upon submission to CA DOJ.
    </p>
    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :loading="loading"
      :headers="headers"
      :items="statutes"
      :search="search"
      sort-by="offenseCode"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title class="tw-uppercase"
            >Admin: Maintain Statutues</v-toolbar-title
          >
        </v-toolbar>
      </template>

      <template v-slot:no-data>
        <div>No Data</div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: 'ripa-statutes-grid',

  data() {
    return {
      search: '',
      statutes: [],
      headers: [
        { text: 'ID', value: 'rowKey' },
        { text: 'Offense Code', value: 'offenseCode' },
        { text: 'Offense Statute', value: 'offenseStatute' },
        { text: 'Offense Validation CD', value: 'offenseValidationCD' },
        { text: 'Offense Txn Type CD', value: 'offenseTxnTypeCD' },
        { text: 'Offense Type of Statute CD', value: 'offenseTypeOfStatuteCD' },
        { text: 'Statute Literal', value: 'statuteLiteral' },
        {
          text: 'Offense Default Type of Charge',
          value: 'offenseDefaultTypeOfCharge',
        },
        { text: 'Offense Type of Charge', value: 'offenseTypeOfCharge' },
        { text: 'Offense Literal ID CD', value: 'offenseLiteralIdentifierCD' },
        { text: 'Offense Code', value: 'offenseDegree' },
        { text: 'BCS Hierarchy CD', value: 'bcsHierarchyCD' },
        { text: 'Offense Enacted', value: 'offenseEnacted', width: '110' },
        { text: 'Offense Repealed', value: 'offenseRepealed', width: '110' },
        { text: 'Alps Cognizant CD', value: 'alpsCognizantCD' },
      ],
    }
  },

  methods: {
    init() {
      this.statutes = this.items
    },
  },

  watch: {
    items(val) {
      this.statutes = val
    },
  },

  created() {
    this.init()
  },

  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    items: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

<style lang="scss">
.ripa-statutes-grid {
  .ripa-statutes-grid--info {
    margin: 16px 16px 0 16px;
    color: red;
  }
}
</style>
