<template>
  <div>
    <v-card-title> PII Review </v-card-title>

    <v-card-text>
      <v-data-table
        :loading="loading"
        :items="piiEntities"
        :headers="headers"
        item-key="EntityText"
        group-by="id"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <ripa-switch
              v-model="showingVersionTwoStops"
              label="Show V2 Stops"
              color="primary"
              class="ml-8"
            ></ripa-switch>

            <ripa-switch
              v-model="accept"
              label="I understand these changes cannot be undone"
              color="primary"
              class="ml-8"
            ></ripa-switch>
          </v-toolbar>
        </template>

        <template #[`group.header`]="{ group }">
          <td class="group" colspan="3">
            <v-icon color="primary">mdi-arrow-down-bold</v-icon>
            Stop ID: {{ group }}
            <v-btn
              @click="handleMarkFalsePositive(group)"
              :disabled="!accept"
              class="ml-5"
              color="primary"
              small
            >
              Mark As False Positive
            </v-btn>
            <v-btn
              @click="handleReview(group)"
              class="ml-5"
              small
              color="primary"
            >
              Go To Stop
            </v-btn>
          </td>
        </template>
      </v-data-table>
    </v-card-text>
  </div>
</template>

<script>
import RipaSwitch from '@/components/atoms/RipaSwitch'

export default {
  name: 'ripa-pii-review',

  components: { RipaSwitch },

  data() {
    return {
      showingVersionTwoStops: false,
      accept: false,
      version: 1,
      headers: [
        { text: 'Id', value: 'id' },
        { text: 'Text', value: 'entityText' },
        { text: 'Category', value: 'category' },
        { text: 'Source', value: 'source' },
      ],
    }
  },

  methods: {
    init() {
      const version = localStorage.getItem('ripa_pii_review_version')

      if (version) {
        this.version = Number(version)

        if (version === '2') {
          this.showingVersionTwoStops = true
        } else {
          this.showingVersionTwoStops = false
        }
      }

      this.$emit('get-pii-entities', this.version)
    },

    handleMarkFalsePositive(id) {
      this.$emit('handle-mark-false-positive', { id, version: this.version })
    },

    handleReview(id) {
      localStorage.setItem('ripa_pii_review_version', this.version)
      this.$emit('handle-review-stop', {
        id,
        version: this.version,
        path: window.location.pathname,
      })
    },
  },

  created() {
    this.init()
  },

  watch: {
    showingVersionTwoStops(value) {
      if (value) {
        this.version = 2
        this.$emit('get-pii-entities', this.version)
      } else {
        this.version = 1
        this.$emit('get-pii-entities', this.version)
      }
    },
  },

  props: {
    piiEntities: {
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

<style scoped>
.group {
  background-color: black;
}
</style>
