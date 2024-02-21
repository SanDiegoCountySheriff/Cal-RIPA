<template>
  <div class="ripa-override-pii tw-pb-4">
    <ripa-form-header title="Override PII"> </ripa-form-header>

    <v-container>
      <v-row no-gutters>
        <v-col cols="12" sm="12" class="mb-2">
          Is PII Found:
          {{ apiStop.isPiiFound }}
          <v-btn
            v-if="apiStop.isPiiFound"
            @click="handleFalsePositive"
            class="ml-6"
            color="primary"
          >
            False Positive
          </v-btn>
        </v-col>
        <v-col v-if="apiStop.isPiiFound" cols="12" sm="12">
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th>PII Item</th>
                  <th>PII Category</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in apiStop.piiEntities" :key="index">
                  <td>{{ item.entityText }}</td>
                  <td>{{ item.category }}</td>
                  <td>{{ item.source }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
        <v-col cols="12" sm="6">
          <ripa-switch
            v-model="model.overridePii"
            label="Override"
            :max-width="250"
            @input="handleInput"
          ></ripa-switch>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import RipaFormHeader from '@/components/molecules/RipaFormHeader'
import RipaSwitch from '@/components/atoms/RipaSwitch'

export default {
  name: 'ripa-override-pii',

  components: {
    RipaSwitch,
    RipaFormHeader,
  },

  data() {
    return {
      viewModel: this.value,
    }
  },

  computed: {
    model: {
      get() {
        return this.viewModel
      },
    },
  },

  methods: {
    handleInput() {
      this.$emit('input', this.viewModel)
    },

    handleFalsePositive() {
      this.viewModel.overridePii = true
      this.viewModel.editStopExplanation = 'PII Override - false positive'
      this.handleInput()
    },
  },

  props: {
    value: {
      type: Object,
      required: true,
    },
    apiStop: {
      type: Object,
      required: true,
    },
  },
}
</script>
